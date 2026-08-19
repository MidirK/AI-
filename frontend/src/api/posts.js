// 게시글(Posts) 관련 API 호출 모음.

import { apiFetch } from "./client";

// 게시판 카테고리 값 (docs/api-spec.md 0-5 참고)
export const POST_CATEGORIES = [
  { value: "notice", label: "공지사항" },
  { value: "free", label: "자유게시판" },
  { value: "study", label: "스터디/프로젝트 모집" },
  { value: "job", label: "취업정보" },
  { value: "senior", label: "선후배 커뮤니티" },
];

export function fetchPosts({ category, page = 1, size = 10 }) {
  const query = new URLSearchParams({ category, page, size });
  return apiFetch(`/posts?${query.toString()}`);
}

export function fetchPost(postId) {
  return apiFetch(`/posts/${postId}`);
}

export function createPost(payload) {
  return apiFetch("/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updatePost(postId, payload) {
  return apiFetch(`/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deletePost(postId) {
  return apiFetch(`/posts/${postId}`, { method: "DELETE" });
}

export function updateStudyStatus(postId, status) {
  return apiFetch(`/posts/${postId}/study-status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
