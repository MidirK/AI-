interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="bar-card rounded-2xl px-6 py-10 text-center">
      <p className="font-display text-lg text-bar-ivory mb-2">{title}</p>
      <p className="text-sm text-bar-ivorydim">{description}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 inline-flex items-center px-4 py-2 rounded-full bg-bar-amber/15 text-bar-amber border border-bar-amber/40 text-sm hover:bg-bar-amber/25 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
