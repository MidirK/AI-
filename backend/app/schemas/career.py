"""AI 취업 준비도 분석 관련 스키마."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CareerAnalyzeRequest(BaseModel):
    grade: int = Field(ge=1, le=4, description="학년 (1~4)")
    gpa: float = Field(ge=0, le=4.5, description="학점 (4.5 만점 기준)")
    certificates: list[str] = Field(default_factory=list, description="보유 자격증 목록")
    language_score_text: str | None = Field(default=None, description="어학 성적 (예: 토익 850)")
    project_count: int = Field(ge=0, default=0, description="프로젝트 경험 개수")
    competition_count: int = Field(ge=0, default=0, description="공모전 수상 개수")
    has_intern_experience: bool = Field(default=False, description="인턴 경험 여부")
    github_url: str | None = Field(default=None, description="GitHub 프로필 URL")


class CareerAnalysisResult(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    readiness_score: int
    readiness_level: str
    weak_areas: list[str]
    recommended_certificates: list[str]
    recommended_projects: list[str]
    recommended_learning_areas: list[str]
    created_at: datetime
