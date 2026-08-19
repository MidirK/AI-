"""회원 관련 스키마."""

from pydantic import BaseModel, ConfigDict, EmailStr


class UserSignup(BaseModel):
    email: EmailStr
    password: str
    nickname: str
    student_id: str


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    nickname: str


class UserMe(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    nickname: str
    student_id: str
    role: str


class UserUpdate(BaseModel):
    nickname: str | None = None
