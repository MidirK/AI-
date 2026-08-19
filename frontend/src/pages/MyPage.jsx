// 마이페이지: 내 정보, 내가 쓴 글, 내가 쓴 댓글을 보여준다.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchMyComments, fetchMyPosts, updateMe } from "../api/users";
import { POST_CATEGORIES } from "../api/posts";

export default function MyPage() {
  const { user, refreshMe } = useAuth();
  const [nickname, setNickname] = useState(user?.nickname ?? "");
  const [savingNickname, setSavingNickname] = useState(false);
  const [message, setMessage] = useState("");

  const [myPosts, setMyPosts] = useState(null);
  const [myComments, setMyComments] = useState(null);

  useEffect(() => {
    fetchMyPosts({}).then(setMyPosts);
    fetchMyComments().then(setMyComments);
  }, []);

  async function handleNicknameSave(e) {
    e.preventDefault();
    setSavingNickname(true);
    setMessage("");
    try {
      await updateMe({ nickname });
      await refreshMe();
      setMessage("닉네임이 변경되었습니다.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSavingNickname(false);
    }
  }

  if (!user) return null;

  return (
    <section className="page page-narrow">
      <h1>마이페이지</h1>

      <div className="mypage-info">
        <p>이메일: {user.email}</p>
        <p>학번: {user.student_id}</p>
        <form className="inline-form" onSubmit={handleNicknameSave}>
          <label>
            닉네임
            <input value={nickname} onChange={(e) => setNickname(e.target.value)} required />
          </label>
          <button type="submit" className="btn btn-primary" disabled={savingNickname}>
            {savingNickname ? "저장 중..." : "저장"}
          </button>
        </form>
        {message && <p className="status-text">{message}</p>}
      </div>

      <div className="mypage-section">
        <h2>내가 쓴 글</h2>
        {!myPosts && <p className="status-text">불러오는 중...</p>}
        {myPosts && myPosts.items.length === 0 && <p className="status-text">작성한 글이 없습니다.</p>}
        <ul className="simple-list">
          {myPosts?.items.map((post) => (
            <li key={post.id}>
              <span className="category-tag">
                {POST_CATEGORIES.find((c) => c.value === post.category)?.label ?? post.category}
              </span>
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mypage-section">
        <h2>내가 쓴 댓글</h2>
        {!myComments && <p className="status-text">불러오는 중...</p>}
        {myComments && myComments.length === 0 && <p className="status-text">작성한 댓글이 없습니다.</p>}
        <ul className="simple-list">
          {myComments?.map((comment) => <li key={comment.id}>{comment.content}</li>)}
        </ul>
      </div>
    </section>
  );
}
