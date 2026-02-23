from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from .. import db, limiter
from app.models import User, Profile, PasswordResetToken
from app.utils.auth import hash_password, verify_password, create_jwt
from app.utils.email import send_password_reset_email, send_welcome_email
import secrets
from datetime import datetime, timedelta
import os

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# ── helpers ──────────────────────────────────────────────────
def _validate_password(password):
    """Return an error string if the password is too weak, else None."""
    if not password or len(password) < 8:
        return "Password must be at least 8 characters"
    return None


def _cleanup_expired_tokens():
    """Delete expired / used reset tokens (best-effort housekeeping)."""
    try:
        PasswordResetToken.query.filter(
            (PasswordResetToken.expires_at < datetime.utcnow()) | (PasswordResetToken.used == True)
        ).delete(synchronize_session=False)
        db.session.commit()
    except Exception:
        db.session.rollback()


# ── routes ───────────────────────────────────────────────────
@auth_bp.route('/login', methods=['POST'])
@limiter.limit("10/minute")
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not verify_password(password, user.password_hash):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_jwt(user.id)
    return jsonify({"access_token": access_token, "user_id": user.id}), 200


@auth_bp.route('/signup', methods=['POST'])
@limiter.limit("5/minute")
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    pw_err = _validate_password(password)
    if pw_err:
        return jsonify({"error": pw_err}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    new_user = User(email=email, password_hash=hash_password(password))
    db.session.add(new_user)
    db.session.commit()

    # create empty profile
    profile = Profile(user_id=new_user.id)
    db.session.add(profile)
    db.session.commit()

    # Send welcome email (optional, doesn't block signup if it fails)
    try:
        send_welcome_email(email, email)
    except Exception as e:
        print(f"Failed to send welcome email: {e}")

    # Return token so user is auto-logged in
    access_token = create_jwt(new_user.id)
    return jsonify({
        "message": "User created successfully",
        "access_token": access_token,
        "user_id": new_user.id
    }), 201

@auth_bp.route('/request-password-reset', methods=['POST'])
@limiter.limit("5/minute")
def request_password_reset():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    user = User.query.filter_by(email=email).first()
    
    # For security, always return success even if email doesn't exist
    # This prevents email enumeration attacks
    if not user:
        return jsonify({"message": "If that email exists, a reset link has been sent"}), 200
    
    # Housekeeping: remove old tokens
    _cleanup_expired_tokens()

    # Generate secure token and persist to DB
    token = secrets.token_urlsafe(32)
    reset_entry = PasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(minutes=15),
    )
    db.session.add(reset_entry)
    db.session.commit()
    
    # Build reset link
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
    reset_link = f"{frontend_url}/#/reset-password?token={token}"
    
    # Send email
    try:
        email_sent = send_password_reset_email(email, reset_link, email)
        if email_sent:
            return jsonify({"message": "Password reset email sent"}), 200
        else:
            # Email failed but don't expose this to user
            print(f"Failed to send reset email to {email}")
            return jsonify({"message": "If that email exists, a reset link has been sent"}), 200
    except Exception as e:
        print(f"Error sending reset email: {e}")
        return jsonify({"error": "Failed to send reset email. Please try again later."}), 500

@auth_bp.route('/reset-password', methods=['POST'])
@limiter.limit("5/minute")
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')

    pw_err = _validate_password(new_password)
    if pw_err:
        return jsonify({"error": pw_err}), 400

    # Look up token in DB
    reset_entry = PasswordResetToken.query.filter_by(token=token, used=False).first()
    if not reset_entry or reset_entry.expires_at < datetime.utcnow():
        return jsonify({"error": "Invalid or expired token"}), 400

    user = User.query.get(reset_entry.user_id)
    user.password_hash = hash_password(new_password)

    # Mark token as used so it can't be replayed
    reset_entry.used = True
    db.session.commit()

    return jsonify({"message": "Password reset successful"}), 200
