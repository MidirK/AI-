"""게시글 CRUD 및 권한 테스트."""


def test_create_and_get_post(client, make_user):
    _, headers = make_user()

    create_res = client.post(
        "/api/posts",
        json={"category": "free", "title": "제목", "content": "내용"},
        headers=headers,
    )
    assert create_res.status_code == 201
    post_id = create_res.json()["id"]

    get_res = client.get(f"/api/posts/{post_id}")
    assert get_res.status_code == 200
    body = get_res.json()
    assert body["title"] == "제목"
    assert body["view_count"] == 1  # 조회 시 1 증가


def test_create_post_requires_auth(client):
    res = client.post("/api/posts", json={"category": "free", "title": "t", "content": "c"})
    assert res.status_code == 401


def test_create_notice_requires_admin(client, make_user):
    _, headers = make_user()

    res = client.post(
        "/api/posts", json={"category": "notice", "title": "공지", "content": "내용"}, headers=headers
    )
    assert res.status_code == 403


def test_admin_can_create_notice(client, make_admin):
    _, headers = make_admin()

    res = client.post(
        "/api/posts", json={"category": "notice", "title": "공지", "content": "내용"}, headers=headers
    )
    assert res.status_code == 201


def test_create_post_unknown_category_returns_400(client, make_user):
    _, headers = make_user()

    res = client.post(
        "/api/posts", json={"category": "unknown", "title": "t", "content": "c"}, headers=headers
    )
    assert res.status_code == 400


def test_get_nonexistent_post_returns_404(client):
    res = client.get("/api/posts/9999")
    assert res.status_code == 404


def test_list_posts_filters_by_category(client, make_user):
    _, headers = make_user()
    client.post("/api/posts", json={"category": "free", "title": "자유글", "content": "c"}, headers=headers)
    client.post("/api/posts", json={"category": "job", "title": "취업글", "content": "c"}, headers=headers)

    res = client.get("/api/posts", params={"category": "free"})
    assert res.status_code == 200
    body = res.json()
    assert body["total"] == 1
    assert body["items"][0]["title"] == "자유글"
    assert body["items"][0]["category"] == "free"


def test_list_posts_missing_category_returns_422(client):
    res = client.get("/api/posts")
    assert res.status_code == 422


def test_update_post_only_by_author(client, make_user):
    _, headers = make_user(email="author@example.com")
    _, other_headers = make_user(email="other@example.com")

    create_res = client.post(
        "/api/posts", json={"category": "free", "title": "원제목", "content": "c"}, headers=headers
    )
    post_id = create_res.json()["id"]

    forbidden_res = client.put(
        f"/api/posts/{post_id}", json={"title": "해킹시도"}, headers=other_headers
    )
    assert forbidden_res.status_code == 403

    ok_res = client.put(f"/api/posts/{post_id}", json={"title": "수정된제목"}, headers=headers)
    assert ok_res.status_code == 200
    assert ok_res.json()["title"] == "수정된제목"


def test_delete_post_by_author_or_admin(client, make_user, make_admin):
    _, headers = make_user(email="author2@example.com")
    _, other_headers = make_user(email="other2@example.com")
    _, admin_headers = make_admin()

    post_id = client.post(
        "/api/posts", json={"category": "free", "title": "t", "content": "c"}, headers=headers
    ).json()["id"]

    assert client.delete(f"/api/posts/{post_id}", headers=other_headers).status_code == 403
    assert client.delete(f"/api/posts/{post_id}", headers=admin_headers).status_code == 204
    assert client.get(f"/api/posts/{post_id}").status_code == 404


def test_job_post_persists_deadline(client, make_user):
    _, headers = make_user()

    res = client.post(
        "/api/posts",
        json={
            "category": "job",
            "title": "채용공고",
            "content": "내용",
            "job_deadline": "2026-09-01T00:00:00",
        },
        headers=headers,
    )
    assert res.status_code == 201
    assert res.json()["job_info"]["deadline"] is not None

    get_res = client.get(f"/api/posts/{res.json()['id']}")
    assert get_res.json()["job_info"]["deadline"] is not None


def test_study_post_includes_study_info(client, make_user):
    _, headers = make_user()

    res = client.post(
        "/api/posts",
        json={"category": "study", "title": "스터디", "content": "내용", "recruit_count": 4},
        headers=headers,
    )
    assert res.status_code == 201
    study_info = res.json()["study_info"]
    assert study_info == {"recruit_count": 4, "current_count": 0, "status": "모집중"}
