import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://user:pass@localhost:5432/dbname')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret')
    JWT_SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret')
