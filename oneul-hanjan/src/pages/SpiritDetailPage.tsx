import { Link, useNavigate, useParams } from 'react-router-dom';
import { getSpiritCategory } from '../data/spirits';
import TagPill from '../components/TagPill';
import EmptyState from '../components/EmptyState';

export default function SpiritDetailPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = categoryId ? getSpiritCategory(categoryId) : undefined;

  if (!category) {
    return (
      <EmptyState
        title="술 정보를 찾을 수 없어요"
        description="주소가 정확한지 확인하거나, 홈에서 다시 골라주세요."
        action={{ label: '홈으로 가기', onClick: () => navigate('/') }}
      />
    );
  }

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-xs text-bar-ivorydim uppercase tracking-widest">{category.englishName}</p>
        <h1 className="font-display text-3xl text-bar-ivory">{category.name}</h1>
        <p className="text-bar-ivorydim leading-relaxed max-w-2xl">{category.shortIntro}</p>
        <div className="grid sm:grid-cols-2 gap-3 max-w-2xl pt-2">
          <div className="bar-card rounded-xl p-4">
            <p className="text-xs text-bar-amber mb-1">대표적인 향</p>
            <p className="text-sm text-bar-ivorydim leading-relaxed">{category.aromaSummary}</p>
          </div>
          <div className="bar-card rounded-xl p-4">
            <p className="text-xs text-bar-amber mb-1">대표적인 맛</p>
            <p className="text-sm text-bar-ivorydim leading-relaxed">{category.tasteSummary}</p>
          </div>
        </div>
        <p className="text-sm text-bar-ivorydim/80 leading-relaxed max-w-2xl pt-1">
          {category.characteristicNote}
        </p>
        <Link
          to={`/pick-drink?category=${category.id}`}
          className="inline-flex mt-2 px-5 py-2.5 rounded-full bg-bar-amber text-bar-bg text-sm font-medium hover:bg-bar-amber/90 transition-colors"
        >
          이 술로 안주 추천 받기
        </Link>
      </div>

      <section>
        <h2 className="font-display text-xl text-bar-ivory mb-4">스타일별로 다른 향과 맛</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.variants.map((v) => (
            <div key={v.id} className="bar-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base text-bar-ivory">{v.name}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {v.flavorTags.map((t) => (
                  <TagPill key={t} tone="amber">
                    {t}
                  </TagPill>
                ))}
              </div>
              <p className="text-sm text-bar-ivorydim">
                <span className="text-bar-ivorydim/60">향</span> · {v.aroma}
              </p>
              <p className="text-sm text-bar-ivorydim">
                <span className="text-bar-ivorydim/60">맛</span> · {v.taste}
              </p>
              <p className="text-xs text-bar-ivorydim/70 pt-1">{v.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl text-bar-ivory mb-1">마시는 방법</h2>
        <p className="text-xs text-bar-ivorydim/70 mb-4">
          여기 소개된 방법 중 정답은 없어요. 편한 방법부터 하나씩 시도해보세요.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {category.drinkingMethods.map((m) => (
            <div key={m.id} className="bar-card rounded-2xl p-5 space-y-3">
              <div>
                <h3 className="font-display text-base text-bar-amber">{m.term}</h3>
                <p className="text-xs text-bar-ivorydim/70 mt-0.5">{m.termExplanation}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <TagPill>{m.glass}</TagPill>
                <TagPill>{m.useIce ? '얼음 사용' : '얼음 없이'}</TagPill>
                {m.ratioIsExample && <TagPill tone="burgundy">비율은 예시예요</TagPill>}
              </div>
              <ol className="text-sm text-bar-ivorydim space-y-1 list-decimal list-inside">
                {m.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              {m.note && <p className="text-xs text-bar-ivorydim/70 pt-1">{m.note}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
