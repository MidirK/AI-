"""게시글 라우터 (공지/자유/스터디/취업/선후배 공통)."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_current_user_optional
from app.db.base import get_db
from app.models.post import POST_CATEGORIES, Post
from app.models.user import User
from app.schemas.common import Page
from app.schemas.post import JobInfo, PostCreate, PostDetail, PostListItem, PostUpdate, StudyInfo

router = APIRouter(prefix="/posts", tags=["posts"])


def _to_detail(post: Post, current_user: User | None) -> PostDetail:
    detail = PostDetail(
        id=post.id,
        category=post.category,
        title=post.title,
        content=post.content,
        nickname=post.author.nickname,
        view_count=post.view_count,
        created_at=post.created_at,
        updated_at=post.updated_at,
        is_mine=bool(current_user and current_user.id == post.author_id),
    )
    if post.category == "study":
        detail.study_info = StudyInfo(
            recruit_count=post.recruit_count,
            current_count=post.current_count,
            status=post.study_status,
        )
    if post.category == "job":
        detail.job_info = JobInfo(deadline=post.job_deadline)
    return detail


@router.get("", response_model=Page[PostListItem])
def list_posts(
    category: str = Query(..., description="게시판 카테고리"),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    if category not in POST_CATEGORIES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="존재하지 않는 카테고리입니다.")

    query = db.query(Post).filter(Post.category == category).order_by(Post.created_at.desc())
    total = query.count()
    posts = query.offset((page - 1) * size).limit(size).all()

    items = [
        PostListItem(
            id=p.id,
            category=p.category,
            title=p.title,
            nickname=p.author.nickname,
            view_count=p.view_count,
            created_at=p.created_at,
        )
        for p in posts
    ]
    return Page(total=total, page=page, size=size, items=items)


@router.get("/{post_id}", response_model=PostDetail)
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="게시글을 찾을 수 없습니다.")

    post.view_count += 1
    db.commit()
    db.refresh(post)

    return _to_detail(post, current_user)


@router.post("", response_model=PostDetail, status_code=status.HTTP_201_CREATED)
def create_post(
    payload: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.category not in POST_CATEGORIES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="존재하지 않는 카테고리입니다.")
    if payload.category == "notice" and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="공지사항은 관리자만 작성할 수 있습니다.")

    post = Post(
        category=payload.category,
        title=payload.title,
        content=payload.content,
        author_id=current_user.id,
    )
    if payload.category == "study":
        post.recruit_count = payload.recruit_count
        post.current_count = 0
        post.study_status = "모집중"
    if payload.category == "job":
        post.job_deadline = payload.job_deadline

    db.add(post)
    db.commit()
    db.refresh(post)
    return _to_detail(post, current_user)


@router.put("/{post_id}", response_model=PostDetail)
def update_post(
    post_id: int,
    payload: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="게시글을 찾을 수 없습니다.")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="작성자만 수정할 수 있습니다.")

    if payload.title is not None:
        post.title = payload.title
    if payload.content is not None:
        post.content = payload.content

    db.commit()
    db.refresh(post)
    return _to_detail(post, current_user)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="게시글을 찾을 수 없습니다.")
    if post.author_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="작성자 또는 관리자만 삭제할 수 있습니다.")

    db.delete(post)
    db.commit()
