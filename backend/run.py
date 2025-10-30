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

app = create_app(Config)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(host='0.0.0.0', port=5000, debug=True)