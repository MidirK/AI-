import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { spiritCategories, getSpiritCategory } from '../data/spirits';
import type { PrepType, SpiritCategoryId, TasteTag } from '../types';
import {
  BUDGET_OPTIONS,
  PREP_OPTIONS,
  TASTE_OPTIONS,
  TIME_OPTIONS,
  recommendSnacksForSpirit,
  type BudgetOption,
  type TimeOption,
} from '../lib/recommend';
import { getFeedbackMap } from '../lib/storage';
import ComboCard from '../components/ComboCard';
import EmptyState from '../components/EmptyState';

const steps = ['술 종류', '취향', '조건', '추천 결과'];

export default function PickDrinkPage() {
  const [params] = useSearchParams();
  const initialCategory = params.get('category') as SpiritCategoryId | null;
  const validInitial = initialCategory && getSpiritCategory(initialCategory) ? initialCategory : null;

  const [step, setStep] = useState(validInitial ? 2 : 1);
  const [categoryId, setCategoryId] = useState<SpiritCategoryId | null>(validInitial);
  const [taste, setTaste] = useState<TasteTag | null>(null);
  const [budgetId, setBudgetId] = useState<BudgetOption['id'] | null>(null);
  const [timeId, setTimeId] = useState<TimeOption['id'] | null>(null);
  const [prep, setPrep] = useState<PrepType | null>(null);
  const [feedback] = useState(() => getFeedbackMap());

  const category = categoryId ? getSpiritCategory(categoryId) : undefined;

  const result = useMemo(() => {
    if (step !== 4 || !categoryId || !taste || !budgetId || !timeId || !prep) return null;
    return recommendSnacksForSpirit({ categoryId, taste, budgetId, timeId, prep, feedback });
  }, [step, categoryId, taste, budgetId, timeId, prep, feedback]);

  function resetAll() {
    setStep(1);
    setCategoryId(null);
    setTaste(null);
    setBudgetId(null);
    setTimeId(null);
    setPrep(null);
  }

  function relaxConditions() {
    setBudgetId(BUDGET_OPTIONS[BUDGET_OPTIONS.length - 1].id);
    setTimeId(TIME_OPTIONS[TIME_OPTIONS.length - 1].id);
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <p className="text-bar-amber text-sm tracking-widest uppercase mb-2">술부터 고르기</p>
        <div className="flex items-center gap-2 text-xs text-bar-ivorydim">
          {steps.map((label, i) => (
            <span
              key={label}
              className={[
                'px-2.5 py-1 rounded-full border',
                step === i + 1
                  ? 'border-bar-amber/50 text-bar-amber bg-bar-amber/10'
                  : 'border-bar-border text-bar-ivorydim/60',
              ].join(' ')}
            >
              {i + 1}. {label}
            </span>
          ))}
        </div>
      </div>

      {step === 1 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl text-bar-ivory">어떤 술로 시작할까요?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {spiritCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoryId(c.id)}
                className={[
                  'bar-card rounded-2xl p-4 text-left transition-colors',
                  categoryId === c.id ? 'border-bar-amber/60 bg-bar-amber/5' : 'hover:border-bar-amber/40',
                ].join(' ')}
              >
                <p className="font-display text-base text-bar-ivory">{c.name}</p>
                <p className="text-sm text-bar-ivorydim mt-1">{c.shortIntro}</p>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              disabled={!categoryId}
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-full bg-bar-amber text-bar-bg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-bar-amber/90 transition-colors"
            >
              다음
            </button>
          </div>
        </section>
      )}

      {step === 2 && category && (
        <section className="space-y-4">
          <h2 className="font-display text-xl text-bar-ivory">{category.name}, 어떤 느낌이 좋으세요?</h2>
          <div className="bar-card rounded-2xl p-4 text-sm text-bar-ivorydim leading-relaxed">
            {category.aromaSummary} {category.tasteSummary}
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {TASTE_OPTIONS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTaste(t.id)}
                className={[
                  'bar-card rounded-2xl p-4 text-left transition-colors',
                  taste === t.id ? 'border-bar-amber/60 bg-bar-amber/5' : 'hover:border-bar-amber/40',
                ].join(' ')}
              >
                <p className="font-display text-base text-bar-ivory">{t.label}</p>
                <p className="text-xs text-bar-ivorydim mt-1">{t.helper}</p>
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-full border border-bar-border text-bar-ivorydim text-sm hover:text-bar-ivory transition-colors"
            >
              이전
            </button>
            <button
              type="button"
              disabled={!taste}
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-full bg-bar-amber text-bar-bg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-bar-amber/90 transition-colors"
            >
              다음
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-6">
          <h2 className="font-display text-xl text-bar-ivory">안주 조건을 알려주세요</h2>

          <div>
            <p className="text-sm text-bar-ivorydim mb-2">안주 예산</p>
            <div className="flex flex-wrap gap-2">
              {BUDGET_OPTIONS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBudgetId(b.id)}
                  className={[
                    'px-4 py-2 rounded-full text-sm border transition-colors',
                    budgetId === b.id
                      ? 'border-bar-amber/60 bg-bar-amber/10 text-bar-amber'
                      : 'border-bar-border text-bar-ivorydim hover:text-bar-ivory',
                  ].join(' ')}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-bar-ivorydim mb-2">조리 시간</p>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTimeId(t.id)}
                  className={[
                    'px-4 py-2 rounded-full text-sm border transition-colors',
                    timeId === t.id
                      ? 'border-bar-amber/60 bg-bar-amber/10 text-bar-amber'
                      : 'border-bar-border text-bar-ivorydim hover:text-bar-ivory',
                  ].join(' ')}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-bar-ivorydim mb-2">조리 방식</p>
            <div className="flex flex-wrap gap-2">
              {PREP_OPTIONS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPrep(p.id)}
                  className={[
                    'px-4 py-2 rounded-full text-sm border transition-colors',
                    prep === p.id
                      ? 'border-bar-amber/60 bg-bar-amber/10 text-bar-amber'
                      : 'border-bar-border text-bar-ivorydim hover:text-bar-ivory',
                  ].join(' ')}
                  title={p.helper}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-full border border-bar-border text-bar-ivorydim text-sm hover:text-bar-ivory transition-colors"
            >
              이전
            </button>
            <button
              type="button"
              disabled={!budgetId || !timeId || !prep}
              onClick={() => setStep(4)}
              className="px-5 py-2.5 rounded-full bg-bar-amber text-bar-bg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-bar-amber/90 transition-colors"
            >
              안주 추천받기
            </button>
          </div>
        </section>
      )}

      {step === 4 && category && result && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-bar-ivory">
              {category.name} · {taste}에 어울리는 안주
            </h2>
            <button
              type="button"
              onClick={resetAll}
              className="text-xs text-bar-ivorydim hover:text-bar-amber transition-colors"
            >
              조건 다시 설정하기
            </button>
          </div>

          {result.strict.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {result.strict.map((r, i) => (
                <ComboCard key={r.pairing.id} category={category} snack={r.snack} pairing={r.pairing} rank={i + 1} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="조건에 맞는 안주를 찾지 못했어요"
              description="예산이나 조리 시간 조건이 너무 좁을 수 있어요. 조건을 완화해서 다시 찾아볼까요?"
              action={{ label: '예산·시간 조건 완화하기', onClick: relaxConditions }}
            />
          )}

          {result.usedRelaxed && (
            <div className="space-y-3">
              <p className="text-sm text-bar-ivorydim">
                예산·조리 시간 조건을 완화하면 이런 안주는 어때요?
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {result.relaxed.map((r, i) => (
                  <ComboCard key={r.pairing.id} category={category} snack={r.snack} pairing={r.pairing} rank={i + 1} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
