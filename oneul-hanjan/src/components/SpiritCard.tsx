import { Link } from 'react-router-dom';
import type { SpiritCategory } from '../types';

export default function SpiritCard({ category }: { category: SpiritCategory }) {
  return (
    <Link
      to={`/spirits/${category.id}`}
      className="bar-card rounded-2xl p-5 flex flex-col gap-3 hover:border-bar-amber/50 transition-colors group"
    >
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-full bg-bar-amber/10 border border-bar-amber/30 flex items-center justify-center font-display text-bar-amber text-lg">
          {category.name[0]}
        </div>
        <span className="text-[11px] uppercase tracking-wider text-bar-ivorydim/60">
          {category.englishName}
        </span>
      </div>
      <div>
        <h3 className="font-display text-lg text-bar-ivory group-hover:text-bar-amber transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-bar-ivorydim mt-1 leading-relaxed">{category.shortIntro}</p>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
        {category.variants.map((v) => (
          <span
            key={v.id}
            className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-bar-ivorydim border border-bar-border"
          >
            {v.name}
          </span>
        ))}
      </div>
    </Link>
  );
}
