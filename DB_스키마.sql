-- ================================================================
-- 학과 커뮤니티 웹사이트 DB 스키마 (v2)
-- MySQL 8.0 기준
--
-- 실행 방법
--   - MySQL Workbench / DBeaver 등에서 이 파일을 열어 전체 실행
--   - 또는 터미널: mysql -u [사용자명] -p < DB_스키마.sql
--
-- v2 변경사항: users 테이블에 회원가입 승인제 반영
--   - 추가: user_type, status, verification_doc_path
--   - 제거: is_active (status로 대체)
-- ================================================================

CREATE DATABASE IF NOT EXISTS community_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;   -- 한글 저장을 위해 utf8mb4 필수

USE community_db;

-- ----------------------------------------------------------------
-- 1. users : 회원 정보
-- ----------------------------------------------------------------
CREATE TABLE users (
    id                     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email                  VARCHAR(100) NOT NULL UNIQUE COMMENT '로그인 아이디로 사용',
    password               VARCHAR(255) NOT NULL COMMENT '해시된 비밀번호 (bcrypt 등)',
    nickname               VARCHAR(50)  NOT NULL UNIQUE,
    student_id             VARCHAR(20)  NULL COMMENT '학번',
    user_type              ENUM('신입생', '재학생', '졸업생') NOT NULL,
    role                   ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    status                 ENUM('pending', 'active', 'suspended', 'withdrawn', 'rejected')
                               NOT NULL DEFAULT 'pending' COMMENT '가입 승인/정지/탈퇴 상태',
    verification_doc_path  VARCHAR(255) NULL COMMENT '증명서 파일 경로 - 승인/거절 후 NULL로 초기화',
    created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 2. posts : 게시글 (공지/자유/스터디/취업/선후배 공통) — v1과 동일
--    게시판마다 테이블을 따로 만들지 않고 category로 구분
-- ----------------------------------------------------------------
CREATE TABLE posts (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id      INT UNSIGNED NOT NULL,
    category     ENUM('notice', 'free', 'study', 'job', 'senior') NOT NULL,
    title        VARCHAR(200) NOT NULL,
    content      TEXT NOT NULL,
    view_count   INT UNSIGNED NOT NULL DEFAULT 0,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_posts_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE RESTRICT,               -- 회원 탈퇴는 status='withdrawn' 처리라 실제 DELETE는 발생하지 않음

    INDEX idx_posts_category (category),
    INDEX idx_posts_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 3. comments : 댓글 — v1과 동일
-- ----------------------------------------------------------------
CREATE TABLE comments (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    post_id      INT UNSIGNED NOT NULL,
    user_id      INT UNSIGNED NOT NULL,
    content      VARCHAR(500) NOT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_comments_post
        FOREIGN KEY (post_id) REFERENCES posts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comments_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE RESTRICT,

    INDEX idx_comments_post_id (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 4. study_details : 스터디/프로젝트 모집 부가 정보 — v1과 동일
-- ----------------------------------------------------------------
CREATE TABLE study_details (
    post_id         INT UNSIGNED PRIMARY KEY,
    recruit_count   INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '모집 인원',
    current_count   INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '현재 인원(작성자 포함)',
    status          ENUM('모집중', '모집완료') NOT NULL DEFAULT '모집중',

    CONSTRAINT fk_study_post
        FOREIGN KEY (post_id) REFERENCES posts(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 5. job_details : 취업정보 부가 정보 — v1과 동일
-- ----------------------------------------------------------------
CREATE TABLE job_details (
    post_id     INT UNSIGNED PRIMARY KEY,
    company     VARCHAR(100) NULL COMMENT '회사명',
    deadline    DATE NULL COMMENT '마감일',

    CONSTRAINT fk_job_post
        FOREIGN KEY (post_id) REFERENCES posts(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
