// 홈(랜딩) 페이지. 주요 게시판으로 바로 이동할 수 있는 진입점 역할을 한다.

import { Link } from "react-router-dom";
import { POST_CATEGORIES } from "../api/posts";

const CATEGORY_ICONS = {
  notice: "📢",
  free: "💬",
  study: "👥",
  job: "💼",
  senior: "🎓",
};

const FEATURES = [
  {
    title: "학과 커뮤니티",
    description: "공지사항부터 자유게시판, 선후배 교류까지 학과 소식을 한곳에서 확인하세요.",
  },
  {
    title: "스터디 & 취업정보",
    description: "함께할 스터디·프로젝트 팀원을 모집하고, 채용 공고와 마감일을 놓치지 마세요.",
  },
  {
    title: "AI 취업 준비도 분석",
    description: "학점·자격증·프로젝트 경험을 입력하면 나의 준비도 점수와 추천 항목을 알려드려요.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <span className="hero-eyebrow">AI정보공학과 통합 플랫폼</span>
          <h1>학과 생활의 모든 것, 한 곳에서</h1>
          <p>공지사항, 커뮤니티, 취업 정보를 모으고 AI로 나의 취업 준비도까지 분석해 드립니다.</p>
          <div className="hero-cta">
            <Link to="/career" className="btn btn-primary">
              AI 취업 분석 시작하기
            </Link>
            <Link to="/posts/notice" className="btn btn-ghost">
              공지사항 보기
            </Link>
          </div>
        </div>
      </section>

      <h2 className="section-heading">게시판 바로가기</h2>
      <div className="category-grid">
        {POST_CATEGORIES.map((category) => (
          <Link key={category.value} to={`/posts/${category.value}`} className="category-card">
            <span className="category-card-icon">{CATEGORY_ICONS[category.value] ?? "📌"}</span>
            {category.label}
          </Link>
        ))}
        <Link to="/career" className="category-card category-card-highlight">
          <span className="category-card-icon">✨</span>
          AI 취업 분석
        </Link>
      </div>

      <h2 className="section-heading">이런 것을 할 수 있어요</h2>
      <div className="feature-grid">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}
