// 인증(회원가입/로그인) 관련 API 호출 모음.

import { apiFetch } from "./client";

export function signup({ email, password, nickname, studentId }) {
  return apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      nickname,
      student_id: studentId,
    }),
  });
}

export function login({ email, password }) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
