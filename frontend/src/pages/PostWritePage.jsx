// 게시글 작성/수정 페이지.
// "/posts/:category/write" 로 들어오면 작성 모드, "/post/:postId/edit" 으로 들어오면 수정 모드로 동작한다.

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPost, fetchPost, POST_CATEGORIES, updatePost } from "../api/posts";

export default function PostWritePage() {
  const { category, postId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(postId);

  const [postCategory, setPostCategory] = useState(category ?? null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [recruitCount, setRecruitCount] = useState("");
  const [jobDeadline, setJobDeadline] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  const categoryInfo = POST_CATEGORIES.find((item) => item.value === postCategory);

  useEffect(() => {
    if (!isEdit) return;
    fetchPost(postId)
      .then((post) => {
        setPostCategory(post.category);
        setTitle(post.title);
        setContent(post.content);
        if (post.study_info) setRecruitCount(String(post.study_info.recruit_count ?? ""));
        if (post.job_info?.deadline) setJobDeadline(post.job_info.deadline.slice(0, 10));
      })
      .finally(() => setLoading(false));
  }, [isEdit, postId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isEdit) {
        await updatePost(postId, { title, content });
        navigate(`/post/${postId}`);
      } else {
        const payload = { category, title, content };
        if (category === "study" && recruitCount) {
          payload.recruit_count = Number(recruitCount);
        }
        if (category === "job" && jobDeadline) {
          payload.job_deadline = jobDeadline;
        }
        const created = await createPost(payload);
        navigate(`/post/${created.id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="status-text">불러오는 중...</p>;

  return (
    <section className="page page-narrow">
      <h1>{isEdit ? "게시글 수정" : `${categoryInfo?.label ?? category} 글쓰기`}</h1>

      <form className="post-form" onSubmit={handleSubmit}>
        <label>
          제목
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>

        <label>
          내용
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            required
          />
        </label>

        {!isEdit && category === "study" && (
          <label>
            모집 인원
            <input
              type="number"
              min="1"
              value={recruitCount}
              onChange={(e) => setRecruitCount(e.target.value)}
            />
          </label>
        )}

        {!isEdit && category === "job" && (
          <label>
            마감일
            <input type="date" value={jobDeadline} onChange={(e) => setJobDeadline(e.target.value)} />
          </label>
        )}

        {error && <p className="status-text error">{error}</p>}

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
            취소
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </section>
  );
}
