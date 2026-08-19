"""댓글 CRUD 및 권한 테스트."""


def _create_post(client, headers, category="free"):
    res = client.post(
        "/api/posts", json={"category": category, "title": "t", "content": "c"}, headers=headers
    )
    return res.json()["id"]


def test_create_and_list_comments(client, make_user):
    _, headers = make_user()
    post_id = _create_post(client, headers)

    create_res = client.post(
        f"/api/posts/{post_id}/comments", json={"content": "댓글 내용"}, headers=headers
    )
    assert create_res.status_code == 201

    list_res = client.get(f"/api/posts/{post_id}/comments")
    assert list_res.status_code == 200
    body = list_res.json()
    assert len(body) == 1
    assert body[0]["content"] == "댓글 내용"


def test_create_comment_requires_auth(client, make_user):
    _, headers = make_user()
    post_id = _create_post(client, headers)

    res = client.post(f"/api/posts/{post_id}/comments", json={"content": "댓글"})
    assert res.status_code == 401


def test_delete_comment_only_by_author_or_admin(client, make_user, make_admin):
    _, headers = make_user(email="author@example.com")
    _, other_headers = make_user(email="other@example.com")
    _, admin_headers = make_admin()
    post_id = _create_post(client, headers)

    comment_id = client.post(
        f"/api/posts/{post_id}/comments", json={"content": "댓글"}, headers=headers
    ).json()["id"]

    assert client.delete(f"/api/comments/{comment_id}", headers=other_headers).status_code == 403
    assert client.delete(f"/api/comments/{comment_id}", headers=admin_headers).status_code == 204
