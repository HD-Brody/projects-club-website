from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'b30fe4f34cdb'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Create tables
    op.create_table('users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('created_at', postgresql.TIMESTAMP(), nullable=True)
    )

    op.create_table('projects',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('owner_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('created_at', postgresql.TIMESTAMP(), nullable=True)
    )

    op.create_table('profiles',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=True),
        sa.Column('program', sa.String(length=128), nullable=True),
        sa.Column('year', sa.String(length=16), nullable=True)
    )

    op.create_table('applications',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('project_id', sa.Integer, sa.ForeignKey('projects.id'), nullable=False),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('role', sa.String(length=64), nullable=True),
        sa.Column('created_at', postgresql.TIMESTAMP(), nullable=True)
    )

def downgrade():
    # Drop tables in reverse order
    op.drop_table('applications')
    op.drop_table('profiles')
    op.drop_table('projects')
    op.drop_table('users')