"use client";

import { CountdownTimer } from "@/components/ui/countdown-timer";

interface SimilarVehicle {
  id: string;
  slug: string | null;
  marque: string;
  modele: string;
  annee: number;
  current_price: number;
  bid_count: number;
  ends_at: string;
}

interface SimilarAuctionsProps {
  vehicles: SimilarVehicle[];
}

export function SimilarAuctions({ vehicles }: SimilarAuctionsProps) {
  return (
    <section className="mt-20">
      <h2 className="text-2xl font-bold text-ink font-heading">Vous pourriez aussi aimer</h2>
      <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-3">
        {vehicles.map((v) => (
          <a
            key={v.id}
            href={`/encheres/${v.slug ?? v.id}`}
            className="flex flex-col overflow-hidden rounded-xl bg-paper shadow-card transition-shadow hover:shadow-card-hover"
          >
            <div className="aspect-video bg-surface flex items-center justify-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">PHOTO</span>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-base font-bold text-ink font-heading">{v.marque} {v.modele}</h3>
                <span className="text-sm text-ink-secondary">{v.annee}</span>
              </div>
              <div className="mt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Enchère actuelle</p>
                <p className="mt-0.5 text-xl font-bold text-accent font-heading">
                  {(v.current_price / 1000).toLocaleString("fr-FR")} DT
                </p>
              </div>
              <div className="mt-2">
                <CountdownTimer endDate={new Date(v.ends_at)} size="sm" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
