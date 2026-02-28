import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from .. import db
from app.models import HTFSubmission, User, Profile

htf_bp = Blueprint('htf', __name__)

# ──── FEATURE FLAG ────────────────────────────────────────────
# Set HTF_REVEAL=true in env vars to let everyone see all submissions.
# While false (during the event), users only see their own submissions.
# To reveal: just flip this env var on Render and redeploy.
# ──────────────────────────────────────────────────────────────

def _htf_reveal_enabled():
    return os.getenv('HTF_REVEAL', 'false').lower() in ('true', '1', 'yes')


@htf_bp.route('/', methods=['GET'])
def get_submissions():
    """
    Get HTF submissions.
    - If HTF_REVEAL is true: returns ALL submissions (public).
    - If HTF_REVEAL is false: returns only the logged-in user's own submissions.
    """
    reveal = _htf_reveal_enabled()

    # Try to get the current user (optional auth)
    current_user_id = None
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        if identity:
            current_user_id = int(identity)
    except Exception:
        pass

    if reveal:
        submissions = HTFSubmission.query.order_by(HTFSubmission.created_at.desc()).all()
    elif current_user_id:
        submissions = HTFSubmission.query.filter_by(user_id=current_user_id).order_by(HTFSubmission.created_at.desc()).all()
    else:
        # Not logged in and reveal is off — return empty
        return jsonify({'submissions': [], 'reveal': False}), 200

    result = []
    for sub in submissions:
        # Get submitter info
        user = User.query.get(sub.user_id)
        profile = Profile.query.filter_by(user_id=sub.user_id).first()
        
        result.append({
            'id': sub.id,
            'project_name': sub.project_name,
            'team_name': sub.team_name,
            'youtube_url': sub.youtube_url,
            'description': sub.description,
            'created_at': sub.created_at.isoformat() if sub.created_at else None,
            'submitter': {
                'id': user.id if user else None,
                'name': profile.full_name if profile else (user.email.split('@')[0] if user else 'Unknown')
            }
        })
    
    return jsonify({'submissions': result, 'reveal': reveal}), 200


@htf_bp.route('/', methods=['POST'])
@jwt_required()
def create_submission():
    """
    Create a new HTF submission (requires authentication).
    Required: project_name, youtube_url
    Optional: description
    """
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    data = request.get_json() or {}
    
    project_name = data.get('project_name', '').strip()
    team_name = data.get('team_name', '').strip()
    youtube_url = data.get('youtube_url', '').strip()
    description = data.get('description', '').strip()
    
    # Validate required fields
    if not project_name:
        return jsonify({"msg": "Project name is required"}), 400
    if not team_name:
        return jsonify({"msg": "Team name is required"}), 400
    if not youtube_url:
        return jsonify({"msg": "YouTube URL is required"}), 400
    
    # Basic YouTube URL validation
    if not ('youtube.com' in youtube_url or 'youtu.be' in youtube_url):
        return jsonify({"msg": "Please provide a valid YouTube URL"}), 400
    
    # Create submission
    submission = HTFSubmission(
        user_id=user_id,
        project_name=project_name,
        team_name=team_name,
        youtube_url=youtube_url,
        description=description or None
    )
    
    db.session.add(submission)
    db.session.commit()
    
    # Get profile for response
    profile = Profile.query.filter_by(user_id=user_id).first()
    
    return jsonify({
        'id': submission.id,
        'project_name': submission.project_name,
        'team_name': submission.team_name,
        'youtube_url': submission.youtube_url,
        'description': submission.description,
        'created_at': submission.created_at.isoformat(),
        'submitter': {
            'id': user.id,
            'name': profile.full_name if profile else user.email.split('@')[0]
        }
    }), 201


@htf_bp.route('/<int:submission_id>', methods=['DELETE'])
@jwt_required()
def delete_submission(submission_id):
    """
    Delete an HTF submission (only owner can delete).
    """
    user_id = int(get_jwt_identity())
    
    submission = HTFSubmission.query.get(submission_id)
    
    if not submission:
        return jsonify({"msg": "Submission not found"}), 404
    
    if submission.user_id != user_id:
        return jsonify({"msg": "You can only delete your own submissions"}), 403
    
    db.session.delete(submission)
    db.session.commit()
    
    return jsonify({"msg": "Submission deleted successfully"}), 200
