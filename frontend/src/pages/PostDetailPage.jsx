// 게시글 상세 페이지. 댓글 목록/작성/삭제와 스터디 모집 상태 변경을 함께 다룬다.

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deletePost, fetchPost, POST_CATEGORIES, updateStudyStatus } from "../api/posts";
import { createComment, deleteComment, fetchComments } from "../api/comments";
import { useAuth } from "../context/AuthContext";

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    Promise.all([fetchPost(postId), fetchComments(postId)])
      .then(([postData, commentData]) => {
        if (ignore) return;
        setPost(postData);
        setComments(commentData);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [postId]);

  async function handleDeletePost() {
    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;
    try {
      await deletePost(postId);
      navigate(`/posts/${post.category}`);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleStudyStatusToggle() {
    const nextStatus = post.study_info.status === "모집중" ? "모집완료" : "모집중";
    try {
      await updateStudyStatus(postId, nextStatus);
      setPost({ ...post, study_info: { ...post.study_info, status: nextStatus } });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const created = await createComment(postId, newComment);
      setComments([...comments, created]);
      setNewComment("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCommentDelete(commentId) {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await deleteComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="status-text">불러오는 중...</p>;
  if (error && !post) return <p className="status-text error">{error}</p>;
  if (!post) return null;

  const categoryLabel = POST_CATEGORIES.find((c) => c.value === post.category)?.label ?? post.category;

  return (
    <section className="page page-narrow">
      <Link to={`/posts/${post.category}`} className="breadcrumb">
        ← {categoryLabel}
      </Link>

      <div className="post-detail-header">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>{post.nickname}</span>
          <span>{new Date(post.created_at).toLocaleString("ko-KR")}</span>
          <span>조회 {post.view_count}</span>
        </div>
      </div>

      {post.study_info && (
        <div className="study-info">
          <span className={`badge ${post.study_info.status === "모집중" ? "badge-open" : "badge-closed"}`}>
            {post.study_info.status}
          </span>
          <span>
            모집 인원 {post.study_info.current_count}/{post.study_info.recruit_count}
          </span>
          {post.is_mine && (
            <button type="button" className="btn btn-ghost" onClick={handleStudyStatusToggle}>
              {post.study_info.status === "모집중" ? "모집완료로 변경" : "모집중으로 변경"}
            </button>
          )}
        </div>
      )}

      {post.job_info?.deadline && (
        <p className="job-deadline">마감일: {new Date(post.job_info.deadline).toLocaleDateString("ko-KR")}</p>
      )}

      <div className="post-content">{post.content}</div>

      {post.is_mine && (
        <div className="form-actions">
          <Link to={`/post/${postId}/edit`} className="btn btn-ghost">
            수정
          </Link>
          <button type="button" className="btn btn-ghost" onClick={handleDeletePost}>
            삭제
          </button>
        </div>
      )}

      {error && <p className="status-text error">{error}</p>}

      <div className="comments">
        <h2>댓글 {comments.length}</h2>

        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <div className="comment-body">
                <span className="comment-author">{comment.nickname}</span>
                <p>{comment.content}</p>
                <span className="comment-date">{new Date(comment.created_at).toLocaleString("ko-KR")}</span>
              </div>
              {comment.is_mine && (
                <button type="button" className="btn-text" onClick={() => handleCommentDelete(comment.id)}>
                  삭제
                </button>
              )}
            </li>
          ))}
        </ul>

        {user ? (
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요"
            />
            <button type="submit" className="btn btn-primary">
              등록
            </button>
          </form>
        ) : (
          <p className="status-text">댓글을 작성하려면 로그인이 필요합니다.</p>
        )}
      </div>
    </section>
  );
}
