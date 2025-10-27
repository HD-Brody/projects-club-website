def register_routes(app):
    from .auth_routes import auth_bp
    from .profile_routes import profile_bp
    from .project_routes import project_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    app.register_blueprint(project_bp, url_prefix='/api/projects')
