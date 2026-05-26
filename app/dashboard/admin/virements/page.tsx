"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { createBrowserClient } from "@supabase/ssr";
import { approveBankTransfer } from "@/app/actions/wallet";

interface PendingTransfer {
  id: string;
  wallet_id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  proof_url: string | null;
  created_at: string;
  user_name: string | null;
  user_email: string | null;
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminTransfersPage() {
  const [transfers, setTransfers] = useState<PendingTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingTransfers();
  }, []);

  async function fetchPendingTransfers() {
    try {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("id, wallet_id, amount, payment_method, proof_url, created_at, wallets!inner(user_id), profiles!inner(first_name, last_name, email)")
        .eq("type", "deposit")
        .eq("payment_method", "virement")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erreur de chargement");
        setLoading(false);
        return;
      }

      const formatted = (data ?? []).map((t: Record<string, unknown>) => ({
        id: t.id as string,
        wallet_id: (t.wallets as Record<string, unknown>)?.user_id as string,
        user_id: (t.wallets as Record<string, unknown>)?.user_id as string,
        amount: t.amount as number,
        payment_method: t.payment_method as string,
        proof_url: t.proof_url as string | null,
        created_at: t.created_at as string,
        user_name: `${(t.profiles as Record<string, unknown>)?.first_name ?? ""} ${(t.profiles as Record<string, unknown>)?.last_name ?? ""}`.trim() || null,
        user_email: (t.profiles as Record<string, unknown>)?.email as string | null,
      }));

      setTransfers(formatted);
      setLoading(false);
    } catch {
      toast.error("Erreur de chargement");
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    setApproving(id);
    const result = await approveBankTransfer(id);
    setApproving(null);

    if (result.success) {
      toast.success("Virement validé et portefeuille crédité");
      setTransfers((prev) => prev.filter((t) => t.id !== id));
    } else {
      toast.error(result.error || "Erreur lors de la validation");
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">
        Virements en attente
      </h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Validez les virements bancaires manuels pour créditer les portefeuilles.
      </p>

      {transfers.length === 0 ? (
        <div className="mt-8 rounded-xl border border-line bg-paper p-8 text-center">
          <p className="text-sm text-ink-muted">Aucun virement en attente.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {transfers.map((transfer) => (
            <motion.div
              key={transfer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-line bg-paper p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-ink">
                      {(transfer.amount / 1000).toLocaleString("fr-FR")} DT
                    </p>
                    <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-[10px] font-bold text-yellow-700">
                      En attente
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-secondary">
                    {transfer.user_name ?? "Utilisateur inconnu"} — {transfer.user_email ?? "Email non disponible"}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    Demandé le {new Date(transfer.created_at).toLocaleDateString("fr-FR")}
                  </p>
                  {transfer.proof_url && (
                    <a
                      href={transfer.proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-accent hover:text-accent-dark"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      Voir la preuve
                    </a>
                  )}
                </div>
                <button
                  onClick={() => handleApprove(transfer.id)}
                  disabled={approving === transfer.id}
                  className="shrink-0 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
                >
                  {approving === transfer.id ? "Validation..." : "Valider le virement"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
