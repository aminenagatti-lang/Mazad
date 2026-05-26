export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#9ca3af"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mb-4"
      >
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-5.25a1 1 0 0 0-1.76 0L9 11 4.84 11.86a1 1 0 0 0-.84.99V16h3" />
        <path d="M19 8v4" />
        <path d="M4 8v4" />
        <circle cx="6.5" cy="18.5" r="2.5" />
        <circle cx="17.5" cy="18.5" r="2.5" />
        <line x1="22" y1="2" x2="2" y2="22" />
      </svg>
      <h3 className="text-lg font-bold text-ink">Aucun véhicule ne correspond à vos critères</h3>
      <p className="mt-2 text-sm text-ink-secondary">Essayez d&apos;élargir vos filtres ou de réinitialiser la recherche.</p>
      <button
        onClick={onReset}
        className="mt-6 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
}
