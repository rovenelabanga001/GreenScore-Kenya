"""add funding fields and funder target

Revision ID: d4e2c2f985ab
Revises: abc4df313723
Create Date: 2026-05-22 17:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd4e2c2f985ab'
down_revision = 'abc4df313723'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('target_green_score', sa.Float(), nullable=True))

    with op.batch_alter_table('projects', schema=None) as batch_op:
        batch_op.add_column(sa.Column('county', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('funded_by', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('funded_amount', sa.Numeric(precision=12, scale=2), nullable=True))
        batch_op.add_column(sa.Column('funded_at', sa.DateTime(), nullable=True))
        batch_op.create_foreign_key('fk_projects_funded_by_users', 'users', ['funded_by'], ['id'])


def downgrade():
    with op.batch_alter_table('projects', schema=None) as batch_op:
        batch_op.drop_constraint('fk_projects_funded_by_users', type_='foreignkey')
        batch_op.drop_column('funded_at')
        batch_op.drop_column('funded_amount')
        batch_op.drop_column('funded_by')
        batch_op.drop_column('county')

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('target_green_score')
