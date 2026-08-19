"""회원가입/로그인 테스트."""


def test_signup_success(client):
    res = client.post(
        "/api/auth/signup",
        json={
            "email": "new@example.com",
            "password": "testpass123",
            "nickname": "새유저",
            "student_id": "20231111",
        },
    )
    assert res.status_code == 201
    body = res.json()
    assert body["email"] == "new@example.com"
    assert body["nickname"] == "새유저"
    assert "password" not in body
    assert "hashed_password" not in body


def test_signup_duplicate_email_returns_400(client, make_user):
    make_user(email="dup@example.com")

    res = client.post(
        "/api/auth/signup",
        json={"email": "dup@example.com", "password": "pw12345", "nickname": "다른닉", "student_id": "1"},
    )
    assert res.status_code == 400


def test_login_success_returns_token(client, make_user):
    make_user(email="login@example.com", password="testpass123")

    res = client.post("/api/auth/login", json={"email": "login@example.com", "password": "testpass123"})
    assert res.status_code == 200
    body = res.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]


def test_login_wrong_password_returns_401(client, make_user):
    make_user(email="login2@example.com", password="testpass123")

    res = client.post("/api/auth/login", json={"email": "login2@example.com", "password": "wrongpass"})
    assert res.status_code == 401


def test_login_unknown_email_returns_401(client):
    res = client.post("/api/auth/login", json={"email": "nobody@example.com", "password": "whatever"})
    assert res.status_code == 401


def test_signup_is_rate_limited(client):
    """무차별 가입 시도 방지를 위한 rate limit (분당 5회) 확인."""
    for i in range(5):
        res = client.post(
            "/api/auth/signup",
            json={
                "email": f"rl{i}@example.com",
                "password": "testpass123",
                "nickname": f"유저{i}",
                "student_id": str(i),
            },
        )
        assert res.status_code == 201

    over_limit_res = client.post(
        "/api/auth/signup",
        json={"email": "over-limit@example.com", "password": "testpass123", "nickname": "초과", "student_id": "99"},
    )
    assert over_limit_res.status_code == 429
