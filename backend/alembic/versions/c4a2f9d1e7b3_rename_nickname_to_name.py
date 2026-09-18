"""rename users.nickname to users.name

Revision ID: c4a2f9d1e7b3
Revises: 8b177f000415
Create Date: 2026-09-18 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c4a2f9d1e7b3'
down_revision: Union[str, None] = '8b177f000415'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 닉네임 대신 실명을 쓰기로 하면서 컬럼명을 의미에 맞게 변경한다 (값은 그대로 유지).
    op.alter_column('users', 'nickname', new_column_name='name')


def downgrade() -> None:
    op.alter_column('users', 'name', new_column_name='nickname')
