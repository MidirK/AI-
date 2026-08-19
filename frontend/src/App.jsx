import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RequireAuth from "./components/RequireAuth";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import PostListPage from "./pages/PostListPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostWritePage from "./pages/PostWritePage";
import MyPage from "./pages/MyPage";
import CareerAnalysisPage from "./pages/CareerAnalysisPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
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
      </main>
      <Footer />
    </>
  );
}

export default App;
