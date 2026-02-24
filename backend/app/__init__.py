from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
import os

db = SQLAlchemy()
jwt = JWTManager()
limiter = Limiter(key_func=get_remote_address, default_limits=[])

def create_app(config_object=None):
    load_dotenv()  # loads .env in dev
    app = Flask(__name__)

    if config_object:
        app.config.from_object(config_object)
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
        app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
        app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', os.environ['SECRET_KEY'])
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate = Migrate(app, db)
    jwt.init_app(app)

    # Configure JWT to use string identities
    @jwt.user_identity_loader
    def user_identity_lookup(user):
        return str(user)
    
    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        from app.models import User
        return User.query.get(int(identity))

    # JWT error handlers for better debugging
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {"error": "Token has expired", "msg": "Please log in again"}, 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {"error": "Invalid token", "msg": str(error)}, 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {"error": "Authorization required", "msg": "Missing or invalid Authorization header"}, 401

    limiter.init_app(app)

    # Enable CORS — read allowed origins from env, fall back to localhost for dev
    cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173').split(',')
    CORS(app, origins=[o.strip() for o in cors_origins], supports_credentials=True)

    # Blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.profile_routes import profile_bp
    from app.routes.project_routes import project_bp
    from app.routes.htf_routes import htf_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    app.register_blueprint(project_bp, url_prefix='/api/projects')
    app.register_blueprint(htf_bp, url_prefix='/api/htf')

    # Health check route
    @app.route("/health")
    def health():
        return {"status": "ok"}

    return app