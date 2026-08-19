# 학과 커뮤니티 웹사이트 API 명세서 (초안 v2)

> v2 변경사항: 회원가입을 승인제로 변경(증명서 업로드 + 관리자 승인), 게시판별 조회 권한 차등 적용, 회원 상태(status) 체계 도입. 바뀐 부분은 각 섹션과 7번 요약표의 "비고" 열에 표시했습니다.

- Base URL (개발): `http://localhost:8000/api`
- 데이터 형식: JSON (단, 회원가입은 파일 업로드가 있어 `multipart/form-data`)
- 인증 방식: JWT (로그인 시 발급된 토큰을 `Authorization: Bearer {token}` 헤더에 담아 요청)

---

## 0. 공통 규칙

### 0-1. 인증이 필요한 요청
요청 헤더에 아래와 같이 토큰을 포함합니다.
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```
토큰이 없거나 만료된 경우 **401 Unauthorized**를 반환합니다.

> **중요 (v2)**: 이 문서에서 "인증 필요(✓)"로 표시된 API는 토큰이 유효한 것 외에도 해당 회원의 `status`가 `active`여야 합니다. `pending`/`suspended`/`withdrawn`/`rejected` 상태인 회원이 요청하면 **403 Forbidden**을 반환합니다.

### 0-2. 공통 에러 응답 형식
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
  "items": [ ]
}
```

### 0-4. 상태 코드 규칙
| 코드 | 의미 | 사용 예 |
|---|---|---|
| 200 | 성공 (조회/수정) | GET, PUT, PATCH |
| 201 | 생성 성공 | POST (회원가입, 게시글 작성 등) |
| 204 | 성공, 응답 본문 없음 | DELETE |
| 400 | 잘못된 요청 | 필수 필드 누락, 비밀번호 조건 미충족 등 |
| 401 | 인증 필요 | 로그인 안 함 / 토큰 만료 |
| 403 | 권한 없음 | 작성자가 아닌데 수정 시도, `status`가 `active`가 아님 등 |
| 404 | 리소스 없음 | 존재하지 않는 게시글 ID |

### 0-5. 게시판 카테고리 값
| 값 | 의미 | 작성 권한 | 조회 권한 (v2) |
|---|---|---|---|
| `notice` | 공지사항 | 관리자만 | 전체 (비회원 포함) |
| `free` | 자유게시판 | 활성 회원 | 전체 (비회원 포함) |
| `study` | 스터디/프로젝트 모집 | 활성 회원 | 전체 (비회원 포함) |
| `job` | 취업정보 | 활성 회원 | 활성 회원만 |
| `senior` | 선후배 커뮤니티 | 활성 회원 | 활성 회원만 |

### 0-6. 회원 상태(`status`) 값 — v2 신규
| 값 | 의미 | 로그인 |
|---|---|---|
| `pending` | 가입 신청 후 승인 대기중 | 불가 |
| `active` | 정상 활동 회원 | 가능 |
| `suspended` | 관리자에 의해 정지됨 | 불가 |
| `withdrawn` | 본인이 탈퇴함 | 불가 |
| `rejected` | 관리자가 가입을 거절함 | 불가 |

> `rejected`는 원래 요구사항에 명시되지 않았지만, "승인 또는 거절" 흐름을 완성하려면 거절 상태를 구분해서 저장할 값이 필요해 추가했습니다. 다른 이름이나 처리 방식을 원하시면 조정해주세요.

---

## 1. 인증 (Auth)

### POST `/auth/signup` — 회원가입 신청 (v2 수정)
인증: 불필요
Content-Type: `multipart/form-data` (증명서 파일을 함께 받기 때문에 JSON이 아닌 form-data 사용)

요청 필드:
| 필드 | 타입 | 설명 |
|---|---|---|
| `email` | string | |
| `password` | string | 최소 6자 이상 + 영문자 1개 이상 + 특수문자 1개 이상 |
| `nickname` | string | |
| `student_id` | string | 학번 |
| `user_type` | string | `신입생` / `재학생` / `졸업생` 중 하나 |
| `verification_doc` | file | 신입생: 입학·합격증명서 / 재학생: 재학증명서 / 졸업생: 졸업증명서 |

응답 `201`:
```json
{
  "id": 1,
  "email": "student@university.ac.kr",
  "nickname": "홍길동",
  "status": "pending"
}
```

응답 `400` (비밀번호 조건 미충족 시):
```json
{
  "detail": "비밀번호는 최소 6자 이상이며, 영문자와 특수문자를 각각 1개 이상 포함해야 합니다."
}
```

> 논의 필요: 증명서 파일의 허용 형식과 용량 제한이 정해지지 않아 우선 `pdf/jpg/png`, 최대 5MB로 가정했습니다. 확정해서 알려주세요.

### POST `/auth/login` — 로그인 (v2 수정)
인증: 불필요

요청 body:
```json
{
  "email": "student@university.ac.kr",
  "password": "password123!"
}
```

응답 `200` (status가 `active`인 경우):
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer"
}
```

응답 `403` (status가 `active`가 아닌 경우, 메시지는 상태별로 다르게 반환):
```json
{ "detail": "가입 승인 대기중입니다." }
```

---

## 2. 게시글 (Posts) — 공지/자유/스터디/취업/선후배 공통

### GET `/posts` — 게시글 목록 조회 (v2 수정)
인증: **카테고리에 따라 다름** (0-5 참고) — `notice`/`free`/`study`는 불필요, `job`/`senior`는 필요 (비회원·비활성 회원은 403)
쿼리 파라미터: `category` (필수), `page`, `size`

응답 `200`: (형식 변경 없음)
```json
{
  "total": 42,
  "page": 1,
  "size": 10,
  "items": [
    {
      "id": 15,
      "title": "게시글 제목",
      "nickname": "홍길동",
      "view_count": 3,
      "created_at": "2026-08-01T10:00:00"
    }
  ]
}
```

### GET `/posts/{post_id}` — 게시글 상세 조회 (v2 수정)
인증: 위 목록 조회와 동일한 규칙 (게시글의 category 기준)

응답 `200`: (형식 변경 없음)
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

### POST `/posts` — 게시글 작성
인증: 필요 (`category`가 `notice`면 관리자만 허용 → 아니면 403)

요청 body:
```json
{
  "category": "study",
  "title": "제목",
  "content": "내용",
  "recruit_count": 4
}
```
응답: `201`

### PUT `/posts/{post_id}` — 게시글 수정
인증: 필요 (작성자 본인만)

### DELETE `/posts/{post_id}` — 게시글 삭제
인증: 필요 (작성자 본인 또는 관리자)
응답: `204`

---

## 3. 댓글 (Comments)

### GET `/posts/{post_id}/comments` — 댓글 목록 조회
인증: 불필요

응답 `200`:
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

### POST `/posts/{post_id}/comments` — 댓글 작성
인증: 필요

요청 body:
```json
{ "content": "댓글 내용" }
```
응답: `201`

### DELETE `/comments/{comment_id}` — 댓글 삭제
인증: 필요 (작성자 본인 또는 관리자)
응답: `204`

---

## 4. 마이페이지 (Users)

### GET `/users/me` — 내 정보 조회
인증: 필요

응답 `200`:
```json
{
  "id": 1,
  "email": "student@university.ac.kr",
  "nickname": "홍길동",
  "student_id": "20231234",
  "user_type": "재학생",
  "role": "student",
  "status": "active"
}
```

### PUT `/users/me` — 내 정보 수정
인증: 필요
요청 body: `nickname` 등 수정 가능한 필드만

### DELETE `/users/me` — 회원 탈퇴 (v2 신규)
인증: 필요
처리 내용: `status`를 `withdrawn`으로 변경합니다 (데이터는 삭제하지 않음). 기존에 작성한 게시글·댓글은 그대로 남습니다.
응답: `204`

### GET `/users/me/posts` — 내가 쓴 글 목록
인증: 필요

### GET `/users/me/comments` — 내가 쓴 댓글 목록
인증: 필요

---

## 5. 스터디 모집 전용

### PATCH `/posts/{post_id}/study-status` — 모집 상태 변경
인증: 필요 (작성자 본인만)

요청 body:
```json
{ "status": "모집완료" }
```

---

## 6. 관리자 (Admin)

> `/admin/*` 전체는 `role`이 `admin`인 사용자만 접근 가능해야 합니다.

### GET `/admin/users` — 전체 회원 목록 조회

### GET `/admin/users/pending` — 승인 대기 회원 목록 (v2 신규)
인증: 필요 (관리자)
쿼리 파라미터: `page`, `size`

응답 `200`:
```json
{
  "total": 5,
  "page": 1,
  "size": 10,
  "items": [
    {
      "id": 10,
      "email": "new@university.ac.kr",
      "nickname": "김신입",
      "student_id": "20261234",
      "user_type": "신입생",
      "verification_doc_url": "/uploads/verification/10_admission.pdf",
      "created_at": "2026-08-10T09:00:00"
    }
  ]
}
```

### PATCH `/admin/users/{user_id}/approve` — 가입 승인 (v2 신규)
인증: 필요 (관리자)
요청 body: 없음
처리 내용: `status` → `active`, `verification_doc_path` → `NULL`로 초기화 + 서버에 저장된 파일 즉시 삭제

응답 `200`:
```json
{ "id": 10, "status": "active" }
```

### PATCH `/admin/users/{user_id}/reject` — 가입 거절 (v2 신규)
인증: 필요 (관리자)
요청 body: 없음
처리 내용: `status` → `rejected`, `verification_doc_path` → `NULL`로 초기화 + 서버에 저장된 파일 즉시 삭제

응답 `200`:
```json
{ "id": 10, "status": "rejected" }
```

### PATCH `/admin/users/{user_id}` — 회원 권한/상태 변경 (v2: body 예시 수정)
요청 body 예시:
```json
{ "status": "suspended" }
```
또는
```json
{ "role": "admin" }
```

### DELETE `/admin/posts/{post_id}` — 게시글 강제 삭제

### DELETE `/admin/comments/{comment_id}` — 댓글 강제 삭제

---

## 7. 전체 엔드포인트 요약표

| 분류 | Method | URL | 인증 | 설명 | 비고 |
|---|---|---|---|---|---|
| 인증 | POST | /auth/signup | ✕ | 회원가입 신청 | 수정 |
| 인증 | POST | /auth/login | ✕ | 로그인 | 수정 |
| 게시글 | GET | /posts | 카테고리별 | 목록 조회 | 수정 |
| 게시글 | GET | /posts/{post_id} | 카테고리별 | 상세 조회 | 수정 |
| 게시글 | POST | /posts | ✓ | 작성 | |
| 게시글 | PUT | /posts/{post_id} | ✓ | 수정 (작성자만) | |
| 게시글 | DELETE | /posts/{post_id} | ✓ | 삭제 (작성자/관리자) | |
| 댓글 | GET | /posts/{post_id}/comments | ✕ | 목록 조회 | |
| 댓글 | POST | /posts/{post_id}/comments | ✓ | 작성 | |
| 댓글 | DELETE | /comments/{comment_id} | ✓ | 삭제 (작성자/관리자) | |
| 마이페이지 | GET | /users/me | ✓ | 내 정보 조회 | |
| 마이페이지 | PUT | /users/me | ✓ | 내 정보 수정 | |
| 마이페이지 | DELETE | /users/me | ✓ | 회원 탈퇴 | 신규 |
| 마이페이지 | GET | /users/me/posts | ✓ | 내가 쓴 글 | |
| 마이페이지 | GET | /users/me/comments | ✓ | 내가 쓴 댓글 | |
| 스터디 | PATCH | /posts/{post_id}/study-status | ✓ | 모집 상태 변경 | |
| 관리자 | GET | /admin/users | ✓ | 회원 목록 | |
| 관리자 | GET | /admin/users/pending | ✓ | 승인 대기 목록 | 신규 |
| 관리자 | PATCH | /admin/users/{user_id}/approve | ✓ | 가입 승인 | 신규 |
| 관리자 | PATCH | /admin/users/{user_id}/reject | ✓ | 가입 거절 | 신규 |
| 관리자 | PATCH | /admin/users/{user_id} | ✓ | 권한/상태 변경 | 수정 |
| 관리자 | DELETE | /admin/posts/{post_id} | ✓ | 게시글 강제 삭제 | |
| 관리자 | DELETE | /admin/comments/{comment_id} | ✓ | 댓글 강제 삭제 | |

---

## 8. 팀 회의에서 추가로 정해야 할 것

1. 이미지/파일 첨부 — 게시글 자체에 이미지 넣을지 (증명서 업로드와는 별개)
2. 검색 기능 — 제목/내용 검색 API 필요 여부
3. Refresh Token 사용 여부
4. 알림 기능 — MVP 이후로 미뤄도 무방
5. **증명서 파일 형식·용량 제한** — 현재 pdf/jpg/png, 5MB로 임시 가정
6. **거절(rejected)된 회원의 재가입 가능 여부** — 이메일이 `UNIQUE`라 현재 구조로는 같은 이메일로 재가입 불가

이미 해결됨: ~~닉네임 중복 검사~~ (DB `UNIQUE`), ~~이메일 학교 도메인 인증~~ (사용하지 않기로 결정), ~~비회원 열람 범위~~, ~~회원 상태 관리~~, ~~비밀번호 정책~~
