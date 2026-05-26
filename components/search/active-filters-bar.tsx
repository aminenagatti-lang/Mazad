"use client";

interface ActiveFiltersBarProps {
  filters: Record<string, string>;
  onRemove: (key: string) => void;
}

const labels: Record<string, string> = {
  marque: "Marque",
  carburant: "Carburant",
  transmission: "Boîte",
  prix_min: "Prix min",
  prix_max: "Prix max",
  km_max: "Km max",
  annee_min: "Année min",
};

const displayValue: Record<string, Record<string, string>> = {
  carburant: {
    essence: "Essence",
    diesel: "Diesel",
    hybride: "Hybride",
    electrique: "Électrique",
    gpl: "GPL",
  },
  transmission: {
    manuelle: "Manuelle",
    automatique: "Automatique",
  },
};

export function ActiveFiltersBar({ filters, onRemove }: ActiveFiltersBarProps) {
  const entries = Object.entries(filters);
  if (entries.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {entries.map(([key, value]) => {
        const display = displayValue[key]?.[value.toLowerCase()] ?? value;
        return (
          <button
            key={key}
            onClick={() => onRemove(key)}
            className="inline-flex items-center gap-1 rounded-full bg-accent-tint px-3 py-1 text-xs font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
          >
            {labels[key] ?? key}: {display}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
