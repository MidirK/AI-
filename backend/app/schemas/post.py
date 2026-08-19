"""게시글 관련 스키마."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PostCreate(BaseModel):
    category: str
    title: str
    content: str
    recruit_count: int | None = None  # study 카테고리일 때만 사용
    job_deadline: datetime | None = None  # job 카테고리일 때만 사용


class PostUpdate(BaseModel):
    title: str | None = None
    content: str | None = None


class PostListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: str
    title: str
    nickname: str
    view_count: int
    created_at: datetime


class StudyInfo(BaseModel):
    recruit_count: int | None
    current_count: int | None
    status: str | None


class JobInfo(BaseModel):
    deadline: datetime | None


class PostDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: str
    title: str
    content: str
    nickname: str
    view_count: int
    created_at: datetime
    updated_at: datetime
    is_mine: bool
    study_info: StudyInfo | None = None
    job_info: JobInfo | None = None


class StudyStatusUpdate(BaseModel):
    status: str
