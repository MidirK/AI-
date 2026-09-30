import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getSpiritCategory } from '../data/spirits';
import { getSnack } from '../data/snacks';
import { getPairing, getPairingsForSnack } from '../data/pairings';
import { getFeedbackMap, isComboSaved, setFeedback, toggleSavedCombo } from '../lib/storage';
import TagPill from '../components/TagPill';
import EmptyState from '../components/EmptyState';
import type { FeedbackValue } from '../types';

export default function ComboDetailPage() {
  const { categoryId, snackId } = useParams();
  const navigate = useNavigate();

  const category = categoryId ? getSpiritCategory(categoryId) : undefined;
  const snack = snackId ? getSnack(snackId) : undefined;
  const pairing = categoryId && snackId ? getPairing(categoryId, snackId) : undefined;

  const [saved, setSaved] = useState(
    categoryId && snackId ? isComboSaved(categoryId, snackId) : false,
  );
  const [feedbackMap, setFeedbackMap] = useState(getFeedbackMap());

  const alternativeCategories = useMemo(() => {
    if (!snackId || !categoryId) return [];
    return getPairingsForSnack(snackId)
      .filter((p) => p.categoryId !== categoryId)
      .map((p) => getSpiritCategory(p.categoryId))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
  }, [snackId, categoryId]);

  if (!category || !snack || !pairing) {
    return (
      <EmptyState
        title="조합 정보를 찾을 수 없어요"
        description="아직 데이터에 등록되지 않은 조합일 수 있어요. 홈에서 다른 조합을 골라주세요."
        action={{ label: '홈으로 가기', onClick: () => navigate('/') }}
      />
    );
  }

  function handleToggleSave() {
    toggleSavedCombo(category!.id, snack!.id);
    setSaved(isComboSaved(category!.id, snack!.id));
  }

  function handleFeedback(value: FeedbackValue) {
    const next = setFeedback(pairing!.id, value);
    setFeedbackMap(next);
  }

  const currentFeedback = feedbackMap[pairing.id];

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="space-y-2">
        <p className="text-bar-amber text-sm tracking-widest uppercase">
          {category.name} · {snack.name}
        </p>
        <h1 className="font-display text-2xl text-bar-ivory">이 조합이 잘 맞는 이유</h1>
        <p className="text-bar-ivorydim leading-relaxed">{pairing.reason}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {pairing.tasteTags?.map((t) => (
            <TagPill key={t} tone="amber">
              {t}
            </TagPill>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bar-card rounded-2xl p-5 space-y-2">
          <p className="text-xs text-bar-ivorydim/60 uppercase tracking-wide">술</p>
          <Link to={`/spirits/${category.id}`} className="font-display text-lg text-bar-amber hover:underline">
            {category.name}
          </Link>
          <p className="text-sm text-bar-ivorydim leading-relaxed">{category.shortIntro}</p>
        </div>
        <div className="bar-card rounded-2xl p-5 space-y-2">
          <p className="text-xs text-bar-ivorydim/60 uppercase tracking-wide">안주</p>
          <p className="font-display text-lg text-bar-ivory">{snack.name}</p>
          <p className="text-sm text-bar-ivorydim leading-relaxed">{snack.shortDescription}</p>
          <p className="text-xs text-bar-ivorydim/70 pt-1">예상 비용 약 {snack.estimatedWon.toLocaleString()}원 (예시)</p>
        </div>
      </div>

      {snack.ingredients && snack.steps && (
        <section className="bar-card rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-bar-ivory">재료와 만드는 순서</h2>
            <TagPill>약 {snack.cookTimeMinutes}분</TagPill>
          </div>
          <div>
            <p className="text-sm text-bar-ivorydim/60 mb-1">재료 (분량은 예시예요)</p>
            <ul className="text-sm text-bar-ivorydim grid sm:grid-cols-2 gap-x-4">
              {snack.ingredients.map((ing) => (
                <li key={ing.name} className="flex justify-between border-b border-bar-border/60 py-1">
                  <span>{ing.name}</span>
                  <span className="text-bar-ivorydim/70">{ing.amount}</span>
                </li>
              ))}
            </ul>
          </div>
          <ol className="text-sm text-bar-ivorydim space-y-1 list-decimal list-inside">
            {snack.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {snack.platingSteps && (
        <section className="bar-card rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-bar-ivory">준비·플레이팅 방법</h2>
            <TagPill>약 {snack.cookTimeMinutes}분</TagPill>
          </div>
          <p className="text-xs text-bar-ivorydim/70">간편식이라 조리 없이 담기만 하면 돼요.</p>
          <ol className="text-sm text-bar-ivorydim space-y-1 list-decimal list-inside">
            {snack.platingSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      <section className="bar-card rounded-2xl p-5 space-y-3">
        <h2 className="font-display text-lg text-bar-ivory">이렇게 즐겨보세요</h2>
        <ul className="text-sm text-bar-ivorydim space-y-2">
          <li>
            <span className="text-bar-ivorydim/60">권장 온도 ·</span> {snack.servingTip.temp}
          </li>
          <li>
            <span className="text-bar-ivorydim/60">한입 크기 ·</span> {snack.servingTip.biteSize}
          </li>
          {snack.servingTip.pairedExtra && (
            <li>
              <span className="text-bar-ivorydim/60">곁들이면 좋은 것 ·</span> {snack.servingTip.pairedExtra}
            </li>
          )}
          <li>
            <span className="text-bar-ivorydim/60">비교해서 즐기는 팁 ·</span> {pairing.tastingTip}
          </li>
        </ul>
      </section>

      {(alternativeCategories.length > 0 || snack.alternativeSnackIds?.length) && (
        <section className="space-y-2">
          <h2 className="font-display text-lg text-bar-ivory">대체할 수 있어요</h2>
          <div className="flex flex-wrap gap-2">
            {alternativeCategories.map((c) => (
              <Link key={c.id} to={`/combo/${c.id}/${snack.id}`}>
                <TagPill tone="amber">{c.name}로 바꿔보기</TagPill>
              </Link>
            ))}
            {snack.alternativeSnackIds?.map((id) => {
              const alt = getSnack(id);
              if (!alt) return null;
              return (
                <Link key={id} to={`/combo/${category.id}/${alt.id}`}>
                  <TagPill>{alt.name}로 바꿔보기</TagPill>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleToggleSave}
          className={[
            'px-5 py-2.5 rounded-full text-sm font-medium border transition-colors',
            saved
              ? 'bg-bar-amber/15 text-bar-amber border-bar-amber/40'
              : 'bg-bar-amber text-bar-bg border-transparent hover:bg-bar-amber/90',
          ].join(' ')}
        >
          {saved ? '저장됨 · 해제하기' : '이 조합 저장하기'}
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleFeedback('like')}
            className={[
              'px-4 py-2.5 rounded-full text-sm border transition-colors',
              currentFeedback === 'like'
                ? 'border-bar-amber/60 bg-bar-amber/10 text-bar-amber'
                : 'border-bar-border text-bar-ivorydim hover:text-bar-ivory',
            ].join(' ')}
          >
            좋아요
          </button>
          <button
            type="button"
            onClick={() => handleFeedback('dislike')}
            className={[
              'px-4 py-2.5 rounded-full text-sm border transition-colors',
              currentFeedback === 'dislike'
                ? 'border-bar-burgundy/60 bg-bar-burgundy/15 text-[#e6b8bd]'
                : 'border-bar-border text-bar-ivorydim hover:text-bar-ivory',
            ].join(' ')}
          >
            별로예요
          </button>
        </div>
      </div>
      <p className="text-xs text-bar-ivorydim/50">
        좋아요·별로예요 피드백은 이 브라우저에만 저장되며, 이후 같은 조합의 추천 순위에 소폭
        반영돼요. (AI 학습이 아닌, 간단한 가산점 방식이에요)
      </p>
    </div>
  );
}
