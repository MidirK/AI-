"""AI 취업 준비도 분석 API 테스트."""

VALID_PAYLOAD = {
    "grade": 3,
    "gpa": 3.8,
    "certificates": ["정보처리기사"],
    "language_score_text": "토익 850",
    "project_count": 2,
    "competition_count": 1,
    "has_intern_experience": False,
    "github_url": "https://github.com/example",
}


def test_analyze_requires_auth(client):
    res = client.post("/api/career/analyze", json=VALID_PAYLOAD)
    assert res.status_code == 401


def test_analyze_returns_score_and_recommendations(client, make_user):
    _, headers = make_user()

    res = client.post("/api/career/analyze", json=VALID_PAYLOAD, headers=headers)
    assert res.status_code == 201
    body = res.json()
    assert 0 <= body["readiness_score"] <= 100
    assert body["readiness_level"] in {"준비 필요", "보통", "양호", "우수"}
    assert isinstance(body["weak_areas"], list)
    assert isinstance(body["recommended_certificates"], list)


def test_analyze_rejects_invalid_grade(client, make_user):
    _, headers = make_user()

    res = client.post("/api/career/analyze", json={**VALID_PAYLOAD, "grade": 9}, headers=headers)
    assert res.status_code == 422


def test_latest_analysis_returns_404_when_no_history(client, make_user):
    _, headers = make_user()

    res = client.get("/api/career/analyze/latest", headers=headers)
    assert res.status_code == 404


def test_latest_analysis_returns_most_recent_submission(client, make_user):
    _, headers = make_user()

    client.post("/api/career/analyze", json=VALID_PAYLOAD, headers=headers)
    second_payload = {**VALID_PAYLOAD, "project_count": 5}
    second_res = client.post("/api/career/analyze", json=second_payload, headers=headers)

    latest_res = client.get("/api/career/analyze/latest", headers=headers)
    assert latest_res.status_code == 200
    assert latest_res.json()["id"] == second_res.json()["id"]


def test_analysis_history_is_per_user(client, make_user):
    _, headers_a = make_user(email="a@example.com")
    _, headers_b = make_user(email="b@example.com")

    client.post("/api/career/analyze", json=VALID_PAYLOAD, headers=headers_a)

    res = client.get("/api/career/analyze/latest", headers=headers_b)
    assert res.status_code == 404
