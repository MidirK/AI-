"""게시글(Post) 모델.

공지/자유/스터디/취업/선후배 게시판을 category 컬럼 하나로 구분한다.
study, job 카테고리 전용 필드는 해당 카테고리가 아니면 전부 NULL로 둔다.
"""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

# 게시판 카테고리 값 (docs/api-spec.md 0-5 참고)
POST_CATEGORIES = ("notice", "free", "study", "job", "senior")


class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    category: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    view_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    # study 카테고리 전용 필드
    recruit_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    current_count: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    study_status: Mapped[str | None] = mapped_column(String(20), nullable=True)  # 모집중 / 모집완료

    # job 카테고리 전용 필드
    job_deadline: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    author: Mapped["User"] = relationship(back_populates="posts")
    comments: Mapped[list["Comment"]] = relationship(
        back_populates="post", cascade="all, delete-orphan"
    )
