"""add indexes on posts.author_id, comments.post_id, comments.author_id

Revision ID: a8f3c1d9e6b2
Revises: c4a2f9d1e7b3
Create Date: 2026-09-24 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a8f3c1d9e6b2'
down_revision: Union[str, None] = 'c4a2f9d1e7b3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 게시글 목록/상세, 댓글 목록, 마이페이지 조회에서 author_id/post_id로 필터링하는데
    # 인덱스가 없어 데이터가 늘어나면 조회가 느려질 수 있어 추가한다.
    op.create_index('ix_posts_author_id', 'posts', ['author_id'])
    op.create_index('ix_comments_post_id', 'comments', ['post_id'])
    op.create_index('ix_comments_author_id', 'comments', ['author_id'])


def downgrade() -> None:
    op.drop_index('ix_comments_author_id', table_name='comments')
    op.drop_index('ix_comments_post_id', table_name='comments')
    op.drop_index('ix_posts_author_id', table_name='posts')
