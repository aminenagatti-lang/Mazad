"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

export default function VirementPage() {
  const [uploaded, setUploaded] = useState(false);

  const rib = process.env.NEXT_PUBLIC_MAZADAUTO_RIB || "XX XXX XXXXXXXXXXXXXXXX XX";
  const bankName = process.env.NEXT_PUBLIC_MAZADAUTO_BANK_NAME || "Banque MazadAuto";

  const handleUpload = () => {
    // In production, this would upload a file to Supabase Storage
    setUploaded(true);
    toast.success("Preuve de virement reçue. Votre portefeuille sera crédité sous 24h.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-md"
      >
        <Link href="/portefeuille" className="text-sm text-accent hover:text-accent-dark">
          ← Retour au portefeuille
        </Link>

        <h1 className="mt-4 text-2xl font-extrabold text-ink font-heading">
          Paiement par virement
        </h1>
        <p className="mt-2 text-sm text-ink-secondary">
          Effectuez un virement de <strong>200 DT</strong> vers notre compte bancaire.
        </p>

        <div className="mt-6 rounded-xl border border-line bg-paper p-5">
          <h3 className="text-sm font-bold text-ink">Coordonnées bancaires</h3>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs text-ink-muted">Bénéficiaire</p>
              <p className="text-sm font-medium text-ink">MazadAuto SARL</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">RIB</p>
              <p className="text-sm font-mono font-medium text-ink">{rib}</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">Banque</p>
              <p className="text-sm font-medium text-ink">{bankName}</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">Montant</p>
              <p className="text-sm font-extrabold text-ink">200,00 DT</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">Motif / Référence</p>
              <p className="text-sm font-mono font-medium text-accent">
                MAZAD-{Math.random().toString(36).substring(2, 10).toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-line bg-paper p-5">
          <h3 className="text-sm font-bold text-ink">Confirmer mon virement</h3>
          <p className="mt-2 text-xs text-ink-secondary">
            Une fois le virement effectué, uploadez une capture d&apos;écran ou une photo du reçu. Notre équipe validera sous 24h.
          </p>

          <button
            onClick={handleUpload}
            disabled={uploaded}
            className="mt-4 w-full rounded-md border-2 border-dashed border-line py-8 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface disabled:opacity-50"
          >
            {uploaded ? "✓ Preuve reçue" : "Cliquez pour uploader le reçu de virement"}
          </button>
        </div>

        <div className="mt-4 rounded-lg bg-yellow-50 p-3">
          <p className="text-xs text-yellow-800">
            <strong>Important :</strong> Votre portefeuille ne sera crédité qu&apos;après validation manuelle par notre équipe. Cela peut prendre jusqu&apos;à 24h ouvrées.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
