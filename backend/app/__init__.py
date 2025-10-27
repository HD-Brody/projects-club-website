from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_object=None):
    app = Flask(__name__, static_folder=None)

    # Load config from object or environment
    if config_object:
        app.config.from_object(config_object)
    else:
        # sensible defaults and allow override via env vars
        app.config.from_envvar('APP_CONFIG_FILE', silent=True)

    db.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173"]}}, supports_credentials=True)

    # register routes
    from .routes import register_routes
    register_routes(app)

    return app
