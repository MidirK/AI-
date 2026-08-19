// 로그인 상태(현재 사용자 정보, 토큰)를 앱 전역에서 공유하기 위한 컨텍스트.

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { clearToken, setToken } from "../api/client";
import { login as loginApi, signup as signupApi } from "../api/auth";
import { fetchMe } from "../api/users";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // 앱 최초 로드 시 토큰만 있고 사용자 정보를 아직 못 불러온 상태를 구분하기 위한 플래그.
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      // 토큰이 만료되었거나 유효하지 않은 경우 로그아웃 처리.
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      loadMe();
    } else {
      setLoading(false);
    }
  }, [loadMe]);

  const login = useCallback(
    async (credentials) => {
      const { access_token: accessToken } = await loginApi(credentials);
      setToken(accessToken);
      await loadMe();
    },
    [loadMe],
  );

  const signup = useCallback((payload) => signupApi(payload), []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = { user, loading, login, signup, logout, refreshMe: loadMe };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  }
  return ctx;
}
