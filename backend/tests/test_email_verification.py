"""이메일 인증 플로우 테스트."""

from app.core.security import create_email_verification_token
from app.models.user import User


def _signup(client, email="verify@example.com", password="testpass123"):
    res = client.post(
        "/api/auth/signup",
        json={"email": email, "password": password, "nickname": "인증테스트", "student_id": "1"},
    )
    assert res.status_code == 201, res.text
    return res.json()


def test_login_blocked_before_verification(client):
    _signup(client, email="unverified@example.com")

    res = client.post(
        "/api/auth/login", json={"email": "unverified@example.com", "password": "testpass123"}
    )
    assert res.status_code == 403
    assert res.json()["detail"]["code"] == "EMAIL_NOT_VERIFIED"


def test_verify_email_with_valid_token_allows_login(client):
    user = _signup(client, email="tobeverified@example.com")
    token = create_email_verification_token(str(user["id"]))

    verify_res = client.post("/api/auth/verify-email", json={"token": token})
    assert verify_res.status_code == 200

    login_res = client.post(
        "/api/auth/login", json={"email": "tobeverified@example.com", "password": "testpass123"}
    )
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()


def test_verify_email_with_invalid_token_returns_400(client):
    res = client.post("/api/auth/verify-email", json={"token": "not-a-real-token"})
    assert res.status_code == 400


def test_verify_email_is_idempotent(client):
    user = _signup(client, email="idempotent@example.com")
    token = create_email_verification_token(str(user["id"]))

    first = client.post("/api/auth/verify-email", json={"token": token})
    second = client.post("/api/auth/verify-email", json={"token": token})
    assert first.status_code == 200
    assert second.status_code == 200


def test_resend_verification_for_unverified_user(client):
    _signup(client, email="resend@example.com")

    res = client.post("/api/auth/resend-verification", json={"email": "resend@example.com"})
    assert res.status_code == 200


def test_resend_verification_for_already_verified_user_returns_400(client, make_user):
    make_user(email="already@example.com")

    res = client.post("/api/auth/resend-verification", json={"email": "already@example.com"})
    assert res.status_code == 400


def test_resend_verification_unknown_email_returns_404(client):
    res = client.post("/api/auth/resend-verification", json={"email": "nobody@example.com"})
    assert res.status_code == 404


def test_access_token_cannot_be_used_as_verification_token(client, make_user):
    """로그인 토큰을 이메일 인증 엔드포인트에 재사용할 수 없어야 한다 (purpose claim 분리)."""
    from app.core.security import create_access_token

    user, _ = make_user(email="mixed@example.com")
    login_token = create_access_token(subject=str(user["id"]))

    res = client.post("/api/auth/verify-email", json={"token": login_token})
    assert res.status_code == 400
