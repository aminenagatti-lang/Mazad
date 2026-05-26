"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { useUser, useSellerDashboard } from "@/lib/dashboard/hooks";
import Link from "next/link";

export default function SellerDashboardPage() {
  const { user } = useUser();
  const { stats, listings, drafts, sales, loading } = useSellerDashboard(user?.id);
  const [cancelModal, setCancelModal] = useState<string | null>(null);

  const kycVerified = user?.kyc_status === "verified";

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">Vue d&apos;ensemble vendeur</h1>

      {/* KYC Banner */}
      {!kycVerified && (
        <div className="mt-6 rounded-lg bg-yellow-50 p-4">
          <p className="text-sm font-medium text-yellow-800">
            {user?.kyc_status === "pending"
              ? "Vérification en cours — Vous pourrez mettre en vente dès validation (24-48h)"
              : user?.kyc_status === "rejected"
              ? "Vérification refusée. Contactez le support."
              : "Veuillez soumettre vos documents KYC pour vendre."}
          </p>
        </div>
      )}

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
            { label: "Véhicules actifs", value: stats.activeListings.toString() },
            { label: "Véhicules vendus", value: stats.soldVehicles.toString() },
            { label: "Revenus total", value: `${(stats.totalRevenue / 1000).toLocaleString("fr-FR")} DT` },
            { label: "Commission payée", value: `${(stats.totalCommission / 1000).toLocaleString("fr-FR")} DT` },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-line bg-paper p-4">
              <p className="text-2xl font-extrabold text-ink font-heading">{s.value}</p>
              <p className="mt-1 text-xs text-ink-secondary">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Active Listings */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-ink font-heading">Enchères actives</h2>
        <div className="mt-4 overflow-x-auto">
          {loading || listings.length === 0 ? (
            <p className="text-sm text-ink-muted">Aucune enchère active.</p>
          ) : (
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-line text-left">
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Véhicule</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Prix départ</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Enchère actuelle</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Enchères</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Temps restant</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => (
                  <tr key={l.id} className="border-b border-line last:border-0">
                    <td className="py-3 text-sm font-medium text-ink">{l.vehicleName}</td>
                    <td className="py-3 text-sm text-ink-secondary">{(l.prixDepart / 1000).toLocaleString("fr-FR")} DT</td>
                    <td className="py-3 text-sm font-bold text-accent font-heading">{(l.currentBid / 1000).toLocaleString("fr-FR")} DT</td>
                    <td className="py-3 text-sm text-ink-secondary">{l.bidCount}</td>
                    <td className="py-3">
                      <CountdownTimer endDate={new Date(l.endsAt)} size="sm" />
                    </td>
                    <td className="py-3">
                      <button onClick={() => setCancelModal(l.vehicleName)} className="text-sm font-semibold text-red-600 hover:text-red-700">
                        Annuler
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Drafts */}
      {drafts.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-ink font-heading">Brouillons et en attente</h2>
          <div className="mt-4 space-y-3">
            {drafts.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-xl border border-line bg-paper p-4">
                <div>
                  <p className="text-sm font-semibold text-ink">{d.vehicleName}</p>
                  <p className="text-xs text-ink-muted">Soumis le {new Date(d.submittedAt).toLocaleDateString("fr-FR")} · En attente d&apos;inspection</p>
                </div>
                <Link href={`/dashboard/vendeur/vehicules/nouveau?id=${d.id}`} className="text-sm font-semibold text-accent hover:text-accent-dark">
                  Finaliser la mise en vente →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-ink font-heading">Ventes conclues</h2>
        <div className="mt-4 overflow-x-auto">
          {loading || sales.length === 0 ? (
            <p className="text-sm text-ink-muted">Aucune vente conclue.</p>
          ) : (
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-line text-left">
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Véhicule</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Prix adjugé</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Commission</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Net reçu</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Acheteur</th>
                  <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s.id} className="border-b border-line last:border-0">
                    <td className="py-3 text-sm font-medium text-ink">{s.vehicleName}</td>
                    <td className="py-3 text-sm text-ink-secondary">{(s.prixAdjudication / 1000).toLocaleString("fr-FR")} DT</td>
                    <td className="py-3 text-sm text-red-600">{(s.commission / 1000).toLocaleString("fr-FR")} DT</td>
                    <td className="py-3 text-sm font-bold text-accent font-heading">{(s.net / 1000).toLocaleString("fr-FR")} DT</td>
                    <td className="py-3 text-sm text-ink-secondary">{s.buyer}</td>
                    <td className="py-3 text-xs text-ink-muted">{new Date(s.date).toLocaleDateString("fr-FR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <button onClick={() => toast.success("Export CSV en préparation")} className="mt-4 text-sm font-semibold text-accent hover:text-accent-dark">
          Exporter en CSV
        </button>
      </div>

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-paper p-6 shadow-xl">
            <h3 className="text-lg font-bold text-ink font-heading">Annuler la vente ?</h3>
            <p className="mt-2 text-sm text-ink-secondary">Cette action est irréversible. L&apos;enchère sera annulée.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setCancelModal(null)} className="flex-1 rounded-md border border-line bg-paper py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface">
                Annuler
              </button>
              <button onClick={() => { toast.success("Vente annulée"); setCancelModal(null); }} className="flex-1 rounded-md bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700">
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
