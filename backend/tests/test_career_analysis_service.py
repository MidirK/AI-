"""app/services/career_analysis.py 순수 함수 단위 테스트."""

from app.schemas.career import CareerAnalyzeRequest
from app.services.career_analysis import analyze


def _profile(**overrides):
    defaults = dict(
        grade=3,
        gpa=3.5,
        certificates=[],
        language_score_text=None,
        project_count=0,
        competition_count=0,
        has_intern_experience=False,
        github_url=None,
    )
    defaults.update(overrides)
    return CareerAnalyzeRequest(**defaults)


def test_empty_profile_scores_low_and_lists_all_weak_areas():
    result = analyze(_profile(gpa=0))

    assert result["readiness_score"] < 40
    assert result["readiness_level"] == "준비 필요"
    assert "자격증" in result["weak_areas"]
    assert "어학 성적" in result["weak_areas"]
    assert "프로젝트 경험" in result["weak_areas"]


def test_strong_profile_scores_high_and_has_no_weak_areas():
    result = analyze(
        _profile(
            gpa=4.3,
            certificates=["정보처리기사", "SQLD", "리눅스마스터"],
            language_score_text="토익 900",
            project_count=4,
            competition_count=2,
            has_intern_experience=True,
            github_url="https://github.com/example",
        )
    )

    assert result["readiness_score"] >= 80
    assert result["readiness_level"] == "우수"
    assert result["weak_areas"] == []


def test_readiness_score_is_capped_at_100():
    result = analyze(
        _profile(
            gpa=4.5,
            certificates=["a", "b", "c", "d", "e"],
            language_score_text="토익 990",
            project_count=10,
            competition_count=10,
            has_intern_experience=True,
            github_url="https://github.com/example",
        )
    )
    assert result["readiness_score"] == 100


def test_recommended_certificates_exclude_already_held():
    result = analyze(_profile(certificates=["정보처리기사"]))

    assert "정보처리기사" not in result["recommended_certificates"]
    assert len(result["recommended_certificates"]) <= 3


def test_recommended_learning_areas_matches_weak_areas():
    result = analyze(_profile(language_score_text=None, has_intern_experience=False))

    assert "어학 성적 준비 (토익/토스 등)" in result["recommended_learning_areas"]
    assert "인턴·현장실습 지원" in result["recommended_learning_areas"]
