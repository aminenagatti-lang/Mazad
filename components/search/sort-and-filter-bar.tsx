"use client";

interface SortAndFilterBarProps {
  currentSort: string;
  currentFilters: Record<string, string>;
  marques: string[];
  onSortChange: (sort: string) => void;
  onFilterChange: (filters: Record<string, string>) => void;
}

export function SortAndFilterBar({
  currentSort,
  currentFilters,
  onSortChange,
  onFilterChange,
}: SortAndFilterBarProps) {
  const activeCount = Object.keys(currentFilters).length;

  const sortOptions: Record<string, string> = {
    "": "Plus récentes",
    ending_soon: "Se terminent bientôt",
    price_asc: "Prix croissant",
    price_desc: "Prix décroissant",
  };

  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      {/* Desktop sort */}
      <div className="hidden items-center gap-2 lg:flex">
        <label className="text-sm text-ink-muted">Trier par :</label>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
        >
          {Object.entries(sortOptions).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile filter + sort */}
      <div className="flex w-full gap-2 lg:hidden">
        <button
          onClick={() => {
            /* open mobile sheet */
          }}
          className="flex flex-1 items-center justify-center gap-2 rounded-md border border-line bg-paper px-4 py-2.5 text-sm font-semibold text-ink"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filtrer {activeCount > 0 && `(${activeCount})`}
        </button>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="flex-1 rounded-md border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent"
        >
          {Object.entries(sortOptions).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
