from flask import Blueprint, request, jsonify
from .. import db

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/', methods=['GET'])
def get_profile():
    # placeholder
    return jsonify({"msg": "get profile placeholder"})

@profile_bp.route('/', methods=['PUT'])
def update_profile():
    data = request.get_json() or {}
    return jsonify({"msg": "update profile placeholder"})
