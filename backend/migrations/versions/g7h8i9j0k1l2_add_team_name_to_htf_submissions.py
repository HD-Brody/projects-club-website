"""add team_name to htf_submissions

Revision ID: g7h8i9j0k1l2
Revises: c4d5e6f7g8h9
Create Date: 2026-02-28

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'g7h8i9j0k1l2'
down_revision = 'c4d5e6f7g8h9'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('htf_submissions', sa.Column('team_name', sa.String(length=255), nullable=False, server_default=''))


def downgrade():
    op.drop_column('htf_submissions', 'team_name')
