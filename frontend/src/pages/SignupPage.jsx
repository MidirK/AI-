// 회원가입 페이지. 가입 성공 후에는 로그인 대신 "메일함을 확인해주세요" 안내로 전환한다.

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { resendVerification } from "../api/auth";

export default function SignupPage() {
  const { signup } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [signedUpEmail, setSignedUpEmail] = useState(null);
  const [resendMessage, setResendMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signup({ email, password, nickname, studentId });
      setSignedUpEmail(email);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setResendMessage("");
    try {
      const res = await resendVerification(signedUpEmail);
      setResendMessage(res.message);
    } catch (err) {
      setResendMessage(err.message);
    }
  }

  if (signedUpEmail) {
    return (
      <section className="page page-narrow">
        <h1>메일함을 확인해주세요</h1>
        <p>
          <strong>{signedUpEmail}</strong>로 인증 메일을 보냈습니다. 메일 속 링크를 눌러 인증을 완료하면
          로그인할 수 있어요.
        </p>
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={handleResend}>
            인증 메일 다시 보내기
          </button>
        </div>
        {resendMessage && <p className="status-text">{resendMessage}</p>}
      </section>
    );
  }

  return (
    <section className="page page-narrow">
      <h1>회원가입</h1>
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
        <label>
          닉네임
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} required />
        </label>
        <label>
          학번
          <input value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
        </label>

        {error && <p className="status-text error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "가입 중..." : "가입하기"}
          </button>
        </div>
      </form>
    </section>
  );
}
