from flask import Blueprint, request, jsonify
from sqlalchemy import func, or_
from .. import db
from app.models import Project, User, Profile
import math

project_bp = Blueprint('project', __name__)

@project_bp.route('/', methods=['GET'])
def list_projects():
    # placeholder listing
    return jsonify({"projects": []})

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
        from app.models import Application
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

@project_bp.route('/<int:project_id>/apply', methods=['POST'])
def apply_project(project_id):
    data = request.get_json() or {}
    return jsonify({"msg": "application placeholder"}), 201
