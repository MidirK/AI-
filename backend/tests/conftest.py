"""테스트 공통 fixture.

실제 Postgres 대신 인메모리 SQLite로 매 테스트마다 깨끗한 DB를 만들어 사용한다.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.limiter import limiter
from app.db.base import Base, get_db
from app.main import app

test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def _override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = _override_get_db


@pytest.fixture(autouse=True)
def _fresh_db():
    """매 테스트 전에 테이블을 새로 만들고, 끝나면 지운다."""
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(autouse=True)
def _reset_rate_limiter():
    """TestClient는 항상 같은 IP("testclient")로 요청하므로, rate limit이 테스트 간에
    누적되지 않도록 매 테스트 전에 초기화한다."""
    limiter.reset()


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def make_user(client):
    """회원가입 + 로그인까지 마친 뒤 (유저 정보, Authorization 헤더)를 반환하는 헬퍼."""

    def _make_user(email="user@example.com", password="testpass123", nickname="테스트유저", student_id="20231234"):
        signup_res = client.post(
            "/api/auth/signup",
            json={"email": email, "password": password, "nickname": nickname, "student_id": student_id},
        )
        assert signup_res.status_code == 201, signup_res.text

        login_res = client.post("/api/auth/login", json={"email": email, "password": password})
        assert login_res.status_code == 200, login_res.text
        token = login_res.json()["access_token"]

        return signup_res.json(), {"Authorization": f"Bearer {token}"}

    return _make_user


@pytest.fixture
def make_admin(make_user):
    """관리자 권한을 가진 유저를 만든다 (role은 API로 바꿀 수 없으므로 DB에서 직접 승격)."""

    def _make_admin(email="admin@example.com", nickname="관리자"):
        user, headers = make_user(email=email, nickname=nickname)

        db = TestingSessionLocal()
        try:
            from app.models.user import User

            db_user = db.get(User, user["id"])
            db_user.role = "admin"
            db.commit()
        finally:
            db.close()

        return user, headers

    return _make_admin
