"""
Seed script to add sample projects for testing the search functionality.
Run this with: python seed_projects.py
"""
from app import create_app, db
from app.models import Project, User
from datetime import datetime, timedelta

def seed_projects():
    app = create_app()
    
    with app.app_context():
        # Check if we have any users (need owner_id)
        users = User.query.all()
        if not users:
            print("❌ No users found. Please create at least one user first (via signup).")
            return
        
        owner = users[0]  # Use first user as owner
        
        # Sample projects
        sample_projects = [
            {
                'title': 'AI Study Buddy - Smart Flashcard App',
                'description': 'Building an AI-powered flashcard application that uses spaced repetition and machine learning to optimize study sessions. Looking for developers interested in EdTech!',
                'skills': 'Python, Machine Learning, React, Flask, PostgreSQL',
                'category': 'AI/ML',
                'owner_id': owner.id,
                'created_at': datetime.utcnow() - timedelta(days=2)
            },
            {
                'title': 'Campus Event Finder Mobile App',
                'description': 'A mobile app to discover and share campus events. Features include event recommendations, RSVP, and social sharing. Need mobile developers and UI/UX designers.',
                'skills': 'React Native, Node.js, MongoDB, Firebase',
                'category': 'Mobile App',
                'owner_id': owner.id,
                'created_at': datetime.utcnow() - timedelta(days=5)
            },
            {
                'title': 'Sustainable Campus Tracker',
                'description': 'Web platform to track and visualize sustainability initiatives across campus. Interactive dashboards showing carbon footprint, recycling stats, and green initiatives.',
                'skills': 'JavaScript, D3.js, Python, Django, Chart.js',
                'category': 'Web Development',
                'owner_id': owner.id,
                'created_at': datetime.utcnow() - timedelta(days=10)
            },
            {
                'title': 'Student Marketplace',
                'description': 'E-commerce platform for students to buy, sell, and trade textbooks, furniture, and other items. Focused on secure transactions and community trust.',
                'skills': 'React, TypeScript, Express, Stripe, AWS',
                'category': 'Web Development',
                'owner_id': owner.id,
                'created_at': datetime.utcnow() - timedelta(days=15)
            },
            {
                'title': 'Mental Health Chatbot',
                'description': 'An empathetic AI chatbot to provide mental health support and resources to students. Using NLP to detect emotional states and provide appropriate responses.',
                'skills': 'Python, NLP, TensorFlow, React, FastAPI',
                'category': 'AI/ML',
                'owner_id': owner.id,
                'created_at': datetime.utcnow() - timedelta(days=7)
            },
            {
                'title': 'Course Review Platform',
                'description': 'Platform for students to share honest course reviews, professor ratings, and study tips. Includes filtering by department, difficulty, and workload.',
                'skills': 'Vue.js, Node.js, MongoDB, Express',
                'category': 'Web Development',
                'owner_id': owner.id,
                'created_at': datetime.utcnow() - timedelta(days=12)
            },
            {
                'title': 'Fitness Tracker for Students',
                'description': 'Mobile app to track workouts, nutrition, and wellness goals specifically designed for busy student schedules. Includes study break reminders.',
                'skills': 'Flutter, Dart, Firebase, Health APIs',
                'category': 'Mobile App',
                'owner_id': owner.id,
                'created_at': datetime.utcnow() - timedelta(days=8)
            },
            {
                'title': 'Campus Navigation AR App',
                'description': 'Augmented reality app to help students navigate campus buildings. Point your phone to get directions, building info, and event locations.',
                'skills': 'Unity, C#, ARKit, ARCore, Mobile Development',
                'category': 'Mobile App',
                'owner_id': owner.id,
                'created_at': datetime.utcnow() - timedelta(days=20)
            },
            {
                'title': 'Research Paper Summarizer',
                'description': 'NLP tool that automatically summarizes academic papers and extracts key findings. Helps students quickly understand research literature.',
                'skills': 'Python, Transformers, BERT, React, FastAPI',
                'category': 'AI/ML',
                'owner_id': owner.id,
                'created_at': datetime.utcnow() - timedelta(days=3)
            },
            {
                'title': 'Portfolio Builder for Students',
                'description': 'Easy-to-use platform for students to create professional portfolios showcasing projects, skills, and achievements. Drag-and-drop interface with beautiful templates.',
                'skills': 'React, TypeScript, Node.js, Tailwind CSS, PostgreSQL',
                'category': 'Web Development',
                'owner_id': owner.id,
                'created_at': datetime.utcnow() - timedelta(days=1)
            }
        ]
        
        # Add projects to database
        added = 0
        for proj_data in sample_projects:
            # Check if similar project exists
            existing = Project.query.filter_by(title=proj_data['title']).first()
            if not existing:
                project = Project(**proj_data)
                db.session.add(project)
                added += 1
        
        db.session.commit()
        print(f"✅ Successfully added {added} sample projects to the database!")
        print(f"   Total projects in database: {Project.query.count()}")

if __name__ == '__main__':
    seed_projects()
