"""마이페이지(내 정보) 라우터."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.base import get_db
from app.models.comment import Comment
from app.models.post import Post
from app.models.user import User
from app.schemas.comment import CommentOut
from app.schemas.common import Page
from app.schemas.post import PostListItem
from app.schemas.user import UserMe, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserMe)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserMe)
def update_me(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.nickname is not None:
        current_user.nickname = payload.nickname
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/me/posts", response_model=Page[PostListItem])
def get_my_posts(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(Post).filter(Post.author_id == current_user.id).order_by(Post.created_at.desc())
    )
    total = query.count()
    posts = query.offset((page - 1) * size).limit(size).all()

    items = [
        PostListItem(
            id=p.id,
            category=p.category,
            title=p.title,
            nickname=current_user.nickname,
            view_count=p.view_count,
            created_at=p.created_at,
        )
        for p in posts
    ]
    return Page(total=total, page=page, size=size, items=items)


@router.get("/me/comments", response_model=list[CommentOut])
def get_my_comments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comments = (
        db.query(Comment)
        .filter(Comment.author_id == current_user.id)
        .order_by(Comment.created_at.desc())
        .all()
    )
    return [
        CommentOut(
            id=c.id,
            content=c.content,
            nickname=current_user.nickname,
            created_at=c.created_at,
            is_mine=True,
        )
        for c in comments
    ]
