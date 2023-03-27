"""Init migration

Revision ID: 325b4d2b70f7
Revises: 
Create Date: 2023-03-27 20:21:38.633980

"""
import sqlalchemy_utils
from alembic import op
import sqlalchemy as sa

from db.models import SiteTheme


# revision identifiers, used by Alembic.
revision = '325b4d2b70f7'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('username', sa.String(length=255), nullable=False),
    sa.Column('password', sa.String(length=255), nullable=False),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_id'), 'user', ['id'], unique=False)
    op.create_index(op.f('ix_user_username'), 'user', ['username'], unique=True)
    op.create_table('user_preferences',
    sa.Column('user_id', sa.BigInteger(), nullable=False),
    sa.Column('theme', sqlalchemy_utils.types.choice.ChoiceType(SiteTheme), nullable=True),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_preferences_id'), 'user_preferences', ['id'], unique=False)
    op.create_index(op.f('ix_user_preferences_user_id'), 'user_preferences', ['user_id'], unique=False)
    op.create_table('video',
    sa.Column('author_id', sa.BigInteger(), nullable=False),
    sa.Column('filename', sa.String(length=255), nullable=False),
    sa.Column('path', sa.String(length=255), nullable=False),
    sa.Column('preprocessed', sa.Boolean(), nullable=False),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['author_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_video_author_id'), 'video', ['author_id'], unique=False)
    op.create_index(op.f('ix_video_id'), 'video', ['id'], unique=False)
    op.create_table('epileptic_timing',
    sa.Column('video_id', sa.BigInteger(), nullable=False),
    sa.Column('start_time', sa.Integer(), nullable=False),
    sa.Column('end_time', sa.Integer(), nullable=False),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.ForeignKeyConstraint(['video_id'], ['video.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_epileptic_timing_id'), 'epileptic_timing', ['id'], unique=False)
    op.create_index(op.f('ix_epileptic_timing_video_id'), 'epileptic_timing', ['video_id'], unique=False)
    op.create_table('video_preferences',
    sa.Column('user_id', sa.BigInteger(), nullable=False),
    sa.Column('video_id', sa.BigInteger(), nullable=False),
    sa.Column('brightness', sa.SMALLINT(), nullable=False),
    sa.Column('contrast', sa.SMALLINT(), nullable=False),
    sa.Column('saturation', sa.SMALLINT(), nullable=False),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['video_id'], ['video.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_video_preferences_id'), 'video_preferences', ['id'], unique=False)
    op.create_index(op.f('ix_video_preferences_user_id'), 'video_preferences', ['user_id'], unique=False)
    op.create_index(op.f('ix_video_preferences_video_id'), 'video_preferences', ['video_id'], unique=False)
    op.create_table('celery_taskmeta',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('task_id', sa.String(length=155), nullable=True),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.Column('result', sa.PickleType(), nullable=True),
    sa.Column('date_done', sa.DateTime(), nullable=True),
    sa.Column('traceback', sa.Text(), nullable=True),
    sa.Column('name', sa.String(length=155), nullable=True),
    sa.Column('args', sa.LargeBinary(), nullable=True),
    sa.Column('kwargs', sa.LargeBinary(), nullable=True),
    sa.Column('worker', sa.String(length=155), nullable=True),
    sa.Column('retries', sa.Integer(), nullable=True),
    sa.Column('queue', sa.String(length=155), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('task_id'),
    sqlite_autoincrement=True
    )
    op.create_table('celery_tasksetmeta',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('taskset_id', sa.String(length=155), nullable=True),
    sa.Column('result', sa.PickleType(), nullable=True),
    sa.Column('date_done', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('taskset_id'),
    sqlite_autoincrement=True
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('celery_tasksetmeta')
    op.drop_table('celery_taskmeta')
    op.drop_index(op.f('ix_video_preferences_video_id'), table_name='video_preferences')
    op.drop_index(op.f('ix_video_preferences_user_id'), table_name='video_preferences')
    op.drop_index(op.f('ix_video_preferences_id'), table_name='video_preferences')
    op.drop_table('video_preferences')
    op.drop_index(op.f('ix_epileptic_timing_video_id'), table_name='epileptic_timing')
    op.drop_index(op.f('ix_epileptic_timing_id'), table_name='epileptic_timing')
    op.drop_table('epileptic_timing')
    op.drop_index(op.f('ix_video_id'), table_name='video')
    op.drop_index(op.f('ix_video_author_id'), table_name='video')
    op.drop_table('video')
    op.drop_index(op.f('ix_user_preferences_user_id'), table_name='user_preferences')
    op.drop_index(op.f('ix_user_preferences_id'), table_name='user_preferences')
    op.drop_table('user_preferences')
    op.drop_index(op.f('ix_user_username'), table_name='user')
    op.drop_index(op.f('ix_user_id'), table_name='user')
    op.drop_table('user')
    # ### end Alembic commands ###
