// 상단 네비게이션 바. 게시판 카테고리 이동, 로그인/로그아웃, 마이페이지 진입을 담당한다.

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { POST_CATEGORIES } from "../api/posts";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand">
          AICOM
        </Link>
        <nav className="site-nav">
          {POST_CATEGORIES.map((category) => (
            <NavLink
              key={category.value}
              to={`/posts/${category.value}`}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {category.label}
            </NavLink>
          ))}
          <NavLink to="/career" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            AI 취업 분석
          </NavLink>
        </nav>
        <div className="site-header-actions">
          {user ? (
            <>
              <Link to="/mypage" className="nav-link">
                {user.nickname}님
              </Link>
              <button type="button" className="btn btn-ghost" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                로그인
              </Link>
              <Link to="/signup" className="btn btn-primary">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
