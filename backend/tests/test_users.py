"""마이페이지(users) 테스트."""


def test_get_me(client, make_user):
    user, headers = make_user()

    res = client.get("/api/users/me", headers=headers)
    assert res.status_code == 200
    body = res.json()
    assert body["id"] == user["id"]
    assert body["role"] == "student"


def test_get_me_requires_auth(client):
    res = client.get("/api/users/me")
    assert res.status_code == 401


def test_update_nickname(client, make_user):
    _, headers = make_user()

    res = client.put("/api/users/me", json={"nickname": "새닉네임"}, headers=headers)
    assert res.status_code == 200
    assert res.json()["nickname"] == "새닉네임"


def test_my_posts_and_comments(client, make_user):
    _, headers = make_user()
    post_id = client.post(
        "/api/posts", json={"category": "free", "title": "내글", "content": "c"}, headers=headers
    ).json()["id"]
    client.post(f"/api/posts/{post_id}/comments", json={"content": "내댓글"}, headers=headers)

    posts_res = client.get("/api/users/me/posts", headers=headers)
    assert posts_res.status_code == 200
    posts_body = posts_res.json()
    assert posts_body["total"] == 1
    assert posts_body["items"][0]["title"] == "내글"
    assert posts_body["items"][0]["category"] == "free"

    comments_res = client.get("/api/users/me/comments", headers=headers)
    assert comments_res.status_code == 200
    assert comments_res.json()[0]["content"] == "내댓글"
