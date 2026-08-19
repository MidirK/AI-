"""스터디 모집 상태 변경 라우터."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.base import get_db
from app.models.post import Post
from app.models.user import User
from app.schemas.post import StudyStatusUpdate

router = APIRouter(prefix="/posts", tags=["study"])


@router.patch("/{post_id}/study-status", status_code=status.HTTP_204_NO_CONTENT)
def update_study_status(
    post_id: int,
    payload: StudyStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = db.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="게시글을 찾을 수 없습니다.")
    if post.category != "study":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="스터디 게시글이 아닙니다.")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="작성자만 상태를 변경할 수 있습니다.")

    post.study_status = payload.status
    db.commit()
