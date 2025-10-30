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

    # Enable CORS for React frontend
    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

    # Blueprints
    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)

    # Health check route
    @app.route("/health")
    def health():
        return {"status": "ok"}

    return app