// AI 취업 준비도 분석 관련 API 호출 모음.

import { apiFetch } from "./client";

export function analyzeCareer(payload) {
  return apiFetch("/career/analyze", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchLatestCareerAnalysis() {
  return apiFetch("/career/analyze/latest");
}
