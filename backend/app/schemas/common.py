"""공통 스키마 (페이지네이션 등)."""

from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class Page(BaseModel, Generic[T]):
    total: int
    page: int
    size: int
    items: list[T]
