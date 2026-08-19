// 카테고리별 게시글 목록 페이지. 공지/자유/스터디/취업/선후배 게시판이 이 컴포넌트 하나를 공유한다.

import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchPosts, POST_CATEGORIES } from "../api/posts";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 10;

export default function PostListPage() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");

  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const categoryInfo = POST_CATEGORIES.find((item) => item.value === category);
  // notice(공지사항) 글쓰기는 관리자만 허용 (docs/api-spec.md 2번 참고).
  const canWrite = category !== "notice" || user?.role === "admin";

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");

    fetchPosts({ category, page, size: PAGE_SIZE })
      .then((result) => {
        if (!ignore) setData(result);
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
  }, [category, page]);

  function goToPage(nextPage) {
    setSearchParams({ page: String(nextPage) });
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.size)) : 1;

  return (
    <section className="page">
      <div className="page-header">
        <h1>{categoryInfo?.label ?? category}</h1>
        {user && canWrite && (
          <Link to={`/posts/${category}/write`} className="btn btn-primary">
            글쓰기
          </Link>
        )}
      </div>

      {loading && <p className="status-text">불러오는 중...</p>}
      {error && <p className="status-text error">{error}</p>}

      {data && (
        <>
          <table className="post-table">
            <thead>
              <tr>
                <th className="col-title">제목</th>
                <th>작성자</th>
                <th>조회수</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              {data.items.length === 0 && (
                <tr>
                  <td colSpan={4} className="status-text">
                    게시글이 없습니다.
                  </td>
                </tr>
              )}
              {data.items.map((post) => (
                <tr key={post.id}>
                  <td className="col-title">
                    <Link to={`/post/${post.id}`}>{post.title}</Link>
                  </td>
                  <td>{post.nickname}</td>
                  <td>{post.view_count}</td>
                  <td>{formatDate(post.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button type="button" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
              이전
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button type="button" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
              다음
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
