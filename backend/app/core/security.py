"""비밀번호 해싱 및 JWT 토큰 발급/검증 유틸리티."""

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(subject: str) -> str:
    """subject(보통 user id)를 담은 JWT access token을 생성한다."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_access_token(token: str) -> str | None:
    """토큰을 검증하고 subject(user id 문자열)를 반환한다. 유효하지 않으면 None."""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload.get("sub")
    except JWTError:
        return None


# 이메일 인증 링크는 로그인 토큰과 용도가 다르므로 payload에 purpose를 넣어 구분한다
# (로그인 토큰을 인증 링크로, 혹은 그 반대로 재사용하는 것을 막기 위함).
EMAIL_VERIFY_PURPOSE = "email_verify"
EMAIL_VERIFY_EXPIRE_HOURS = 24


def create_email_verification_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=EMAIL_VERIFY_EXPIRE_HOURS)
    payload = {"sub": user_id, "purpose": EMAIL_VERIFY_PURPOSE, "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_email_verification_token(token: str) -> str | None:
    """유효한 인증 토큰이면 user id 문자열을, 아니면 None을 반환한다."""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        return None
    if payload.get("purpose") != EMAIL_VERIFY_PURPOSE:
        return None
    return payload.get("sub")
