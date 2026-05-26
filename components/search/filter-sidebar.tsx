"use client";

import { useState } from "react";

interface FilterSidebarProps {
  marques: string[];
  currentFilters: Record<string, string>;
  onChange: (filters: Record<string, string>) => void;
}

export function FilterSidebar({ marques, currentFilters, onChange }: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    marque: true,
    carburant: true,
    transmission: true,
    prix: true,
    km: true,
    annee: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateFilter = (key: string, value: string) => {
    onChange({ ...currentFilters, [key]: value });
  };

  const removeFilter = (key: string) => {
    const next = { ...currentFilters };
    delete next[key];
    onChange(next);
  };

  const hasFilters = Object.keys(currentFilters).length > 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-ink">Filtres</h3>
        {hasFilters && (
          <button onClick={() => onChange({})} className="text-xs font-semibold text-accent hover:text-accent-dark">
            Réinitialiser
          </button>
        )}
      </div>

      {/* Marque */}
      <FilterSection title="Marque" open={openSections.marque} onToggle={() => toggleSection("marque")}>
        <div className="mt-2 space-y-1.5">
          {marques.slice(0, 10).map((m) => (
            <label key={m} className="flex cursor-pointer items-center gap-2 text-sm text-ink-secondary">
              <input
                type="radio"
                name="marque"
                checked={currentFilters.marque === m}
                onChange={() => updateFilter("marque", m)}
                data-testid={`filter-marque-${m}`}
                className="accent-accent"
              />
              {m}
            </label>
          ))}
          {currentFilters.marque && !marques.includes(currentFilters.marque) && (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-secondary">
              <input type="radio" name="marque" checked readOnly className="accent-accent" />
              {currentFilters.marque}
            </label>
          )}
          {currentFilters.marque && (
            <button onClick={() => removeFilter("marque")} className="text-xs text-accent hover:underline">
              Effacer
            </button>
          )}
        </div>
      </FilterSection>

      {/* Carburant */}
      <FilterSection title="Carburant" open={openSections.carburant} onToggle={() => toggleSection("carburant")}>
        <div className="mt-2 space-y-1.5">
          {[
            { value: "essence", label: "Essence" },
            { value: "diesel", label: "Diesel" },
            { value: "hybride", label: "Hybride" },
            { value: "electrique", label: "Électrique" },
            { value: "gpl", label: "GPL" },
          ].map((c) => (
            <label key={c.value} className="flex cursor-pointer items-center gap-2 text-sm text-ink-secondary">
              <input
                type="radio"
                name="carburant"
                checked={currentFilters.carburant === c.value}
                onChange={() => updateFilter("carburant", c.value)}
                className="accent-accent"
              />
              {c.label}
            </label>
          ))}
          {currentFilters.carburant && (
            <button onClick={() => removeFilter("carburant")} className="text-xs text-accent hover:underline">
              Effacer
            </button>
          )}
        </div>
      </FilterSection>

      {/* Transmission */}
      <FilterSection title="Boîte" open={openSections.transmission} onToggle={() => toggleSection("transmission")}>
        <div className="mt-2 space-y-1.5">
          {[
            { value: "manuelle", label: "Manuelle" },
            { value: "automatique", label: "Automatique" },
          ].map((t) => (
            <label key={t.value} className="flex cursor-pointer items-center gap-2 text-sm text-ink-secondary">
              <input
                type="radio"
                name="transmission"
                checked={currentFilters.transmission === t.value}
                onChange={() => updateFilter("transmission", t.value)}
                className="accent-accent"
              />
              {t.label}
            </label>
          ))}
          {currentFilters.transmission && (
            <button onClick={() => removeFilter("transmission")} className="text-xs text-accent hover:underline">
              Effacer
            </button>
          )}
        </div>
      </FilterSection>

      {/* Prix */}
      <FilterSection title="Prix (DT)" open={openSections.prix} onToggle={() => toggleSection("prix")}>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            placeholder="De"
            value={currentFilters.prix_min ?? ""}
            onChange={(e) => updateFilter("prix_min", e.target.value)}
            className="w-full rounded-md border border-line bg-paper px-2 py-1.5 text-sm outline-none focus:border-accent"
          />
          <span className="text-xs text-ink-muted">à</span>
          <input
            type="number"
            placeholder=""
            value={currentFilters.prix_max ?? ""}
            onChange={(e) => updateFilter("prix_max", e.target.value)}
            className="w-full rounded-md border border-line bg-paper px-2 py-1.5 text-sm outline-none focus:border-accent"
          />
        </div>
      </FilterSection>

      {/* Kilométrage */}
      <FilterSection title="Kilométrage max" open={openSections.km} onToggle={() => toggleSection("km")}>
        <div className="mt-2">
          <input
            type="number"
            placeholder="ex: 150000"
            value={currentFilters.km_max ?? ""}
            onChange={(e) => updateFilter("km_max", e.target.value)}
            className="w-full rounded-md border border-line bg-paper px-2 py-1.5 text-sm outline-none focus:border-accent"
          />
          <p className="mt-1 text-[10px] text-ink-muted">km</p>
        </div>
      </FilterSection>

      {/* Année */}
      <FilterSection title="Année min" open={openSections.annee} onToggle={() => toggleSection("annee")}>
        <div className="mt-2">
          <select
            value={currentFilters.annee_min ?? ""}
            onChange={(e) => updateFilter("annee_min", e.target.value)}
            className="w-full rounded-md border border-line bg-paper px-2 py-1.5 text-sm outline-none focus:border-accent"
          >
            <option value="">Toutes</option>
            {Array.from({ length: 26 }, (_, i) => 2000 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line pb-4">
      <button onClick={onToggle} className="flex w-full items-center justify-between text-sm font-semibold text-ink">
        {title}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && children}
    </div>
  );
}
