"""add social fields to profile

Revision ID: a1b2c3d4e5f6
Revises: f81785d70c71
Create Date: 2026-02-02 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = '3a8f5c2b1d9e'
branch_labels = None
depends_on = None


def upgrade():
    # Add social media columns to profiles table
    op.add_column('profiles', sa.Column('linkedin', sa.String(255), nullable=True))
    op.add_column('profiles', sa.Column('discord', sa.String(255), nullable=True))
    op.add_column('profiles', sa.Column('instagram', sa.String(255), nullable=True))


def downgrade():
    # Remove social media columns from profiles table
    op.drop_column('profiles', 'instagram')
    op.drop_column('profiles', 'discord')
    op.drop_column('profiles', 'linkedin')
