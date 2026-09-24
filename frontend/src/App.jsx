import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RequireAuth from "./components/RequireAuth";
import HomePage from "./pages/HomePage";
import "./App.css";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const PostListPage = lazy(() => import("./pages/PostListPage"));
const PostDetailPage = lazy(() => import("./pages/PostDetailPage"));
const PostWritePage = lazy(() => import("./pages/PostWritePage"));
const MyPage = lazy(() => import("./pages/MyPage"));
const CareerAnalysisPage = lazy(() => import("./pages/CareerAnalysisPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));

function App() {
  return (
    <>
      <Header />
      <main className="site-main">
        <Suspense fallback={<p className="status-text">불러오는 중...</p>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
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
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;
