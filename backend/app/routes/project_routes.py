from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, or_
from .. import db
from app.models import Project, User, Profile, Application
import math

project_bp = Blueprint('project', __name__)

@project_bp.route('/', methods=['GET'])
def list_projects():
    # placeholder listing
    return jsonify({"projects": []})

@project_bp.route('/', methods=['POST'])
@jwt_required()
def create_project():
    """
    Create a new project.
    Required: title, description, category
    Optional: skills (comma-separated)
    """
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    data = request.get_json() or {}
    
    # Validate required fields
    title = data.get('title', '').strip()
    description = data.get('description', '').strip()
    category = data.get('category', '').strip()
    skills = data.get('skills', '').strip()
    
    if not title:
        return jsonify({"msg": "Title is required"}), 400
    if not description:
        return jsonify({"msg": "Description is required"}), 400
    if not category:
        return jsonify({"msg": "Category is required"}), 400
    
    # Create project
    project = Project(
        owner_id=user_id,
        title=title,
        description=description,
        category=category,
        skills=skills or None
    )
    
    db.session.add(project)
    db.session.commit()
    
    return jsonify({
        'id': project.id,
        'title': project.title,
        'description': project.description,
        'skills': project.skills,
        'category': project.category,
        'owner_id': project.owner_id,
        'created_at': project.created_at.isoformat()
    }), 201

@project_bp.route('/search', methods=['GET'])
def search_projects():
    """
    Search and filter projects with pagination.
    Query params:
    - q: keyword search (title, description)
    - skills: comma-separated skills to match
    - category: project category
    - sort: newest (default), az, most_applications
    - page: page number (default 1)
    - limit: results per page (default 10)
    """
    # Get query parameters
    keyword = request.args.get('q', '').strip()
    skills_filter = request.args.get('skills', '').strip()
    category_filter = request.args.get('category', '').strip()
    sort_by = request.args.get('sort', 'newest')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    
    # Start building query
    query = Project.query
    
    # Apply keyword search (case-insensitive)
    if keyword:
        search_pattern = f"%{keyword}%"
        query = query.filter(
            or_(
                Project.title.ilike(search_pattern),
                Project.description.ilike(search_pattern)
            )
        )
    
    # Apply skills filter
    if skills_filter:
        # Match any of the provided skills (comma-separated)
        skills_list = [s.strip() for s in skills_filter.split(',')]
        skill_conditions = [Project.skills.ilike(f"%{skill}%") for skill in skills_list]
        query = query.filter(or_(*skill_conditions))
    
    # Apply category filter
    if category_filter:
        query = query.filter(Project.category == category_filter)
    
    # Apply sorting
    if sort_by == 'az':
        query = query.order_by(Project.title.asc())
    elif sort_by == 'most_applications':
        # Count applications per project and sort
        query = query.outerjoin(Application).group_by(Project.id).order_by(
            func.count(Application.id).desc()
        )
    else:  # newest (default)
        query = query.order_by(Project.created_at.desc())
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * limit
    projects = query.limit(limit).offset(offset).all()
    
    # Serialize projects
    projects_data = []
    for project in projects:
        # Get owner info
        owner = User.query.get(project.owner_id)
        owner_profile = Profile.query.filter_by(user_id=project.owner_id).first()
        
        projects_data.append({
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'skills': project.skills,
            'category': project.category,
            'created_at': project.created_at.isoformat() if project.created_at else None,
            'owner': {
                'id': owner.id if owner else None,
                'email': owner.email if owner else None,
                'name': owner_profile.full_name if owner_profile else None
            },
            'application_count': len(project.applications)
        })
    
    # Calculate total pages
    total_pages = math.ceil(total / limit) if limit > 0 else 0
    
    return jsonify({
        'projects': projects_data,
        'total': total,
        'page': page,
        'pages': total_pages,
        'limit': limit
    }), 200

@project_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_projects():
    """
    Get all projects created by the current user.
    """
    user_id = int(get_jwt_identity())
    
    projects = Project.query.filter_by(owner_id=user_id).order_by(Project.created_at.desc()).all()
    
    projects_data = []
    for project in projects:
        projects_data.append({
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'skills': project.skills,
            'category': project.category,
            'created_at': project.created_at.isoformat() if project.created_at else None,
            'application_count': len(project.applications)
        })
    
    return jsonify(projects_data), 200


@project_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_projects(user_id):
    """
    Get all projects owned by a specific user (public).
    Also includes projects where the user is an accepted member.
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Projects owned by the user
    owned = Project.query.filter_by(owner_id=user_id).order_by(Project.created_at.desc()).all()
    projects_data = []
    seen_ids = set()
    for project in owned:
        seen_ids.add(project.id)
        projects_data.append({
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'skills': project.skills,
            'category': project.category,
            'created_at': project.created_at.isoformat() if project.created_at else None,
            'role': 'Owner'
        })

    # Projects where user is an accepted member
    accepted_apps = Application.query.filter_by(user_id=user_id, status='accepted').all()
    for app in accepted_apps:
        if app.project_id not in seen_ids:
            project = Project.query.get(app.project_id)
            if project:
                seen_ids.add(project.id)
                projects_data.append({
                    'id': project.id,
                    'title': project.title,
                    'description': project.description,
                    'skills': project.skills,
                    'category': project.category,
                    'created_at': project.created_at.isoformat() if project.created_at else None,
                    'role': 'Member'
                })

    return jsonify(projects_data), 200

@project_bp.route('/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    """
    Update a project (owner-only).
    """
    user_id = int(get_jwt_identity())
    
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"msg": "Project not found"}), 404
    
    if project.owner_id != user_id:
        return jsonify({"msg": "Only project owner can update this project"}), 403
    
    data = request.get_json() or {}
    
    # Update fields if provided
    if 'title' in data:
        title = data['title'].strip()
        if not title:
            return jsonify({"msg": "Title cannot be empty"}), 400
        project.title = title
    
    if 'description' in data:
        description = data['description'].strip()
        if not description:
            return jsonify({"msg": "Description cannot be empty"}), 400
        project.description = description
    
    if 'category' in data:
        category = data['category'].strip()
        if not category:
            return jsonify({"msg": "Category cannot be empty"}), 400
        project.category = category
    
    if 'skills' in data:
        project.skills = data['skills'].strip() or None
    
    db.session.commit()
    
    return jsonify({
        'id': project.id,
        'title': project.title,
        'description': project.description,
        'skills': project.skills,
        'category': project.category,
        'created_at': project.created_at.isoformat() if project.created_at else None
    }), 200

@project_bp.route('/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    """
    Delete a project (owner-only).
    """
    user_id = int(get_jwt_identity())
    
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"msg": "Project not found"}), 404
    
    if project.owner_id != user_id:
        return jsonify({"msg": "Only project owner can delete this project"}), 403
    
    # Delete all applications for this project first
    Application.query.filter_by(project_id=project_id).delete()
    
    db.session.delete(project)
    db.session.commit()
    
    return jsonify({"msg": "Project deleted successfully"}), 200

@project_bp.route('/applications/me', methods=['GET'])
@jwt_required()
def get_my_applications():
    """
    Get all applications submitted by the current user.
    """
    user_id = int(get_jwt_identity())
    
    applications = Application.query.filter_by(user_id=user_id).all()
    
    apps_data = []
    for app in applications:
        project = Project.query.get(app.project_id)
        owner = User.query.get(project.owner_id) if project else None
        owner_profile = Profile.query.filter_by(user_id=project.owner_id).first() if project else None
        
        apps_data.append({
            'id': app.id,
            'project_id': app.project_id,
            'role': app.role,
            'status': app.status,
            'created_at': app.created_at.isoformat(),
            'project': {
                'id': project.id if project else None,
                'title': project.title if project else None,
                'category': project.category if project else None,
                'owner': {
                    'id': owner.id if owner else None,
                    'name': owner_profile.full_name if owner_profile else None
                }
            } if project else None
        })
    
    return jsonify(apps_data), 200

@project_bp.route('/<int:project_id>/applications', methods=['GET'])
@jwt_required()
def get_project_applications(project_id):
    """
    Get all applications for a project (owner-only).
    """
    user_id = int(get_jwt_identity())
    project = Project.query.get(project_id)
    
    if not project:
        return jsonify({"msg": "Project not found"}), 404
    
    if project.owner_id != user_id:
        return jsonify({"msg": "Only project owner can view applications"}), 403
    
    applications = Application.query.filter_by(project_id=project_id).all()
    
    apps_data = []
    for app in applications:
        applicant = User.query.get(app.user_id)
        applicant_profile = Profile.query.filter_by(user_id=app.user_id).first()
        
        apps_data.append({
            'id': app.id,
            'project_id': app.project_id,
            'user_id': app.user_id,
            'role': app.role,
            'status': app.status,
            'created_at': app.created_at.isoformat(),
            'applicant': {
                'id': applicant.id if applicant else None,
                'email': applicant.email if applicant else None,
                'name': applicant_profile.full_name if applicant_profile else None
            }
        })
    
    return jsonify(apps_data), 200

@project_bp.route('/<int:project_id>/apply', methods=['POST'])
@jwt_required()
def apply_project(project_id):
    """
    Submit an application to a project.
    Required: role
    """
    user_id = int(get_jwt_identity())
    
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"msg": "Project not found"}), 404
    
    # Cannot apply to own project
    if project.owner_id == user_id:
        return jsonify({"msg": "Cannot apply to your own project"}), 400
    
    # Check for duplicate application
    existing_app = Application.query.filter_by(
        project_id=project_id,
        user_id=user_id
    ).first()
    
    if existing_app:
        return jsonify({"msg": "Already applied to this project"}), 400
    
    data = request.get_json() or {}
    role = data.get('role', '').strip()
    
    if not role:
        return jsonify({"msg": "Role is required"}), 400
    
    # Create application with pending status
    application = Application(
        project_id=project_id,
        user_id=user_id,
        role=role,
        status='pending'
    )
    
    db.session.add(application)
    db.session.commit()
    
    return jsonify({
        'id': application.id,
        'project_id': application.project_id,
        'user_id': application.user_id,
        'role': application.role,
        'status': application.status,
        'created_at': application.created_at.isoformat()
    }), 201

@project_bp.route('/applications/<int:application_id>/status', methods=['PUT'])
@jwt_required()
def update_application_status(application_id):
    """
    Update application status (owner-only).
    Required: status (accepted or rejected)
    """
    user_id = int(get_jwt_identity())
    
    application = Application.query.get(application_id)
    if not application:
        return jsonify({"msg": "Application not found"}), 404
    
    project = Project.query.get(application.project_id)
    if not project:
        return jsonify({"msg": "Project not found"}), 404
    
    if project.owner_id != user_id:
        return jsonify({"msg": "Only project owner can update applications"}), 403
    
    data = request.get_json() or {}
    new_status = data.get('status', '').strip()
    
    if new_status not in ['accepted', 'rejected']:
        return jsonify({"msg": "Status must be 'accepted' or 'rejected'"}), 400
    
    application.status = new_status
    db.session.commit()
    
    return jsonify({
        'id': application.id,
        'project_id': application.project_id,
        'user_id': application.user_id,
        'role': application.role,
        'status': application.status,
        'created_at': application.created_at.isoformat()
    }), 200
