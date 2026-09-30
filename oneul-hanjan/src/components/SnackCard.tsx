import type { Snack } from '../types';
import TagPill from './TagPill';

const categoryLabels: Record<string, string> = {
  cheese: '치즈',
  meat: '고기',
  seafood: '해산물',
  fruit: '과일',
  chocolate: '초콜릿',
  nuts: '견과류',
  etc: '기타',
};

interface SnackCardProps {
  snack: Snack;
  selected?: boolean;
  onSelect?: () => void;
}

export default function SnackCard({ snack, selected, onSelect }: SnackCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'bar-card rounded-2xl p-4 text-left flex flex-col gap-2 transition-colors w-full',
        selected ? 'border-bar-amber/60 bg-bar-amber/5' : 'hover:border-bar-amber/40',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-base text-bar-ivory">{snack.name}</span>
        <TagPill>{categoryLabels[snack.categoryId] ?? snack.categoryId}</TagPill>
      </div>
      <p className="text-sm text-bar-ivorydim leading-relaxed">{snack.shortDescription}</p>
      <div className="flex flex-wrap gap-1.5">
        {snack.tags.map((t) => (
          <TagPill key={t}>{t}</TagPill>
        ))}
      </div>
    </button>
  );
}

export { categoryLabels };
