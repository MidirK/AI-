"""인증(회원가입/로그인/이메일 인증) 라우터."""

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.limiter import limiter
from app.core.security import (
    create_access_token,
    create_email_verification_token,
    decode_email_verification_token,
    hash_password,
    verify_password,
)
from app.db.base import get_db
from app.models.user import User
from app.schemas.auth import (
    EmailVerifyRequest,
    LoginRequest,
    MessageResponse,
    ResendVerificationRequest,
    TokenResponse,
)
from app.schemas.user import UserPublic, UserSignup
from app.services.email import send_verification_email

router = APIRouter(prefix="/auth", tags=["auth"])


def _check_email_domain(email: str) -> None:
    """allowed_email_domains 설정이 있으면 학교 이메일 도메인만 가입을 허용한다."""
    allowed = settings.allowed_email_domain_list
    if not allowed:
        return
    domain = email.rsplit("@", 1)[-1].lower()
    if domain not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"학교 이메일({', '.join(allowed)})로만 가입할 수 있습니다.",
        )


def _send_verification(user: User) -> None:
    token = create_email_verification_token(str(user.id))
    send_verification_email(user.email, token)


@router.post("/signup", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def signup(request: Request, payload: UserSignup, db: Session = Depends(get_db)):
    _check_email_domain(payload.email)

    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="이미 가입된 이메일입니다.")

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        nickname=payload.nickname,
        student_id=payload.student_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    _send_verification(user)
    return user


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
def login(request: Request, payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="이메일 또는 비밀번호가 올바르지 않습니다.")

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "code": "EMAIL_NOT_VERIFIED",
                "message": "이메일 인증이 필요합니다. 받은 메일함을 확인해주세요.",
            },
        )

    access_token = create_access_token(subject=str(user.id))
    return TokenResponse(access_token=access_token)


@router.post("/verify-email", response_model=MessageResponse)
def verify_email(payload: EmailVerifyRequest, db: Session = Depends(get_db)):
    user_id = decode_email_verification_token(payload.token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="유효하지 않거나 만료된 인증 링크입니다."
        )

    user = db.get(User, int(user_id))
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="계정을 찾을 수 없습니다.")

    if not user.is_verified:
        user.is_verified = True
        db.commit()

    return MessageResponse(message="이메일 인증이 완료되었습니다.")


@router.post("/resend-verification", response_model=MessageResponse)
@limiter.limit("3/minute")
def resend_verification(request: Request, payload: ResendVerificationRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="가입된 이메일이 아닙니다.")

    if user.is_verified:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="이미 인증된 계정입니다.")

    _send_verification(user)
    return MessageResponse(message="인증 메일을 다시 보냈습니다.")
