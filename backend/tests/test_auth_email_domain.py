"""ALLOWED_EMAIL_DOMAINS 설정에 따른 회원가입 이메일 도메인 검증 테스트."""

import pytest

from app.core.config import settings


@pytest.fixture
def restrict_email_domain():
    """테스트 동안만 학교 이메일 도메인 제한을 켠다."""
    original = settings.allowed_email_domains
    settings.allowed_email_domains = "ai.university.ac.kr"
    yield
    settings.allowed_email_domains = original


def test_signup_rejects_non_school_email(client, restrict_email_domain):
    res = client.post(
        "/api/auth/signup",
        json={
            "email": "someone@gmail.com",
            "password": "testpass123",
            "nickname": "닉네임",
            "student_id": "20231234",
        },
    )
    assert res.status_code == 400


def test_signup_accepts_school_email(client, restrict_email_domain):
    res = client.post(
        "/api/auth/signup",
        json={
            "email": "student@ai.university.ac.kr",
            "password": "testpass123",
            "nickname": "닉네임",
            "student_id": "20231234",
        },
    )
    assert res.status_code == 201


def test_signup_allows_any_domain_when_unrestricted(client):
    res = client.post(
        "/api/auth/signup",
        json={
            "email": "someone@gmail.com",
            "password": "testpass123",
            "nickname": "닉네임",
            "student_id": "20231234",
        },
    )
    assert res.status_code == 201
