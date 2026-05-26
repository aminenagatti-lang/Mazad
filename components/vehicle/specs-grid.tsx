interface Spec {
  label: string;
  value: string;
}

interface SpecsGridProps {
  specs: Spec[];
}

export function SpecsGrid({ specs }: SpecsGridProps) {
  return (
    <div data-testid="specs-grid" className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line sm:grid-cols-4">
      {specs.map((spec) => (
        <div key={spec.label} className="border-b border-r border-line bg-paper p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">{spec.label}</p>
          <p className="mt-1 text-sm font-semibold text-ink">{spec.value}</p>
        </div>
      ))}
    </div>
  );
}
