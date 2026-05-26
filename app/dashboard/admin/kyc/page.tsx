"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { fetchKycPending, approveKyc, rejectKyc, type KycPendingUser } from "@/lib/dashboard/data";

export default function AdminKycPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [profiles, setProfiles] = useState<KycPendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<KycPendingUser | null>(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchKycPending().then((data) => {
      setProfiles(data);
      setLoading(false);
    });
  }, []);

  const handleApprove = async () => {
    if (!selectedProfile) return;
    setProcessing(true);
    const res = await approveKyc(selectedProfile.id);
    setProcessing(false);
    if (res.success) {
      toast.success("Compte approuvé");
      setProfiles((prev) => prev.filter((p) => p.id !== selectedProfile.id));
      setSelectedProfile(null);
    } else {
      toast.error("Erreur lors de l'approbation");
    }
  };

  const handleReject = async () => {
    if (!selectedProfile || !rejectionReason.trim()) return;
    setProcessing(true);
    const res = await rejectKyc(selectedProfile.id, rejectionReason);
    setProcessing(false);
    if (res.success) {
      toast.success("Compte rejeté");
      setProfiles((prev) => prev.filter((p) => p.id !== selectedProfile.id));
      setRejectModal(false);
      setRejectionReason("");
      setSelectedProfile(null);
    } else {
      toast.error("Erreur lors du rejet");
    }
  };

  const filteredKyc = useMemo(() => {
    if (filter === "all") return profiles;
    if (filter === "pending") return profiles.filter((k) => k.kyc_status === "pending");
    if (filter === "approved") return profiles.filter((k) => k.kyc_status === "verified");
    if (filter === "rejected") return profiles.filter((k) => k.kyc_status === "rejected");
    return profiles;
  }, [filter, profiles]);

  const counts = useMemo(() => ({
    all: profiles.length,
    pending: profiles.filter((k) => k.kyc_status === "pending").length,
    approved: profiles.filter((k) => k.kyc_status === "verified").length,
    rejected: profiles.filter((k) => k.kyc_status === "rejected").length,
  }), [profiles]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">Vérifications KYC</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {([
          { key: "all" as const, label: "Tous" },
          { key: "pending" as const, label: `En attente (${counts.pending})` },
          { key: "approved" as const, label: `Approuvés (${counts.approved})` },
          { key: "rejected" as const, label: `Rejetés (${counts.rejected})` },
        ]).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === f.key ? "bg-accent text-white" : "bg-surface text-ink-secondary hover:bg-elevated"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded bg-surface" />
            ))}
          </div>
        ) : (
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Nom</th>
                <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Type compte</th>
                <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Email</th>
                <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredKyc.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="py-3 text-sm font-medium text-ink">
                    {p.first_name} {p.last_name}
                    {p.company_name && <span className="text-ink-secondary"> · {p.company_name}</span>}
                  </td>
                  <td className="py-3 text-sm capitalize text-ink-secondary">{p.seller_type ?? "particulier"}</td>
                  <td className="py-3 text-sm text-ink-secondary">{p.email}</td>
                  <td className="py-3">
                    <button onClick={() => setSelectedProfile(p)} className="text-sm font-semibold text-accent hover:text-accent-dark">
                      Examiner
                    </button>
                  </td>
                </tr>
              ))}
              {filteredKyc.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-sm text-ink-muted">Aucun KYC en attente</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-line bg-paper shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-ink font-heading">Examiner KYC</h2>
                <button onClick={() => setSelectedProfile(null)} className="rounded-md p-2 text-ink-muted hover:text-ink">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <div className="mt-6 rounded-xl bg-surface p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">Nom</p>
                <p className="mt-1 text-sm font-semibold text-ink">{selectedProfile.first_name} {selectedProfile.last_name}</p>
                <p className="mt-3 text-xs font-medium uppercase tracking-wider text-ink-muted">Email</p>
                <p className="mt-1 text-sm text-ink">{selectedProfile.email}</p>
                <p className="mt-3 text-xs font-medium uppercase tracking-wider text-ink-muted">Type</p>
                <p className="mt-1 text-sm text-ink capitalize">{selectedProfile.seller_type ?? "particulier"}</p>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button onClick={handleApprove} disabled={processing} className="w-full rounded-md bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60">
                  {processing ? "Traitement..." : "Approuver le compte"}
                </button>
                <button onClick={() => setRejectModal(true)} disabled={processing} className="w-full rounded-md border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60">
                  Rejeter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-paper p-6 shadow-xl">
            <h3 className="text-lg font-bold text-ink font-heading">Raison du rejet</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Indiquez la raison du rejet..."
              rows={3}
              className="mt-3 block w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
            <div className="mt-4 flex gap-3">
              <button onClick={() => setRejectModal(false)} className="flex-1 rounded-md border border-line bg-paper py-2.5 text-sm font-semibold text-ink">Annuler</button>
              <button onClick={handleReject} disabled={processing} className="flex-1 rounded-md bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                {processing ? "..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
