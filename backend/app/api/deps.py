"""인증/인가 관련 FastAPI 의존성.

- get_current_user: 로그인 필수 엔드포인트에서 사용 (토큰 없거나 무효하면 401)
- get_current_user_optional: 비로그인도 허용하되, 로그인 시 is_mine 계산 등에 사용
- get_current_admin: 관리자 전용 엔드포인트에서 사용 (관리자가 아니면 403)
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.base import get_db
from app.models.user import User

# tokenUrl은 문서화용이며, 로그인은 /auth/login에서 처리한다.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)


def _get_user_from_token(token: str | None, db: Session) -> User | None:
    if not token:
        return None
    user_id = decode_access_token(token)
    if user_id is None:
        return None
    return db.get(User, int(user_id))


def get_current_user_optional(
    token: str | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User | None:
    return _get_user_from_token(token, db)


def get_current_user(
    token: str | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    user = _get_user_from_token(token, db)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="인증이 필요합니다.")
    return user


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="관리자만 접근할 수 있습니다.")
    return current_user
