// 댓글(Comments) 관련 API 호출 모음.

import { apiFetch } from "./client";

export function fetchComments(postId) {
  return apiFetch(`/posts/${postId}/comments`);
}

export function createComment(postId, content) {
  return apiFetch(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export function deleteComment(commentId) {
  return apiFetch(`/comments/${commentId}`, { method: "DELETE" });
}
