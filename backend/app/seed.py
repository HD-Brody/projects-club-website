from app import create_app, db
from app.models import User, Profile, Project, Application
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    # Users
    alice = User(email='alice@example.com', password_hash=generate_password_hash('password'))
    bob = User(email='bob@example.com', password_hash=generate_password_hash('password'))

    # Profiles
    alice.profile = Profile(full_name='Alice Chen', program='CS', year='2')
    bob.profile = Profile(full_name='Bob Li', program='Math', year='3')

    # Projects
    proj1 = Project(owner=alice, title='UofT Projects Site', description='Building the official club website.')
    proj2 = Project(owner=bob, title='AI Image Generator', description='Creative AI art tool.')

    # Applications (Bob applies to Alice's project)
    app1 = Application(applicant=bob, project=proj1, role='Frontend Developer')

    db.session.add_all([alice, bob, proj1, proj2, app1])
    db.session.commit()

    print("✅ Seeded test data.")
