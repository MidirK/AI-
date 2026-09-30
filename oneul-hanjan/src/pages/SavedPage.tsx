import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSpiritCategory } from '../data/spirits';
import { getSnack } from '../data/snacks';
import { getSavedCombos, removeCombo } from '../lib/storage';
import EmptyState from '../components/EmptyState';

export default function SavedPage() {
  const navigate = useNavigate();
  const [combos, setCombos] = useState(() => getSavedCombos());

  const rows = useMemo(
    () =>
      combos
        .map((c) => ({
          combo: c,
          category: getSpiritCategory(c.categoryId),
          snack: getSnack(c.snackId),
        }))
        .filter((r) => r.category && r.snack)
        .sort((a, b) => b.combo.savedAt - a.combo.savedAt),
    [combos],
  );

  function handleRemove(comboId: string) {
    setCombos(removeCombo(comboId));
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <p className="text-bar-amber text-sm tracking-widest uppercase mb-2">저장한 조합</p>
        <h1 className="font-display text-xl text-bar-ivory">내가 저장한 술·안주 조합</h1>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="아직 저장한 조합이 없어요"
          description="마음에 드는 조합을 발견하면 상세 화면에서 저장해보세요. 새로고침해도 계속 남아있어요."
          action={{ label: '추천받으러 가기', onClick: () => navigate('/pick-drink') }}
        />
      ) : (
        <div className="space-y-3">
          {rows.map(({ combo, category, snack }) => (
            <div key={combo.comboId} className="bar-card rounded-2xl p-4 flex items-center justify-between gap-4">
              <Link to={`/combo/${category!.id}/${snack!.id}`} className="flex-1 min-w-0">
                <p className="font-display text-base text-bar-ivory truncate">
                  {category!.name} · {snack!.name}
                </p>
                <p className="text-xs text-bar-ivorydim/70 mt-0.5">
                  {new Date(combo.savedAt).toLocaleDateString('ko-KR')}에 저장
                </p>
              </Link>
              <button
                type="button"
                onClick={() => handleRemove(combo.comboId)}
                className="text-xs px-3 py-1.5 rounded-full border border-bar-border text-bar-ivorydim hover:text-bar-burgundy hover:border-bar-burgundy/50 transition-colors shrink-0"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
