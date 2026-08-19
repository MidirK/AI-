# AI-

AI정보공학과 학생 통합 플랫폼 — 학과 공지, 커뮤니티, 취업 정보, AI 기반 취업 준비도 분석을 하나로 묶은 웹 서비스.

## 문서

- [기획안](docs/기획안.md)
- [API 명세서 (초안)](docs/api-spec.md)
- [배포 가이드](docs/배포가이드.md)
- [TODO](docs/TODO.md)
- [이용약관 (초안)](docs/이용약관.md) · [개인정보처리방침 (초안)](docs/개인정보처리방침.md)

## 구조

```
AICOM/
├── backend/    # FastAPI + PostgreSQL 서버
├── frontend/   # React + Vite 클라이언트
└── docs/       # 기획안, API 명세서
```

## 시작하기

### 백엔드

```
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

### 프론트엔드

```
cd frontend
npm install
npm run dev
```
