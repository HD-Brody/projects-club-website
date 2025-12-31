from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_object=None):
    load_dotenv()  # loads .env in dev
    app = Flask(__name__)

    if config_object:
        app.config.from_object(config_object)
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
        app.config['SECRET_KEY'] = os.getenv('SECRET_KEY') or 'dev-secret'
        app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY') or 'dev-jwt-secret'
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

    # Enable CORS for React frontend (Vite dev server runs on 5173)
    CORS(app, origins=["http://localhost:3000", "http://localhost:5173"], supports_credentials=True)

    # Blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.profile_routes import profile_bp
    from app.routes.project_routes import project_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    app.register_blueprint(project_bp, url_prefix='/api/projects')

    # Health check route
    @app.route("/health")
    def health():
        return {"status": "ok"}

    return app