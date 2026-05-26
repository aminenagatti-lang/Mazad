"use client";

import { toast } from "sonner";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { useUser, useBuyerDashboard } from "@/lib/dashboard/hooks";
import Link from "next/link";

export default function BuyerDashboardPage() {
  const { user } = useUser();
  const { stats, activeBids, history, watchlist, loading } = useBuyerDashboard(user?.id);

  const displayName = user
    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.email
    : "—";

  const kycVerified = user?.kyc_status === "verified";

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">Dashboard acheteur</h1>
      <p className="mt-1 text-sm text-ink-secondary">Bonjour, {displayName} 👋</p>

      {/* KYC Banner */}
      {!kycVerified && (
        <div className="mt-6 rounded-lg bg-yellow-50 p-4">
          <p className="text-sm font-medium text-yellow-800">
            {user?.kyc_status === "pending"
              ? "Vérification en cours — Vous pourrez enchérir dès validation (24-48h)"
              : user?.kyc_status === "rejected"
              ? "Vérification refusée. Contactez le support."
              : "Veuillez soumettre vos documents KYC pour enchérir."}
          </p>
        </div>
      )}

      {/* Wallet Banner */}
      <div className="mt-4 rounded-lg border border-line bg-paper p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-ink font-heading">Portefeuille MazadAuto</h3>
            <p className="mt-1 text-xs text-ink-secondary">
              Caution requise : <strong>200 DT</strong> pour enchérir. Remboursable sur demande.
            </p>
          </div>
          <Link
            href="/portefeuille"
            className="shrink-0 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            Gérer mon portefeuille
          </Link>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-line bg-paper p-4">
              <div className="h-8 w-16 animate-pulse rounded bg-surface" />
              <div className="mt-2 h-3 w-24 animate-pulse rounded bg-surface" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Enchères actives", value: stats.activeBids.toString() },
            { label: "Enchères gagnées", value: stats.wonAuctions.toString() },
            { label: "Enchères perdues", value: stats.lostAuctions.toString() },
            { label: "Montant total dépensé", value: `${(stats.totalSpent / 1000).toLocaleString("fr-FR")} DT` },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-line bg-paper p-4">
              <p className="text-2xl font-extrabold text-ink font-heading">{s.value}</p>
              <p className="mt-1 text-xs text-ink-secondary">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Active Bids */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-ink font-heading">Mes enchères en cours</h2>
        <div className="mt-4 overflow-x-auto">
          {loading || activeBids.length === 0 ? (
            <p className="text-sm text-ink-muted">Aucune enchère en cours.</p>
          ) : (
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-line text-left">
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Véhicule</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Mon enchère</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Enchère actuelle</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Statut</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Temps restant</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Action</th>
                </tr>
              </thead>
              <tbody>
                {activeBids.map((bid) => (
                  <tr key={bid.auctionId} className="border-b border-line last:border-0">
                    <td className="py-3 text-sm font-medium text-ink">{bid.vehicleName}</td>
                    <td className="py-3 text-sm text-ink-secondary">{(bid.myBid / 1000).toLocaleString("fr-FR")} DT</td>
                    <td className="py-3 text-sm font-bold text-accent font-heading">{(bid.currentBid / 1000).toLocaleString("fr-FR")} DT</td>
                    <td className="py-3">
                      {bid.status === "leading" ? (
                        <span className="inline-flex rounded-full bg-accent-tint px-2 py-0.5 text-xs font-bold text-accent">En tête</span>
                      ) : (
                        <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">Surenchéri</span>
                      )}
                    </td>
                    <td className="py-3">
                      <CountdownTimer endDate={new Date(bid.endsAt)} size="sm" />
                    </td>
                    <td className="py-3">
                      <Link href={`/encheres/${bid.vehicleSlug}`} className="text-sm font-semibold text-accent hover:text-accent-dark">Renchérir →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* History */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-ink font-heading">Historique</h2>
        <div className="mt-4 overflow-x-auto">
          {loading || history.length === 0 ? (
            <p className="text-sm text-ink-muted">Aucun historique.</p>
          ) : (
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-line text-left">
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Véhicule</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Montant final</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Statut</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.auctionId} className="border-b border-line last:border-0">
                    <td className="py-3 text-sm font-medium text-ink">{h.vehicleName}</td>
                    <td className="py-3 text-sm text-ink-secondary">{(h.finalAmount / 1000).toLocaleString("fr-FR")} DT</td>
                    <td className="py-3">
                      {h.status === "won" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent-tint px-2 py-0.5 text-xs font-bold text-accent">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          Gagné
                        </span>
                      ) : (
                        <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-bold text-ink-muted">Non remporté</span>
                      )}
                    </td>
                    <td className="py-3 text-xs text-ink-muted">{new Date(h.date).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Watchlist */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-ink font-heading">Mes favoris</h2>
        <div className="mt-4 grid grid-cols-2 gap-5 lg:grid-cols-3">
          {loading || watchlist.length === 0 ? (
            <p className="col-span-full text-sm text-ink-muted">Aucun favori.</p>
          ) : (
            watchlist.map((v) => (
              <Link key={v.slug} href={`/encheres/${v.slug}`} className="flex flex-col overflow-hidden rounded-xl bg-paper shadow-card">
                <div className="aspect-video bg-surface flex items-center justify-center">
                  <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">PHOTO</span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-base font-bold text-ink font-heading">{v.name}</h3>
                    <span className="text-sm text-ink-secondary">{v.year}</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Enchère actuelle</p>
                    <p className="mt-0.5 text-xl font-bold text-accent font-heading">{(v.currentPrice / 1000).toLocaleString("fr-FR")} DT</p>
                  </div>
                  <div className="mt-2">
                    <CountdownTimer endDate={new Date(v.endsAt)} size="sm" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
