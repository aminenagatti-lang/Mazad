"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAdminDashboard, useKycActions } from "@/lib/dashboard/hooks";

export default function AdminDashboardPage() {
  const { stats, activities, kycPending, loading, refresh } = useAdminDashboard();
  const { approve, reject, processing } = useKycActions();
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    const res = await approve(id);
    if (res.success) {
      toast.success("KYC approuvé");
      refresh();
    } else {
      toast.error("Erreur lors de l'approbation");
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) {
      toast.error("Veuillez indiquer un motif de refus");
      return;
    }
    const res = await reject(id, rejectReason);
    if (res.success) {
      toast.success("KYC refusé");
      setRejectingId(null);
      setRejectReason("");
      refresh();
    } else {
      toast.error("Erreur lors du refus");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">Vue d&apos;ensemble</h1>

      {/* Stats */}
      {loading ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-line bg-paper p-4">
              <div className="h-8 w-16 animate-pulse rounded bg-surface" />
              <div className="mt-2 h-3 w-24 animate-pulse rounded bg-surface" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { label: "Total utilisateurs", value: stats.totalUsers.toString() },
            { label: "Acheteurs", value: stats.buyers.toString() },
            { label: "Vendeurs", value: stats.sellers.toString() },
            { label: "KYC en attente", value: stats.kycPending.toString() },
            { label: "Véhicules actifs", value: stats.activeVehicles.toString() },
            { label: "Enchères en cours", value: stats.activeAuctions.toString() },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-line bg-paper p-4">
              <p className="text-2xl font-extrabold text-ink font-heading">{s.value}</p>
              <p className="mt-1 text-xs text-ink-secondary">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* KYC Pending Section */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-ink font-heading">KYC en attente ({kycPending.length})</h2>
        <div className="mt-4 space-y-3">
          {kycPending.length === 0 ? (
            <p className="text-sm text-ink-muted">Aucun KYC en attente.</p>
          ) : (
            kycPending.map((u) => (
              <div key={u.id} className="rounded-lg border border-line bg-paper p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {u.first_name} {u.last_name}
                      {u.company_name && <span className="text-ink-secondary"> · {u.company_name}</span>}
                    </p>
                    <p className="text-xs text-ink-muted">{u.email} · {u.seller_type === "entreprise" ? "Entreprise" : "Particulier"}</p>
                  </div>
                  {rejectingId === u.id ? (
                    <div className="flex flex-1 items-center gap-2 sm:max-w-md">
                      <input
                        type="text"
                        placeholder="Motif du refus"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="flex-1 rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
                      />
                      <button onClick={() => handleReject(u.id)} disabled={processing === u.id} className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50">
                        Confirmer
                      </button>
                      <button onClick={() => { setRejectingId(null); setRejectReason(""); }} className="rounded-md border border-line bg-paper px-3 py-2 text-xs font-semibold text-ink hover:bg-surface">
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleApprove(u.id)} disabled={processing === u.id} className="rounded-md bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-accent-dark disabled:opacity-50">
                        Approuver
                      </button>
                      <button onClick={() => setRejectingId(u.id)} disabled={processing === u.id} className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50">
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Activity */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-ink font-heading">Activité récente</h2>
        <div className="mt-4 space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-ink-muted">Aucune activité récente.</p>
          ) : (
            activities.map((a, i) => (
              <div key={i} className="flex items-start gap-4 rounded-lg border border-line bg-paper p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-ink-muted">
                  {a.icon === "user" && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                  {a.icon === "doc" && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                  {a.icon === "car" && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-5.25a1 1 0 0 0-1.76 0L9 11 4.84 11.86a1 1 0 0 0-.84.99V16h3"/></svg>}
                  {a.icon === "gavel" && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8.5 14.5 2 2 5-5"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg>}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{a.text}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{a.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
