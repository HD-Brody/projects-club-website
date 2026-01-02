from datetime import datetime
from . import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    profile = db.relationship('Profile', back_populates='user', uselist=False, cascade='all, delete-orphan')
    projects = db.relationship('Project', back_populates='owner', cascade='all, delete')
    applications = db.relationship('Application', back_populates='applicant', cascade='all, delete')

class Profile(db.Model):
    __tablename__ = 'profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    full_name = db.Column(db.String(255))
    program = db.Column(db.String(128))
    year = db.Column(db.String(16))
    bio = db.Column(db.Text)               # new
    skills = db.Column(db.Text)            # new, could store comma-separated list or JSON

    # Relationship back
    user = db.relationship('User', back_populates='profile')

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    skills = db.Column(db.Text)  # Comma-separated skills/tags for search
    category = db.Column(db.String(64))  # Project category (e.g., Web, Mobile, AI)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    owner = db.relationship('User', back_populates='projects')
    applications = db.relationship('Application', back_populates='project', cascade='all, delete')

class Application(db.Model):
    __tablename__ = 'applications'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    role = db.Column(db.String(64))
    status = db.Column(db.String(20), default='pending')  # pending, accepted, rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    project = db.relationship('Project', back_populates='applications')
    applicant = db.relationship('User', back_populates='applications')
    applicant = db.relationship('User', back_populates='applications')
