from flask import Blueprint, request, jsonify
from .. import db

project_bp = Blueprint('project', __name__)

@project_bp.route('/', methods=['GET'])
def list_projects():
    # placeholder listing
    return jsonify({"projects": []})

@project_bp.route('/<int:project_id>/apply', methods=['POST'])
def apply_project(project_id):
    data = request.get_json() or {}
    return jsonify({"msg": "application placeholder"}), 201
