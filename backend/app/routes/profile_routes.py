from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from app.models import User, Profile
import io

profile_bp = Blueprint('profile', __name__)

def serialize_profile(user: User, profile: Profile):
    return {
        "user_id": user.id,
        "email": user.email,
        "full_name": (profile.full_name if profile else None),
        "program": (profile.program if profile else None),
        "year": (profile.year if profile else None),
        "bio": (profile.bio if profile else None),
        "skills": (profile.skills if profile else None),
        "linkedin": (profile.linkedin if profile else None),
        "discord": (profile.discord if profile else None),
        "instagram": (profile.instagram if profile else None),
        "resume_filename": (profile.resume_filename if profile else None),
        "has_avatar": bool(profile and profile.avatar_data),
    }

@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = user.profile
    return jsonify(serialize_profile(user, profile)), 200


@profile_bp.route('/<int:user_id>', methods=['GET'])
def get_public_profile(user_id):
    """Get a public view of another user's profile (no auth required)."""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = user.profile
    # Return a subset — omit resume and email for privacy
    return jsonify({
        "user_id": user.id,
        "full_name": (profile.full_name if profile else None),
        "program": (profile.program if profile else None),
        "year": (profile.year if profile else None),
        "bio": (profile.bio if profile else None),
        "skills": (profile.skills if profile else None),
        "linkedin": (profile.linkedin if profile else None),
        "discord": (profile.discord if profile else None),
        "instagram": (profile.instagram if profile else None),
        "has_resume": bool(profile and profile.resume_filename),
        "has_avatar": bool(profile and profile.avatar_data),
    }), 200

@profile_bp.route('/', methods=['PUT'])
@jwt_required()
def update_profile():
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json() or {}

    # Support both 'bio' and legacy 'description' from frontend
    bio = data.get('bio', data.get('description'))
    skills = data.get('skills')
    full_name = data.get('full_name')
    program = data.get('program')
    year = data.get('year')
    
    # Social media fields (optional)
    linkedin = data.get('linkedin')
    discord = data.get('discord')
    instagram = data.get('instagram')

    profile = user.profile
    if not profile:
        profile = Profile(user_id=user.id)
        db.session.add(profile)

    if full_name is not None:
        profile.full_name = full_name
    if program is not None:
        profile.program = program
    if year is not None:
        profile.year = year
    if bio is not None:
        profile.bio = bio
    if skills is not None:
        profile.skills = skills
    if linkedin is not None:
        profile.linkedin = linkedin
    if discord is not None:
        profile.discord = discord
    if instagram is not None:
        profile.instagram = instagram

    db.session.commit()

    return jsonify(serialize_profile(user, profile)), 200


@profile_bp.route('/resume', methods=['POST'])
@jwt_required()
def upload_resume():
    """Upload a resume PDF file"""
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400

    file = request.files['resume']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Check file extension
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Only PDF files are allowed"}), 400

    # Read file data
    file_data = file.read()
    
    # Check file size (max 5MB)
    if len(file_data) > 5 * 1024 * 1024:
        return jsonify({"error": "File size must be less than 5MB"}), 400

    profile = user.profile
    if not profile:
        profile = Profile(user_id=user.id)
        db.session.add(profile)

    profile.resume_filename = file.filename
    profile.resume_data = file_data
    db.session.commit()

    return jsonify({
        "message": "Resume uploaded successfully",
        "resume_filename": profile.resume_filename
    }), 200


@profile_bp.route('/resume', methods=['GET'])
@jwt_required()
def download_resume():
    """Download the user's resume"""
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = user.profile
    if not profile or not profile.resume_data:
        return jsonify({"error": "No resume uploaded"}), 404

    return send_file(
        io.BytesIO(profile.resume_data),
        mimetype='application/pdf',
        as_attachment=False,
        download_name=profile.resume_filename
    )


@profile_bp.route('/resume', methods=['DELETE'])
@jwt_required()
def delete_resume():
    """Delete the user's resume"""
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = user.profile
    if not profile or not profile.resume_data:
        return jsonify({"error": "No resume to delete"}), 404

    profile.resume_filename = None
    profile.resume_data = None
    db.session.commit()

    return jsonify({"message": "Resume deleted successfully"}), 200


@profile_bp.route('/avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    """Upload or replace a profile picture"""
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if 'avatar' not in request.files:
        return jsonify({"error": "No avatar file provided"}), 400

    file = request.files['avatar']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Check file type
    allowed_mimetypes = {'image/jpeg', 'image/png', 'image/webp'}
    mimetype = file.content_type or ''
    if mimetype not in allowed_mimetypes:
        return jsonify({"error": "Only JPEG, PNG, and WebP images are allowed"}), 400

    # Read file data
    file_data = file.read()

    # Check file size (max 2MB)
    if len(file_data) > 2 * 1024 * 1024:
        return jsonify({"error": "Image size must be less than 2MB"}), 400

    profile = user.profile
    if not profile:
        profile = Profile(user_id=user.id)
        db.session.add(profile)

    profile.avatar_data = file_data
    profile.avatar_mimetype = mimetype
    db.session.commit()

    return jsonify({"message": "Avatar uploaded successfully"}), 200


@profile_bp.route('/avatar/<int:user_id>', methods=['GET'])
def get_avatar(user_id):
    """Get a user's avatar image (public, no auth)"""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = user.profile
    if not profile or not profile.avatar_data:
        return jsonify({"error": "No avatar"}), 404

    return send_file(
        io.BytesIO(profile.avatar_data),
        mimetype=profile.avatar_mimetype or 'image/jpeg',
        as_attachment=False,
    )


@profile_bp.route('/avatar', methods=['DELETE'])
@jwt_required()
def delete_avatar():
    """Delete the user's avatar"""
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = user.profile
    if not profile or not profile.avatar_data:
        return jsonify({"error": "No avatar to delete"}), 404

    profile.avatar_data = None
    profile.avatar_mimetype = None
    db.session.commit()

    return jsonify({"message": "Avatar deleted successfully"}), 200
