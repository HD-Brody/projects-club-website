from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
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
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # register blueprints
    from .routes.health import bp as health_bp
    app.register_blueprint(health_bp, url_prefix='/')

    return app