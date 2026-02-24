"""add_avatar_fields_to_profile

Revision ID: d5e6f7g8h9i0
Revises: c4d5e6f7g8h9
Create Date: 2026-02-23 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd5e6f7g8h9i0'
down_revision = 'c4d5e6f7g8h9'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('profiles', sa.Column('avatar_data', sa.LargeBinary(), nullable=True))
    op.add_column('profiles', sa.Column('avatar_mimetype', sa.String(50), nullable=True))


def downgrade():
    op.drop_column('profiles', 'avatar_mimetype')
    op.drop_column('profiles', 'avatar_data')
