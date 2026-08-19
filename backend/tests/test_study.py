"""스터디 모집 상태 변경 테스트."""


def test_update_study_status_by_author(client, make_user):
    _, headers = make_user()
    post_id = client.post(
        "/api/posts",
        json={"category": "study", "title": "스터디", "content": "c", "recruit_count": 4},
        headers=headers,
    ).json()["id"]

    res = client.patch(f"/api/posts/{post_id}/study-status", json={"status": "모집완료"}, headers=headers)
    assert res.status_code == 204

    detail = client.get(f"/api/posts/{post_id}").json()
    assert detail["study_info"]["status"] == "모집완료"


def test_update_study_status_requires_author(client, make_user):
    _, headers = make_user(email="author@example.com")
    _, other_headers = make_user(email="other@example.com")
    post_id = client.post(
        "/api/posts",
        json={"category": "study", "title": "스터디", "content": "c", "recruit_count": 4},
        headers=headers,
    ).json()["id"]

    res = client.patch(
        f"/api/posts/{post_id}/study-status", json={"status": "모집완료"}, headers=other_headers
    )
    assert res.status_code == 403


def test_update_study_status_rejects_non_study_post(client, make_user):
    _, headers = make_user()
    post_id = client.post(
        "/api/posts", json={"category": "free", "title": "자유글", "content": "c"}, headers=headers
    ).json()["id"]

    res = client.patch(f"/api/posts/{post_id}/study-status", json={"status": "모집완료"}, headers=headers)
    assert res.status_code == 400
