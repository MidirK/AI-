# CLAUDE.md (backend)

이 파일은 Claude Code가 `backend/` 폴더에서 작업할 때 참고하는 가이드입니다.
전체 프로젝트 개요는 상위 `../CLAUDE.md` 참고.

## 기술 스택

- FastAPI, SQLAlchemy 2.x, Alembic, PostgreSQL, JWT(python-jose), passlib(bcrypt)

## 구조

```
backend/
├── app/
│   ├── main.py           # FastAPI 엔트리포인트, 라우터 등록
│   ├── core/              # 설정(config.py), 보안/JWT(security.py)
│   ├── db/                # SQLAlchemy engine/session/Base
│   ├── models/             # SQLAlchemy ORM 모델
│   ├── schemas/            # Pydantic 요청/응답 스키마
│   ├── services/           # 순수 로직 (예: career_analysis.py — AI 취업 준비도 분석)
│   └── api/routers/        # 엔드포인트 (auth, posts, comments, users, study, career)
├── alembic/                # DB 마이그레이션
├── scripts/                # 운영용 CLI 스크립트 (promote_admin.py 등)
├── tests/                  # pytest (인메모리 SQLite 사용)
└── requirements.txt
```

## 운영 관련

- 회원가입 시 학교 이메일만 허용하려면 `.env`의 `ALLOWED_EMAIL_DOMAINS`를 채운다 (비워두면 전체 허용).
- `/auth/signup`, `/auth/login`은 rate limit이 걸려 있다 (`app/core/limiter.py`).
- 관리자 계정은 API로 만들 수 없다. `python -m scripts.promote_admin <email>`로 승격시킨다.
- 실제 배포 절차는 `../docs/배포가이드.md` 참고.

## 개발 실행

```
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env   # 값 채우기
uvicorn app.main:app --reload
```

## 테스트

```
pytest
```

인메모리 SQLite로 매 테스트마다 깨끗한 DB를 만들어 사용하므로(`tests/conftest.py`), 실제 Postgres 연결 없이 실행된다.

## 코딩 컨벤션

- **식별자(변수명, 함수명, 클래스명 등)**: 영어로 작성
- **주석 및 문서**: 한국어로 작성
- **커뮤니케이션**: 한국어 사용
- API 응답/요청 필드 이름은 `docs/api-spec.md`(저장소 루트)에 맞춘다. 스펙을 변경하게 되면 문서도 함께 갱신한다.
