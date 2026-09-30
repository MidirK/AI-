import type { ReactNode } from 'react';

interface TagPillProps {
  children: ReactNode;
  tone?: 'default' | 'amber' | 'burgundy';
}

export default function TagPill({ children, tone = 'default' }: TagPillProps) {
  const toneClass =
    tone === 'amber'
      ? 'bg-bar-amber/15 text-bar-amber border-bar-amber/40'
      : tone === 'burgundy'
        ? 'bg-bar-burgundy/20 text-[#e6b8bd] border-bar-burgundy/50'
        : 'bg-white/5 text-bar-ivorydim border-bar-border';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${toneClass}`}>
      {children}
    </span>
  );
}
