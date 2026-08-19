"""AI 취업 준비도 분석 결과 모델.

사용자가 입력을 제출할 때마다 한 건씩 쌓인다 (변화 추이를 나중에 보여줄 수 있도록).
"""

from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class CareerAnalysis(Base):
    __tablename__ = "career_analyses"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)

    # --- 입력 (docs/기획안.md 4번 "입력 예시" 참고) ---
    grade: Mapped[int] = mapped_column(Integer, nullable=False)
    gpa: Mapped[float] = mapped_column(Float, nullable=False)
    certificates: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    language_score_text: Mapped[str | None] = mapped_column(String(100), nullable=True)
    project_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    competition_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    has_intern_experience: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    github_url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # --- 분석 결과 (app/services/career_analysis.py에서 계산) ---
    readiness_score: Mapped[int] = mapped_column(Integer, nullable=False)
    readiness_level: Mapped[str] = mapped_column(String(20), nullable=False)
    weak_areas: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    recommended_certificates: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    recommended_projects: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    recommended_learning_areas: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="career_analyses")
