"""AI 취업 준비도 분석 로직 (v1: 규칙 기반).

지금은 가중치 기반 점수 계산으로 동작한다. docs/기획안.md 6번 "향후 발전 방향"에 따라
추후 실제 LLM 호출로 교체될 수 있으므로, 순수 함수(analyze)로 분리해두었다 —
라우터는 이 함수의 입출력 형태만 알면 되고, 내부 구현(규칙 기반 vs LLM)은 자유롭게 바꿀 수 있다.
"""

from dataclasses import dataclass, field

from app.schemas.career import CareerAnalyzeRequest

# 점수 배점 (총 100점)
_GPA_MAX_POINTS = 25
_CERTIFICATE_MAX_POINTS = 15
_LANGUAGE_MAX_POINTS = 15
_PROJECT_MAX_POINTS = 20
_COMPETITION_MAX_POINTS = 10
_INTERN_MAX_POINTS = 10
_GITHUB_MAX_POINTS = 5

# 항목별 "이 정도면 만점" 기준
_GPA_FULL_SCORE_AT = 4.0
_CERTIFICATE_FULL_SCORE_AT = 3
_PROJECT_FULL_SCORE_AT = 3
_COMPETITION_FULL_SCORE_AT = 2

# AI정보공학과 취업 준비생에게 흔히 추천되는 자격증 후보군
_CERTIFICATE_POOL = [
    "정보처리기사",
    "SQLD (SQL 개발자)",
    "빅데이터분석기사",
    "리눅스마스터",
    "AWS Certified Cloud Practitioner",
]


@dataclass
class _ScoredItem:
    label: str
    points: float
    max_points: float
    is_weak: bool = field(init=False)

    def __post_init__(self):
        self.is_weak = self.points < self.max_points * 0.5


def analyze(profile: CareerAnalyzeRequest) -> dict:
    """입력 프로필을 받아 준비도 점수와 추천 항목을 계산한다."""

    items = [
        _ScoredItem("학점", min(profile.gpa / _GPA_FULL_SCORE_AT, 1) * _GPA_MAX_POINTS, _GPA_MAX_POINTS),
        _ScoredItem(
            "자격증",
            min(len(profile.certificates) / _CERTIFICATE_FULL_SCORE_AT, 1) * _CERTIFICATE_MAX_POINTS,
            _CERTIFICATE_MAX_POINTS,
        ),
        _ScoredItem(
            "어학 성적",
            _LANGUAGE_MAX_POINTS if profile.language_score_text else 0,
            _LANGUAGE_MAX_POINTS,
        ),
        _ScoredItem(
            "프로젝트 경험",
            min(profile.project_count / _PROJECT_FULL_SCORE_AT, 1) * _PROJECT_MAX_POINTS,
            _PROJECT_MAX_POINTS,
        ),
        _ScoredItem(
            "공모전 경험",
            min(profile.competition_count / _COMPETITION_FULL_SCORE_AT, 1) * _COMPETITION_MAX_POINTS,
            _COMPETITION_MAX_POINTS,
        ),
        _ScoredItem(
            "인턴 경험", _INTERN_MAX_POINTS if profile.has_intern_experience else 0, _INTERN_MAX_POINTS
        ),
        _ScoredItem("GitHub 활동", _GITHUB_MAX_POINTS if profile.github_url else 0, _GITHUB_MAX_POINTS),
    ]

    readiness_score = round(sum(item.points for item in items))
    readiness_level = _score_to_level(readiness_score)
    weak_areas = [item.label for item in items if item.is_weak]

    return {
        "readiness_score": readiness_score,
        "readiness_level": readiness_level,
        "weak_areas": weak_areas,
        "recommended_certificates": _recommend_certificates(profile.certificates),
        "recommended_projects": _recommend_projects(profile.project_count),
        "recommended_learning_areas": _recommend_learning_areas(weak_areas),
    }


def _score_to_level(score: int) -> str:
    if score >= 80:
        return "우수"
    if score >= 60:
        return "양호"
    if score >= 40:
        return "보통"
    return "준비 필요"


def _recommend_certificates(held: list[str], limit: int = 3) -> list[str]:
    held_lower = [c.lower() for c in held]
    candidates = [c for c in _CERTIFICATE_POOL if not any(h in c.lower() for h in held_lower)]
    return candidates[:limit]


def _recommend_projects(project_count: int) -> list[str]:
    if project_count == 0:
        return [
            "개인 포트폴리오 프로젝트 1개 이상 완성해보기",
            "학과 스터디/프로젝트 모집 게시판에서 팀 프로젝트 참여하기",
        ]
    if project_count < 3:
        return [
            "팀 프로젝트 경험 늘리기 (스터디 게시판 활용)",
            "완성한 프로젝트를 GitHub에 정리해 포트폴리오로 만들기",
        ]
    return ["기존 프로젝트를 더 심화된 형태로 확장하거나 실제로 배포까지 진행해보기"]


def _recommend_learning_areas(weak_areas: list[str]) -> list[str]:
    mapping = {
        "학점": "전공 기초 역량 다지기 (학점 관리)",
        "자격증": "직무 관련 자격증 취득",
        "어학 성적": "어학 성적 준비 (토익/토스 등)",
        "프로젝트 경험": "팀/개인 프로젝트 경험 쌓기",
        "공모전 경험": "공모전·해커톤 참가로 실전 경험 쌓기",
        "인턴 경험": "인턴·현장실습 지원",
        "GitHub 활동": "GitHub에 코드/프로젝트 꾸준히 기록하기",
    }
    return [mapping[area] for area in weak_areas if area in mapping]
