// 백엔드 API 호출을 위한 공통 fetch 래퍼.
// 로그인 시 발급받은 토큰을 localStorage에 저장해두고 매 요청마다 헤더에 실어 보낸다.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

function getToken() {
  return localStorage.getItem("access_token");
}

export function setToken(token) {
  localStorage.setItem("access_token", token);
}

export function clearToken() {
  localStorage.removeItem("access_token");
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const detail = body.detail;
    // detail은 보통 문자열이지만, 프론트에서 상황별로 다르게 처리해야 할 때는
    // { code, message } 형태로 내려온다 (예: 이메일 미인증).
    const message =
      typeof detail === "string" ? detail : (detail?.message ?? `요청 실패 (status: ${response.status})`);
    const error = new Error(message);
    if (detail && typeof detail === "object") {
      error.code = detail.code;
    }
    throw error;
  }

  if (response.status === 204) {
    return null;
  }
  return response.json();
}
