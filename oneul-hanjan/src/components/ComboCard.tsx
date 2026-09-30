import { Link } from 'react-router-dom';
import type { PairingEntry, Snack, SpiritCategory } from '../types';
import TagPill from './TagPill';

interface ComboCardProps {
  category: SpiritCategory;
  snack: Snack;
  pairing: PairingEntry;
  rank?: number;
}

export default function ComboCard({ category, snack, pairing, rank }: ComboCardProps) {
  return (
    <Link
      to={`/combo/${category.id}/${snack.id}`}
      className="bar-card rounded-2xl p-5 flex flex-col gap-3 hover:border-bar-amber/50 transition-colors group"
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-base text-bar-amber">
          {category.name} · {snack.name}
        </span>
        {rank !== undefined && (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-bar-amber/15 text-bar-amber border border-bar-amber/30">
            추천 {rank}
          </span>
        )}
      </div>
      <p className="text-sm text-bar-ivorydim leading-relaxed">{pairing.reason}</p>
      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
        {pairing.tasteTags?.map((t) => <TagPill key={t}>{t}</TagPill>)}
        <TagPill tone="amber">
          {snack.prepTypes.includes('easy') ? '간편식' : '직접 만들기'} · 약 {snack.cookTimeMinutes}분
        </TagPill>
      </div>
    </Link>
  );
}
