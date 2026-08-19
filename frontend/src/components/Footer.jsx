// 사이트 하단 푸터. 이용약관/개인정보처리방침 링크를 제공한다.

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span>AI정보공학과 통합 플랫폼</span>
        <nav className="footer-links">
          <Link to="/terms">이용약관</Link>
          <Link to="/privacy">개인정보처리방침</Link>
        </nav>
      </div>
    </footer>
  );
}
