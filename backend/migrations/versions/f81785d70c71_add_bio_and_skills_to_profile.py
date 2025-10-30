"""add bio and skills to profile

Revision ID: f81785d70c71
Revises: b30fe4f34cdb
Create Date: 2025-10-30 17:49:33.528967

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'f81785d70c71'
down_revision = 'b30fe4f34cdb'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('profiles', sa.Column('bio', sa.Text(), nullable=True))
    op.add_column('profiles', sa.Column('skills', sa.Text(), nullable=True))

def downgrade():
    op.drop_column('profiles', 'skills')
    op.drop_column('profiles', 'bio')