from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from .. import db
from app.models import User, Profile
from app.utils.auth import hash_password, verify_password, create_jwt

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
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
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    new_user = User(email=email, password_hash=hash_password(password))
    db.session.add(new_user)
    db.session.commit()

    # create empty profile
    profile = Profile(user_id=new_user.id)
    db.session.add(profile)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

import secrets
from datetime import datetime, timedelta

reset_tokens = {}  # in-memory store for dev/testing

@auth_bp.route('/request-password-reset', methods=['POST'])
def request_password_reset():
    data = request.get_json()
    email = data.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Email not found"}), 404

    token = secrets.token_urlsafe(16)
    # store token with expiry (e.g., 15 min)
    reset_tokens[token] = {"user_id": user.id, "expires": datetime.utcnow() + timedelta(minutes=15)}

    # for dev: just return token instead of sending email
    return jsonify({"reset_token": token}), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')

    token_data = reset_tokens.get(token)
    if not token_data or token_data['expires'] < datetime.utcnow():
        return jsonify({"error": "Invalid or expired token"}), 400

    user = User.query.get(token_data['user_id'])
    user.password_hash = hash_password(new_password)
    db.session.commit()

    # remove used token
    del reset_tokens[token]

    return jsonify({"message": "Password reset successful"}), 200
