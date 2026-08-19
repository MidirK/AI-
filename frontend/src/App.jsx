import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import RequireAuth from "./components/RequireAuth";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PostListPage from "./pages/PostListPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostWritePage from "./pages/PostWritePage";
import MyPage from "./pages/MyPage";
import CareerAnalysisPage from "./pages/CareerAnalysisPage";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/posts/:category" element={<PostListPage />} />
          <Route
            path="/posts/:category/write"
            element={
              <RequireAuth>
                <PostWritePage />
              </RequireAuth>
            }
          />
          <Route path="/post/:postId" element={<PostDetailPage />} />
          <Route
            path="/post/:postId/edit"
            element={
              <RequireAuth>
                <PostWritePage />
              </RequireAuth>
            }
          />
          <Route
            path="/career"
            element={
              <RequireAuth>
                <CareerAnalysisPage />
              </RequireAuth>
            }
          />
          <Route
            path="/mypage"
            element={
              <RequireAuth>
                <MyPage />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
