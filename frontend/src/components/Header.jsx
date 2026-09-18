// 상단 네비게이션 바. 게시판 카테고리 이동, 로그인/로그아웃, 마이페이지 진입을 담당한다.

import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { POST_CATEGORIES } from "../api/posts";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function closeNav() {
    setNavOpen(false);
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand" onClick={closeNav}>
          <span className="brand-mark">A</span>
          AICOM
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="메뉴 열기"
          aria-expanded={navOpen}
          onClick={() => setNavOpen((prev) => !prev)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>

        <nav className={navOpen ? "site-nav open" : "site-nav"}>
          {POST_CATEGORIES.map((category) => (
            <NavLink
              key={category.value}
              to={`/posts/${category.value}`}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={closeNav}
            >
              {category.label}
            </NavLink>
          ))}
          <NavLink
            to="/career"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            onClick={closeNav}
          >
            AI 취업 분석
          </NavLink>
        </nav>

        <div className="site-header-actions">
          {user ? (
            <>
              <Link to="/mypage" className="nav-link" onClick={closeNav}>
                {user.name}님
              </Link>
              <button type="button" className="btn btn-ghost" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" onClick={closeNav}>
                로그인
              </Link>
              <Link to="/signup" className="btn btn-primary" onClick={closeNav}>
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
