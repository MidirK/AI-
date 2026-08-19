// 마이페이지(Users) 관련 API 호출 모음.

import { apiFetch } from "./client";

export function fetchMe() {
  return apiFetch("/users/me");
}

export function updateMe(payload) {
  return apiFetch("/users/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function fetchMyPosts({ page = 1, size = 10 }) {
  const query = new URLSearchParams({ page, size });
  return apiFetch(`/users/me/posts?${query.toString()}`);
}

export function fetchMyComments() {
  return apiFetch("/users/me/comments");
}
