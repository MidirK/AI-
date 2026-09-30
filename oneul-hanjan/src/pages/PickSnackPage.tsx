import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSpiritCategory } from '../data/spirits';
import { getSnack } from '../data/snacks';
import { recommendSpiritsForSnack, searchSnacks } from '../lib/recommend';
import { getFeedbackMap } from '../lib/storage';
import SnackCard, { categoryLabels } from '../components/SnackCard';
import TagPill from '../components/TagPill';
import EmptyState from '../components/EmptyState';

const categoryOrder = ['cheese', 'meat', 'seafood', 'fruit', 'chocolate', 'nuts', 'etc'];

export default function PickSnackPage() {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [selectedSnackId, setSelectedSnackId] = useState<string | null>(null);
  const [feedback] = useState(() => getFeedbackMap());

  const results = useMemo(() => searchSnacks(query, categoryId), [query, categoryId]);
  const selectedSnack = selectedSnackId ? getSnack(selectedSnackId) : undefined;
  const spiritResults = selectedSnackId ? recommendSpiritsForSnack(selectedSnackId, feedback) : [];

  function clearFilters() {
    setQuery('');
    setCategoryId(null);
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-bar-amber text-sm tracking-widest uppercase mb-2">안주부터 고르기</p>
        <h1 className="font-display text-xl text-bar-ivory">어떤 안주가 먹고 싶으세요?</h1>
      </div>

      <div className="space-y-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="안주 이름으로 검색해보세요 (예: 치즈, 연어, 초콜릿)"
          className="w-full bar-card rounded-full px-5 py-3 text-sm text-bar-ivory placeholder:text-bar-ivorydim/50 outline-none focus:border-bar-amber/50"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoryId(null)}
            className={[
              'px-4 py-2 rounded-full text-sm border transition-colors',
              categoryId === null
                ? 'border-bar-amber/60 bg-bar-amber/10 text-bar-amber'
                : 'border-bar-border text-bar-ivorydim hover:text-bar-ivory',
            ].join(' ')}
          >
            전체
          </button>
          {categoryOrder.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoryId(c)}
              className={[
                'px-4 py-2 rounded-full text-sm border transition-colors',
                categoryId === c
                  ? 'border-bar-amber/60 bg-bar-amber/10 text-bar-amber'
                  : 'border-bar-border text-bar-ivorydim hover:text-bar-ivory',
              ].join(' ')}
            >
              {categoryLabels[c]}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState
          title="조건에 맞는 안주를 찾지 못했어요"
          description="검색어나 카테고리를 바꿔서 다시 찾아볼까요?"
          action={{ label: '검색 조건 초기화', onClick: clearFilters }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {results.map((s) => (
            <SnackCard key={s.id} snack={s} selected={s.id === selectedSnackId} onSelect={() => setSelectedSnackId(s.id)} />
          ))}
        </div>
      )}

      {selectedSnack && (
        <section className="space-y-4 border-t border-bar-border pt-6">
          <h2 className="font-display text-xl text-bar-ivory">
            {selectedSnack.name}에 어울리는 양주
          </h2>
          {spiritResults.length === 0 ? (
            <p className="text-sm text-bar-ivorydim">아직 이 안주에 등록된 페어링 데이터가 없어요.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {spiritResults.map((r) => {
                const category = getSpiritCategory(r.categoryId);
                if (!category) return null;
                return (
                  <Link
                    key={r.pairing.id}
                    to={`/combo/${category.id}/${selectedSnack.id}`}
                    className="bar-card rounded-2xl p-5 flex flex-col gap-2 hover:border-bar-amber/50 transition-colors"
                  >
                    <span className="font-display text-base text-bar-amber">{category.name}</span>
                    <p className="text-sm text-bar-ivorydim leading-relaxed">{r.pairing.reason}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {r.pairing.tasteTags?.map((t) => <TagPill key={t}>{t}</TagPill>)}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
