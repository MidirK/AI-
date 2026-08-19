// 홈(랜딩) 페이지. 주요 게시판으로 바로 이동할 수 있는 진입점 역할을 한다.

import { Link } from "react-router-dom";
import { POST_CATEGORIES } from "../api/posts";

export default function HomePage() {
  return (
    <section className="page">
      <div className="hero-text">
        <h1>AI정보공학과 통합 플랫폼</h1>
        <p>학과 공지, 커뮤니티, 취업 정보를 하나로 모았습니다.</p>
      </div>

      <div className="category-grid">
        {POST_CATEGORIES.map((category) => (
          <Link key={category.value} to={`/posts/${category.value}`} className="category-card">
            {category.label}
          </Link>
        ))}
        <Link to="/career" className="category-card category-card-highlight">
          AI 취업 분석
        </Link>
      </div>
    </section>
  );
}
