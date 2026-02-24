import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import inspect

# Load environment variables from repository root .env (if present)
base = Path(__file__).resolve().parent
project_root = base.parent
# Load repo-root .env first, then backend/.env so backend-specific values override repo defaults
load_dotenv(project_root / '.env')
load_dotenv(base / '.env', override=True)

from app import create_app, db
from app.config import Config
from app.models import User, Profile, Project, Application
from flask_migrate import upgrade as db_upgrade

app = create_app(Config)

# Run migrations automatically on startup (useful for Render/production)
with app.app_context():
    db_upgrade()

if __name__ == '__main__':
    debug = os.getenv('FLASK_DEBUG', 'false').lower() in ('true', '1', 'yes')
    app.run(host='0.0.0.0', port=5000, debug=debug)