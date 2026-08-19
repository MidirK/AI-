"""이메일 발송 (Resend API 사용).

RESEND_API_KEY가 설정되어 있지 않으면(로컬 개발 환경 등) 실제로 보내지 않고
콘솔에 인증 링크를 출력한다 — 테스트/개발 중에 실제 메일 계정 없이도 흐름을 확인할 수 있다.
"""

import httpx

from app.core.config import settings

RESEND_API_URL = "https://api.resend.com/emails"


def send_verification_email(to_email: str, token: str) -> None:
    verify_url = f"{settings.frontend_base_url}/verify-email?token={token}"
    html = f"""
        <p>안녕하세요, AI정보공학과 통합 플랫폼입니다.</p>
        <p>아래 버튼을 눌러 이메일 인증을 완료해주세요. (24시간 이내 유효)</p>
        <p><a href="{verify_url}">이메일 인증하기</a></p>
        <p>버튼이 동작하지 않으면 아래 링크를 브라우저 주소창에 붙여넣어주세요.</p>
        <p>{verify_url}</p>
    """
    _send(to=to_email, subject="[AICOM] 이메일 인증을 완료해주세요", html=html)


def _send(to: str, subject: str, html: str) -> None:
    if not settings.resend_api_key:
        print(f"[email] RESEND_API_KEY가 설정되지 않아 발송을 생략합니다. 수신자: {to}\n{html}")
        return

    response = httpx.post(
        RESEND_API_URL,
        headers={"Authorization": f"Bearer {settings.resend_api_key}"},
        json={"from": settings.email_from, "to": [to], "subject": subject, "html": html},
        timeout=10,
    )
    response.raise_for_status()
