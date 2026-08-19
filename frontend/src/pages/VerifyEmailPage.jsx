// 이메일 인증 페이지. 이메일 속 링크(?token=...)를 통해 접속하면 자동으로 인증을 시도한다.

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../api/auth";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("인증 링크가 올바르지 않습니다.");
      return;
    }

    verifyEmail(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message);
      });
  }, [token]);

  return (
    <section className="page page-narrow">
      <h1>이메일 인증</h1>

      {status === "loading" && <p className="status-text">인증 확인 중...</p>}

      {status === "success" && (
        <>
          <p className="status-text">{message}</p>
          <div className="form-actions">
            <Link to="/login" className="btn btn-primary">
              로그인하러 가기
            </Link>
          </div>
        </>
      )}

      {status === "error" && <p className="status-text error">{message}</p>}
    </section>
  );
}
