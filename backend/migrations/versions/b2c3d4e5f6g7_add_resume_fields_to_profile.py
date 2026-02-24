"""add resume fields to profile

Revision ID: b2c3d4e5f6g7
Revises: a1b2c3d4e5f6
Create Date: 2026-02-02 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b2c3d4e5f6g7'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade():
    # Add resume columns to profiles table
    op.add_column('profiles', sa.Column('resume_filename', sa.String(255), nullable=True))
    op.add_column('profiles', sa.Column('resume_data', sa.LargeBinary(), nullable=True))


def downgrade():
    # Remove resume columns from profiles table
    op.drop_column('profiles', 'resume_data')
    op.drop_column('profiles', 'resume_filename')
