// AI 취업 준비도 분석 페이지.
// 학년/학점/자격증 등을 입력하면 규칙 기반 분석 결과(점수, 등급, 추천 항목)를 보여준다.

import { useEffect, useState } from "react";
import { analyzeCareer, fetchLatestCareerAnalysis } from "../api/career";

const INITIAL_FORM = {
  grade: "3",
  gpa: "",
  certificates: "",
  languageScoreText: "",
  projectCount: "0",
  competitionCount: "0",
  hasInternExperience: false,
  githubUrl: "",
};

export default function CareerAnalysisPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingLatest, setLoadingLatest] = useState(true);

  useEffect(() => {
    fetchLatestCareerAnalysis()
      .then(setResult)
      .catch(() => {
        // 이전 분석 이력이 없으면(404) 조용히 무시한다.
      })
      .finally(() => setLoadingLatest(false));
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        grade: Number(form.grade),
        gpa: Number(form.gpa),
        certificates: form.certificates
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        language_score_text: form.languageScoreText || null,
        project_count: Number(form.projectCount) || 0,
        competition_count: Number(form.competitionCount) || 0,
        has_intern_experience: form.hasInternExperience,
        github_url: form.githubUrl || null,
      };
      const analysis = await analyzeCareer(payload);
      setResult(analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page page-narrow">
      <h1>AI 취업 준비도 분석</h1>
      <p className="page-description">
        현재 상태를 입력하면 준비도 점수와 부족한 부분, 추천 항목을 알려드립니다.
      </p>

      <form className="post-form" onSubmit={handleSubmit}>
        <label>
          학년
          <select value={form.grade} onChange={(e) => updateField("grade", e.target.value)}>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
            <option value="4">4학년</option>
          </select>
        </label>

        <label>
          학점 (4.5 만점)
          <input
            type="number"
            step="0.01"
            min="0"
            max="4.5"
            value={form.gpa}
            onChange={(e) => updateField("gpa", e.target.value)}
            required
          />
        </label>

        <label>
          보유 자격증 (쉼표로 구분)
          <input
            value={form.certificates}
            onChange={(e) => updateField("certificates", e.target.value)}
            placeholder="예: 정보처리기사, SQLD"
          />
        </label>

        <label>
          어학 성적
          <input
            value={form.languageScoreText}
            onChange={(e) => updateField("languageScoreText", e.target.value)}
            placeholder="예: 토익 850"
          />
        </label>

        <label>
          프로젝트 경험 개수
          <input
            type="number"
            min="0"
            value={form.projectCount}
            onChange={(e) => updateField("projectCount", e.target.value)}
          />
        </label>

        <label>
          공모전 수상 개수
          <input
            type="number"
            min="0"
            value={form.competitionCount}
            onChange={(e) => updateField("competitionCount", e.target.value)}
          />
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={form.hasInternExperience}
            onChange={(e) => updateField("hasInternExperience", e.target.checked)}
          />
          인턴 경험이 있습니다
        </label>

        <label>
          GitHub 프로필 URL
          <input
            value={form.githubUrl}
            onChange={(e) => updateField("githubUrl", e.target.value)}
            placeholder="https://github.com/username"
          />
        </label>

        {error && <p className="status-text error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "분석 중..." : "분석하기"}
          </button>
        </div>
      </form>

      {loadingLatest && <p className="status-text">이전 분석 결과 불러오는 중...</p>}

      {result && (
        <div className="career-result">
          <h2>분석 결과</h2>
          <div className="career-score">
            <span className="career-score-number">{result.readiness_score}</span>
            <span className="career-score-label">/ 100 · {result.readiness_level}</span>
          </div>

          {result.weak_areas.length > 0 && (
            <div className="career-block">
              <h3>부족한 역량</h3>
              <div className="tag-row">
                {result.weak_areas.map((area) => (
                  <span key={area} className="tag tag-weak">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.recommended_certificates.length > 0 && (
            <div className="career-block">
              <h3>추천 자격증</h3>
              <ul className="simple-list">
                {result.recommended_certificates.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {result.recommended_projects.length > 0 && (
            <div className="career-block">
              <h3>추천 프로젝트</h3>
              <ul className="simple-list">
                {result.recommended_projects.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {result.recommended_learning_areas.length > 0 && (
            <div className="career-block">
              <h3>추천 학습 분야</h3>
              <ul className="simple-list">
                {result.recommended_learning_areas.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
