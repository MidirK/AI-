"""AI 취업 준비도 분석 라우터."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.base import get_db
from app.models.career import CareerAnalysis
from app.models.user import User
from app.schemas.career import CareerAnalyzeRequest, CareerAnalysisResult
from app.services.career_analysis import analyze

router = APIRouter(prefix="/career", tags=["career"])


@router.post("/analyze", response_model=CareerAnalysisResult, status_code=status.HTTP_201_CREATED)
def analyze_career(
    payload: CareerAnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = analyze(payload)

    analysis = CareerAnalysis(
        user_id=current_user.id,
        grade=payload.grade,
        gpa=payload.gpa,
        certificates=payload.certificates,
        language_score_text=payload.language_score_text,
        project_count=payload.project_count,
        competition_count=payload.competition_count,
        has_intern_experience=payload.has_intern_experience,
        github_url=payload.github_url,
        **result,
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis


@router.get("/analyze/latest", response_model=CareerAnalysisResult)
def get_latest_analysis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # created_at은 초 단위 정밀도라 짧은 시간에 여러 번 제출하면 값이 같을 수 있으므로
    # id를 2차 정렬 기준으로 사용해 항상 가장 최근 제출을 가져온다.
    analysis = (
        db.query(CareerAnalysis)
        .filter(CareerAnalysis.user_id == current_user.id)
        .order_by(CareerAnalysis.created_at.desc(), CareerAnalysis.id.desc())
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="분석 이력이 없습니다.")
    return analysis
