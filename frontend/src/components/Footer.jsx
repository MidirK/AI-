// 사이트 하단 푸터. 플랫폼 소개와 이용약관/개인정보처리방침 링크를 제공한다.

import { Link } from "react-router-dom";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-col">
          <Link to="/" className="footer-brand">
            <span className="brand-mark">A</span>
            AICOM
          </Link>
          <p>AI정보공학과 학생들을 위한 통합 플랫폼입니다. 학과 공지, 커뮤니티, 취업 정보와 AI 기반 취업
            준비도 분석을 한곳에서 확인하세요.</p>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">바로가기</div>
          <nav className="footer-links">
            <Link to="/posts/notice">공지사항</Link>
            <Link to="/posts/job">취업 정보</Link>
            <Link to="/career">AI 취업 분석</Link>
          </nav>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">정책</div>
          <nav className="footer-links">
            <Link to="/terms">이용약관</Link>
            <Link to="/privacy">개인정보처리방침</Link>
          </nav>
        </div>
      </div>
      <div className="site-footer-bottom">© {year} AI정보공학과 통합 플랫폼(AICOM). All rights reserved.</div>
    </footer>
  );
}
