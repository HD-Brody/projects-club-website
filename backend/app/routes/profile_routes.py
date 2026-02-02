from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import db
from app.models import User, Profile

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
