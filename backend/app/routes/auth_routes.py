from flask import Blueprint, request, jsonify
from .. import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    # placeholder: validate and return JWT
    return jsonify({"msg": "login endpoint placeholder"}), 200

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    # placeholder: create user
    return jsonify({"msg": "signup endpoint placeholder"}), 201

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    # placeholder
    return jsonify({"msg": "password reset placeholder"}), 200
