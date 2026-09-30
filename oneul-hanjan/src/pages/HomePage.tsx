import { Link } from 'react-router-dom';
import { spiritCategories } from '../data/spirits';
import { getSnack } from '../data/snacks';
import { getFeaturedCombos } from '../lib/recommend';
import SpiritCard from '../components/SpiritCard';
import ComboCard from '../components/ComboCard';

export default function HomePage() {
  const featured = getFeaturedCombos(4);

  return (
    <div className="space-y-14">
      <section className="text-center max-w-2xl mx-auto space-y-5">
        <p className="text-bar-amber text-sm tracking-widest uppercase">Oneul Hanjan</p>
        <h1 className="font-display text-3xl sm:text-4xl text-bar-ivory leading-snug">
          오늘 밤, 어떤 한 잔을 즐길까요?
        </h1>
        <p className="text-bar-ivorydim leading-relaxed">
          위스키, 브랜디, 럼, 진, 보드카. 이름은 익숙해도 무엇을 골라야 할지 막막할 수 있어요. 오늘
          한잔은 취향과 상황에 맞춰 술과 안주를 천천히 골라볼 수 있도록 도와주는 안내서예요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/pick-drink"
            className="px-6 py-3 rounded-full bg-bar-amber text-bar-bg font-medium hover:bg-bar-amber/90 transition-colors"
          >
            술부터 고르기
          </Link>
          <Link
            to="/pick-snack"
            className="px-6 py-3 rounded-full border border-bar-amber/50 text-bar-amber hover:bg-bar-amber/10 transition-colors"
          >
            안주부터 고르기
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-xl text-bar-ivory">양주 5종 살펴보기</h2>
          <span className="text-xs text-bar-ivorydim">카드를 눌러 자세히 볼 수 있어요</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {spiritCategories.map((c) => (
            <SpiritCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-xl text-bar-ivory">오늘의 추천 조합</h2>
          <span className="text-xs text-bar-ivorydim">데이터에서 특히 잘 맞는 조합만 골랐어요</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featured.map((p) => {
            const category = spiritCategories.find((c) => c.id === p.categoryId);
            const snack = getSnack(p.snackId);
            if (!category || !snack) return null;
            return <ComboCard key={p.id} category={category} snack={snack} pairing={p} />;
          })}
        </div>
      </section>
    </div>
  );
}
