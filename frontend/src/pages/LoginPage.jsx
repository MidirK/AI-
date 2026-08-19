// 로그인 페이지.

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resendVerification } from "../api/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNeedsVerification(false);
    setResendMessage("");
    setSubmitting(true);

    try {
      await login({ email, password });
      const redirectTo = location.state?.from?.pathname ?? "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
      if (err.code === "EMAIL_NOT_VERIFIED") {
        setNeedsVerification(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setResendMessage("");
    try {
      const res = await resendVerification(email);
      setResendMessage(res.message);
    } catch (err) {
      setResendMessage(err.message);
    }
  }

  return (
    <section className="page page-narrow">
      <h1>로그인</h1>
      <form className="post-form" onSubmit={handleSubmit}>
        <label>
          이메일
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="status-text error">{error}</p>}

        {needsVerification && (
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={handleResend}>
              인증 메일 다시 보내기
            </button>
          </div>
        )}
        {resendMessage && <p className="status-text">{resendMessage}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "로그인 중..." : "로그인"}
          </button>
        </div>
      </form>
    </section>
  );
}
