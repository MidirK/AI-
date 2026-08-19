# 학과 커뮤니티 웹사이트 API 명세서 (초안)

이 문서는 초안입니다. 팀 회의를 통해 세부 사항(필드명, 응답 형식 등)을 조정한 뒤 확정해주세요.

- **Base URL (개발)**: `http://localhost:8000/api`
- **데이터 형식**: JSON
- **인증 방식**: JWT (로그인 시 발급된 토큰을 `Authorization: Bearer {token}` 헤더에 담아 요청)

---

## 0. 공통 규칙

### 0-1. 인증이 필요한 요청

요청 헤더에 아래와 같이 토큰을 포함합니다.

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

토큰이 없거나 만료된 경우 `401 Unauthorized` 를 반환합니다.

### 0-2. 공통 에러 응답 형식

FastAPI의 기본 예외 처리 형식을 그대로 사용합니다.

```json
{
  "detail": "에러 메시지"
}
```

### 0-3. 페이지네이션 (목록 조회 공통)

쿼리 파라미터: `page` (기본값 1), `size` (기본값 10)

목록 응답 공통 형식:

```json
{
  "total": 42,
  "page": 1,
  "size": 10,
  "items": []
}
```

### 0-4. 상태 코드 규칙

| 코드 | 의미 | 사용 예 |
|---|---|---|
| 200 | 성공 (조회/수정) | GET, PUT, PATCH |
| 201 | 생성 성공 | POST (회원가입, 게시글 작성 등) |
| 204 | 성공, 응답 본문 없음 | DELETE |
| 400 | 잘못된 요청 | 필수 필드 누락 등 |
| 401 | 인증 필요 | 로그인 안 함 / 토큰 만료 |
| 403 | 권한 없음 | 작성자가 아닌데 수정 시도 등 |
| 404 | 리소스 없음 | 존재하지 않는 게시글 ID |

### 0-5. 게시판 카테고리 값

`posts` 테이블의 `category` 필드에 들어가는 값입니다. 게시판 종류가 늘어나도 API 구조는 그대로 두고 이 값만 추가하면 됩니다.

| 값 | 의미 | 작성 권한 |
|---|---|---|
| notice | 공지사항 | 관리자만 |
| free | 자유게시판 | 로그인한 회원 |
| study | 스터디/프로젝트 모집 | 로그인한 회원 |
| job | 취업정보 | 로그인한 회원 |
| senior | 선후배 커뮤니티 | 로그인한 회원 |

---

## 1. 인증 (Auth)

### `POST /auth/signup` — 회원가입

인증: 불필요

요청 body:

```json
{
  "email": "student@university.ac.kr",
  "password": "password123!",
  "nickname": "홍길동",
  "student_id": "20231234"
}
```

응답 201:

```json
{
  "id": 1,
  "email": "student@university.ac.kr",
  "nickname": "홍길동"
}
```

> 논의 필요: 이메일 학교 도메인 검증을 할지, 학번 인증(재학생 확인)을 어떻게 할지는 팀 회의에서 정해야 합니다.

### `POST /auth/login` — 로그인

인증: 불필요

요청 body:

```json
{
  "email": "student@university.ac.kr",
  "password": "password123!"
}
```

응답 200:

```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer"
}
```

---

## 2. 게시글 (Posts) — 공지/자유/스터디/취업/선후배 공통

### `GET /posts` — 게시글 목록 조회

인증: 불필요
쿼리 파라미터: `category` (필수), `page`, `size`

응답 200:

```json
{
  "total": 42,
  "page": 1,
  "size": 10,
  "items": [
    {
      "id": 15,
      "category": "study",
      "title": "게시글 제목",
      "nickname": "홍길동",
      "view_count": 3,
      "created_at": "2026-08-01T10:00:00"
    }
  ]
}
```

### `GET /posts/{post_id}` — 게시글 상세 조회

인증: 불필요 (단, `is_mine` 값 계산에는 로그인 여부 사용)

응답 200:

```json
{
  "id": 15,
  "category": "study",
  "title": "게시글 제목",
  "content": "본문 내용",
  "nickname": "홍길동",
  "view_count": 4,
  "created_at": "2026-08-01T10:00:00",
  "updated_at": "2026-08-01T10:00:00",
  "is_mine": false,
  "study_info": {
    "recruit_count": 4,
    "current_count": 2,
    "status": "모집중"
  }
}
```

`study_info`는 category가 `study`일 때만, `job_info`(마감일 등)는 category가 `job`일 때만 포함됩니다.

### `POST /posts` — 게시글 작성

인증: 필요 (category가 `notice`이면 관리자만 허용 → 403 처리)

요청 body:

```json
{
  "category": "study",
  "title": "제목",
  "content": "내용",
  "recruit_count": 4
}
```

`recruit_count`는 category가 `study`일 때만, `job_deadline`(ISO 8601)은 category가 `job`일 때만 사용합니다.

응답: 201, 생성된 게시글 정보 반환

### `PUT /posts/{post_id}` — 게시글 수정

인증: 필요 (작성자 본인만, 아니면 403)

요청 body: `title`, `content` 등 수정할 필드

### `DELETE /posts/{post_id}` — 게시글 삭제

인증: 필요 (작성자 본인 또는 관리자, 아니면 403)
응답: 204

---

## 3. 댓글 (Comments)

### `GET /posts/{post_id}/comments` — 댓글 목록 조회

인증: 불필요

응답 200:

```json
[
  {
    "id": 7,
    "content": "댓글 내용",
    "nickname": "김철수",
    "created_at": "2026-08-01T11:00:00",
    "is_mine": false
  }
]
```

### `POST /posts/{post_id}/comments` — 댓글 작성

인증: 필요

요청 body:

```json
{ "content": "댓글 내용" }
```

응답: 201

### `DELETE /comments/{comment_id}` — 댓글 삭제

인증: 필요 (작성자 본인 또는 관리자)
응답: 204

---

## 4. 마이페이지 (Users)

### `GET /users/me` — 내 정보 조회

인증: 필요

응답 200:

```json
{
  "id": 1,
  "email": "student@university.ac.kr",
  "nickname": "홍길동",
  "student_id": "20231234",
  "role": "student"
}
```

### `PUT /users/me` — 내 정보 수정

인증: 필요
요청 body: `nickname` 등 수정 가능한 필드만

### `GET /users/me/posts` — 내가 쓴 글 목록

인증: 필요
쿼리 파라미터: `page`, `size`

### `GET /users/me/comments` — 내가 쓴 댓글 목록

인증: 필요

---

## 5. 스터디 모집 전용

### `PATCH /posts/{post_id}/study-status` — 모집 상태 변경

인증: 필요 (작성자 본인만)

요청 body:

```json
{ "status": "모집완료" }
```

---

## 6. AI 취업 준비도 분석 (Career)

v1은 규칙 기반(가중치 점수 계산) 로직으로 동작합니다. 입출력 형태는 실제 LLM 기반 분석으로 교체되어도
바뀌지 않도록 설계했습니다 (`backend/app/services/career_analysis.py` 참고).

### `POST /career/analyze` — 취업 준비도 분석 요청

인증: 필요

요청 body:

```json
{
  "grade": 3,
  "gpa": 3.8,
  "certificates": ["정보처리기사"],
  "language_score_text": "토익 850",
  "project_count": 2,
  "competition_count": 1,
  "has_intern_experience": false,
  "github_url": "https://github.com/example"
}
```

| 필드 | 필수 | 설명 |
|---|---|---|
| grade | O | 학년 (1~4) |
| gpa | O | 학점 (4.5 만점 기준) |
| certificates | X | 보유 자격증 목록 (기본값: []) |
| language_score_text | X | 어학 성적 자유 입력 (예: "토익 850") |
| project_count | X | 프로젝트 경험 개수 (기본값: 0) |
| competition_count | X | 공모전 수상 개수 (기본값: 0) |
| has_intern_experience | X | 인턴 경험 여부 (기본값: false) |
| github_url | X | GitHub 프로필 URL |

응답 201: 제출할 때마다 이력이 한 건씩 쌓입니다.

```json
{
  "id": 1,
  "readiness_score": 62,
  "readiness_level": "양호",
  "weak_areas": ["공모전 경험", "인턴 경험"],
  "recommended_certificates": ["SQLD (SQL 개발자)", "빅데이터분석기사", "리눅스마스터"],
  "recommended_projects": ["팀 프로젝트 경험 늘리기 (스터디 게시판 활용)", "완성한 프로젝트를 GitHub에 정리해 포트폴리오로 만들기"],
  "recommended_learning_areas": ["공모전·해커톤 참가로 실전 경험 쌓기", "인턴·현장실습 지원"],
  "created_at": "2026-08-19T10:00:00"
}
```

`readiness_level`은 `준비 필요`(0~39) / `보통`(40~59) / `양호`(60~79) / `우수`(80~100) 중 하나입니다.

### `GET /career/analyze/latest` — 가장 최근 분석 결과 조회

인증: 필요
응답: 위와 동일한 형식 (200). 분석 이력이 없으면 404.
