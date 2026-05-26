"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { depositCaution, requestRefund } from "@/app/actions/wallet";

interface WalletData {
  balance: number;
  status: string;
  deposit_verified_at: string | null;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositing, setDepositing] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"konnect" | "flouci" | "virement">("konnect");

  useEffect(() => {
    fetchWallet();
  }, []);

  async function fetchWallet() {
    try {
      const res = await fetch("/api/wallet");
      const data = await res.json();
      setWallet(data.wallet);
      setTransactions(data.transactions || []);
    } catch {
      toast.error("Erreur de chargement du portefeuille");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeposit() {
    setDepositing(true);
    const result = await depositCaution({
      userId: "", // Will be resolved server-side from session
      method: selectedMethod,
      successUrl: `${window.location.origin}/portefeuille?success=1`,
      failUrl: `${window.location.origin}/portefeuille?error=1`,
    });
    setDepositing(false);

    if (result.success && result.payUrl) {
      if (selectedMethod === "virement") {
        window.location.href = result.payUrl;
      } else {
        window.location.href = result.payUrl;
      }
    } else {
      toast.error(result.error || "Erreur lors du dépôt");
    }
  }

  async function handleRefund() {
    if (!confirm("Voulez-vous vraiment demander le remboursement de votre caution ?")) return;
    setRefunding(true);
    const result = await requestRefund(""); // Resolved server-side
    setRefunding(false);

    if (result.success) {
      toast.success("Remboursement initié. Vous recevrez votre argent sous 48h.");
      fetchWallet();
    } else {
      toast.error(result.error || "Erreur lors du remboursement");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 h-32 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  const hasCaution = wallet && wallet.balance >= 200000;
  const isForfeited = wallet?.status === "forfeited";

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">
        Mon portefeuille
      </h1>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 rounded-xl border border-line bg-paper p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
              Solde disponible
            </p>
            <p className="mt-1 text-3xl font-extrabold text-ink font-heading">
              {(wallet?.balance ?? 0).toLocaleString("fr-FR")} <span className="text-lg font-medium">millimes</span>
            </p>
            <p className="mt-0.5 text-sm text-ink-secondary">
              = {((wallet?.balance ?? 0) / 1000).toLocaleString("fr-FR")} DT
            </p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${hasCaution ? "bg-accent-tint text-accent" : "bg-yellow-50 text-yellow-600"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          </div>
        </div>

        {isForfeited && (
          <div className="mt-4 rounded-lg bg-red-50 p-3">
            <p className="text-sm font-medium text-red-700">
              ⚠️ Compte suspendu — Vous avez perdu votre caution suite à un non-paiement. Contactez le support.
            </p>
          </div>
        )}

        {!hasCaution && !isForfeited && (
          <div className="mt-4 rounded-lg bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Caution requise pour enchérir.</strong> Déposez 200 DT pour participer aux enchères. Remboursable sur demande.
            </p>
          </div>
        )}

        {hasCaution && (
          <div className="mt-4 rounded-lg bg-accent-tint/40 p-3">
            <p className="text-sm text-accent-dark">
              <strong>✓ Caution active.</strong> Vous pouvez enchérir sur toutes les enchères en cours.
            </p>
          </div>
        )}
      </motion.div>

      {/* Deposit Section */}
      {!hasCaution && !isForfeited && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 rounded-xl border border-line bg-paper p-6"
        >
          <h2 className="text-lg font-bold text-ink font-heading">Déposer ma caution</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Montant fixe : <strong>200 DT</strong>. Remboursable à tout moment (si pas d'enchère en cours).
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {(["konnect", "flouci", "virement"] as const).map((method) => (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                  selectedMethod === method
                    ? "border-accent bg-accent-tint text-accent"
                    : "border-line bg-surface text-ink-secondary hover:bg-gray-50"
                }`}
              >
                {method === "konnect" && "Konnect"}
                {method === "flouci" && "Flouci"}
                {method === "virement" && "Virement"}
              </button>
            ))}
          </div>

          <button
            onClick={handleDeposit}
            disabled={depositing}
            className="mt-4 w-full rounded-md bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
          >
            {depositing ? "Redirection..." : "Déposer 200 DT"}
          </button>

          {selectedMethod === "virement" && (
            <p className="mt-3 text-xs text-ink-muted">
              Vous serez redirigé vers une page avec nos coordonnées bancaires. Votre portefeuille sera crédité sous 24h après validation manuelle.
            </p>
          )}
        </motion.div>
      )}

      {/* Refund Section */}
      {hasCaution && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-4"
        >
          <button
            onClick={handleRefund}
            disabled={refunding}
            className="w-full rounded-lg border border-line py-3 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface disabled:opacity-50"
          >
            {refunding ? "Traitement..." : "Demander le remboursement de ma caution"}
          </button>
          <p className="mt-2 text-xs text-ink-muted">
            Le remboursement sera effectué sur le même moyen de paiement utilisé pour le dépôt. Impossible si vous avez une enchère en cours ou gagnée.
          </p>
        </motion.div>
      )}

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <h2 className="text-lg font-bold text-ink font-heading">Historique</h2>
        {transactions.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">Aucune transaction.</p>
        ) : (
          <div className="mt-3 space-y-2">
            <AnimatePresence>
              {transactions.map((txn) => (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between rounded-lg border border-line bg-paper px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {txn.type === "deposit" && "Dépôt caution"}
                      {txn.type === "refund" && "Remboursement"}
                      {txn.type === "reserve" && "Réserve commission"}
                      {txn.type === "commission" && "Commission"}
                      {txn.type === "forfeit" && "Forfait caution"}
                      {txn.type === "release" && "Libération"}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {new Date(txn.created_at).toLocaleDateString("fr-FR")} — {txn.payment_method}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      txn.type === "deposit" || txn.type === "release" ? "text-accent" : "text-ink"
                    }`}>
                      {txn.type === "deposit" || txn.type === "release" ? "+" : "-"}
                      {(txn.amount / 1000).toLocaleString("fr-FR")} DT
                    </p>
                    <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      txn.status === "completed" ? "bg-green-50 text-green-700" :
                      txn.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                      "bg-red-50 text-red-700"
                    }`}>
                      {txn.status === "completed" ? "Complété" : txn.status === "pending" ? "En attente" : "Échec"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      <div className="mt-8 text-center">
        <Link href="/encheres" className="text-sm font-medium text-accent hover:text-accent-dark">
          ← Retour aux enchères
        </Link>
      </div>
    </div>
  );
}
