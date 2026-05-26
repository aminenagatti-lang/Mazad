"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { payCommission } from "@/app/actions/wallet";
import { calculateCommission } from "@/app/actions/wallet";

interface AuctionData {
  id: string;
  current_price: number;
  ends_at: string;
  vehicle: {
    marque: string;
    modele: string;
    annee: number;
    slug: string;
  } | null;
}

export default function VictoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [auction, setAuction] = useState<AuctionData | null>(null);
  const [commission, setCommission] = useState<{ total: number; cautionCredit: number; remaining: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"konnect" | "flouci" | "virement">("konnect");
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60); // 48h in seconds

  const slug = typeof window !== "undefined" ? window.location.pathname.split("/")[2] : "";

  useEffect(() => {
    if (!slug) return;
    fetchAuction();
  }, [slug]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  async function fetchAuction() {
    try {
      const res = await fetch(`/api/auction-by-slug?slug=${slug}`);
      const data = await res.json();
      if (data.auction) {
        setAuction(data.auction);
        const comm = await calculateCommission(data.auction.current_price);
        setCommission(comm);
      }
    } catch {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  async function handlePay() {
    if (!auction || !commission) return;
    setPaying(true);

    const result = await payCommission({
      auctionId: auction.id,
      userId: "",
      method: selectedMethod,
      successUrl: `${window.location.origin}/encheres/${slug}/confirmation`,
      failUrl: `${window.location.origin}/encheres/${slug}/victoire?error=1`,
    });

    setPaying(false);

    if (result.success) {
      if (result.payUrl) {
        window.location.href = result.payUrl;
      } else {
        router.push(`/encheres/${slug}/confirmation`);
      }
    } else {
      toast.error(result.error || "Erreur lors du paiement");
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg text-ink">Enchère introuvable</p>
        </div>
      </div>
    );
  }

  const vehicleName = `${auction.vehicle?.marque ?? ""} ${auction.vehicle?.modele ?? ""} ${auction.vehicle?.annee ?? ""}`.trim();

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-md"
      >
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-tint">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-ink font-heading">
            Félicitations !
          </h1>
          <p className="mt-2 text-sm text-ink-secondary">
            Vous avez remporté l&apos;enchère sur <strong>{vehicleName}</strong>
          </p>
        </div>

        {/* Price & Commission */}
        <div className="mt-6 rounded-xl border border-line bg-paper p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-secondary">Prix d&apos;adjudication</span>
              <span className="text-sm font-semibold text-ink">
                {(auction.current_price / 1000).toLocaleString("fr-FR")} DT
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-secondary">Commission plateforme (2%)</span>
              <span className="text-sm font-semibold text-ink">
                {(commission!.total / 1000).toLocaleString("fr-FR")} DT
              </span>
            </div>
            <div className="border-t border-line pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-secondary">Caution déjà payée</span>
                <span className="text-sm font-semibold text-accent">
                  -{(commission!.cautionCredit / 1000).toLocaleString("fr-FR")} DT
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-3">
              <span className="text-base font-bold text-ink">Reste à payer</span>
              <span className="text-base font-extrabold text-accent">
                {(commission!.remaining / 1000).toLocaleString("fr-FR")} DT
              </span>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="mt-4 rounded-lg bg-yellow-50 p-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span className="text-sm font-medium text-yellow-800">
              Il vous reste <strong>{formatTime(timeLeft)}</strong> pour payer
            </span>
          </div>
          <p className="mt-1 text-xs text-yellow-700">
            Sans paiement sous 48h, vous perdrez votre caution de 200 DT et serez suspendu 30 jours.
          </p>
        </div>

        {/* Payment Method */}
        {commission!.remaining > 0 && (
          <div className="mt-6 rounded-xl border border-line bg-paper p-5">
            <h3 className="text-sm font-bold text-ink">Moyen de paiement</h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(["konnect", "flouci", "virement"] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors ${
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
              onClick={handlePay}
              disabled={paying || timeLeft <= 0}
              className="mt-4 w-full rounded-md bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
            >
              {paying ? "Redirection..." : `Payer ${(commission!.remaining / 1000).toLocaleString("fr-FR")} DT`}
            </button>
          </div>
        )}

        {commission!.remaining === 0 && (
          <div className="mt-6 rounded-xl border border-accent/20 bg-accent-tint/40 p-5 text-center">
            <p className="text-sm font-medium text-accent-dark">
              ✓ Votre caution de 200 DT couvre entièrement la commission.
            </p>
            <button
              onClick={handlePay}
              disabled={paying}
              className="mt-3 w-full rounded-md bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
            >
              {paying ? "Confirmation..." : "Confirmer et recevoir les coordonnées du vendeur"}
            </button>
          </div>
        )}

        {/* What happens next */}
        <div className="mt-6 space-y-2 text-xs text-ink-muted">
          <p>1. Payez la commission pour débloquer les coordonnées du vendeur.</p>
          <p>2. Contactez le vendeur pour organiser la remise du véhicule.</p>
          <p>3. Payez le prix du véhicule ({(auction.current_price / 1000).toLocaleString("fr-FR")} DT) directement au vendeur en espèces ou virement.</p>
          <p>4. Signez l&apos;acte de vente et profitez de votre nouvelle voiture !</p>
        </div>
      </motion.div>
    </div>
  );
}
