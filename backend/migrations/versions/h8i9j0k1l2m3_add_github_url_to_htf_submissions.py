"""add github_url to htf_submissions

Revision ID: h8i9j0k1l2m3
Revises: g7h8i9j0k1l2
Create Date: 2026-03-03

"""
from alembic import op
import sqlalchemy as sa

revision = 'h8i9j0k1l2m3'
down_revision = 'g7h8i9j0k1l2'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('htf_submissions', sa.Column('github_url', sa.String(length=512), nullable=False, server_default=''))


def downgrade():
    op.drop_column('htf_submissions', 'github_url')
