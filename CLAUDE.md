# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

**AI정보공학과 통합 플랫폼** — 학과 공지, 커뮤니티, 취업 정보, AI 기반 취업 준비도 분석을 하나로 묶은 웹 서비스.
기획 배경과 상세 기능은 `docs/기획안.md`, API 설계는 `docs/api-spec.md` 참고.

## 기술 스택

- **백엔드**: FastAPI + SQLAlchemy + Alembic + PostgreSQL (`backend/`)
- **프론트엔드**: React + Vite (`frontend/`)
- **인증**: JWT (`Authorization: Bearer {token}`)

## 저장소 구조

```
AICOM/
├── backend/    # FastAPI 서버
├── frontend/   # React + Vite 클라이언트
└── docs/       # 기획안, API 명세서 등 문서
```

## 코딩 컨벤션

- **식별자(변수명, 함수명, 클래스명 등)**: 영어로 작성
- **주석 및 문서**: 한국어로 작성
- **커뮤니케이션**: 한국어 사용

프로젝트 구조나 기술 스택이 바뀌면 Claude Code에게

"CLAUDE.md도 같이 업데이트해줘."

하위 폴더(`backend/`, `frontend/`)에서 클로드 코드 실행 시 이 문서와 같은 내용의 CLAUDE.md 파일을 참고합니다.
