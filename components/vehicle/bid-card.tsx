"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { placeBid } from "@/app/actions/bids";
import { supabase } from "@/lib/supabase/client";
import { isTestMode } from "@/lib/test-mode";
import type { Auction, Profile } from "@/lib/supabase/types";
import Link from "next/link";

interface BidCardProps {
  auction: Auction;
  currentUser: Profile | null;
  onBidPlaced?: (amount: number) => void;
}

function BidConfirmModal({
  open,
  amount,
  onConfirm,
  onCancel,
  placing,
}: {
  open: boolean;
  amount: number;
  onConfirm: () => void;
  onCancel: () => void;
  placing: boolean;
}) {
  if (!open) return null;
  return (
    <div data-testid="confirm-bid-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl bg-paper p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-ink font-heading">Confirmer votre enchère</h3>
        <p className="mt-2 text-sm text-ink-secondary">
          Vous êtes sur le point d'enchérir{" "}
          <span className="font-bold text-accent">
            {(amount / 1000).toLocaleString("fr-FR")} DT
          </span>
          .
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={placing}
            className="flex-1 rounded-md border border-line bg-paper px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-60"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={placing}
            className="flex-1 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
          >
            {placing ? "Validation..." : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function BidCard({ auction, currentUser, onBidPlaced }: BidCardProps) {
  const [bidInput, setBidInput] = useState((auction.current_price / 1000 + 200).toString());
  const [currentPrice, setCurrentPrice] = useState(auction.current_price);
  const [bidCount, setBidCount] = useState(auction.bid_count);
  const [placing, setPlacing] = useState(false);
  const [watching, setWatching] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; amount: number; onConfirm: () => void }>({
    open: false,
    amount: 0,
    onConfirm: () => {},
  });

  useEffect(() => {
    setTestMode(isTestMode());
  }, []);

  const minBid = currentPrice + 200 * 1000;
  const isEnded = new Date(auction.ends_at) < new Date();

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`auction-${auction.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "auctions", filter: `id=eq.${auction.id}` },
        (payload) => {
          const newData = payload.new as { current_price: number; bid_count: number };
          setCurrentPrice(newData.current_price);
          setBidCount(newData.bid_count);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [auction.id]);

  const executeBid = useCallback(async (amount: number) => {
    setPlacing(true);

    if (testMode) {
      toast.success(`Enchère placée (mode test) !`);
      setCurrentPrice(amount);
      setBidCount((c) => c + 1);
      setBidInput((amount / 1000 + 200).toString());
      onBidPlaced?.(amount);
      setPlacing(false);
      return;
    }

    const result = await placeBid({ auctionId: auction.id, amount });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Enchère placée !");
      setCurrentPrice(amount);
      setBidCount((c) => c + 1);
      setBidInput((amount / 1000 + 200).toString());
      onBidPlaced?.(amount);
    }
    setPlacing(false);
  }, [auction.id, testMode, onBidPlaced]);

  const promptConfirm = useCallback((amount: number, label?: string) => {
    if (!currentUser && !testMode) {
      toast.error("Vous devez être connecté pour enchérir");
      return;
    }
    if (isEnded) {
      toast.error("L'enchère est terminée");
      return;
    }
    if (amount < minBid) {
      toast.error(`L'enchère minimum est de ${(minBid / 1000).toLocaleString("fr-FR")} DT`);
      return;
    }
    setConfirmModal({
      open: true,
      amount,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));
        await executeBid(amount);
      },
    });
  }, [currentUser, testMode, isEnded, minBid, executeBid]);

  const handlePlaceBid = useCallback(() => {
    const amount = parseInt(bidInput.replace(/\s/g, ""), 10) * 1000;
    if (isNaN(amount)) {
      toast.error("Montant invalide");
      return;
    }
    promptConfirm(amount);
  }, [bidInput, promptConfirm]);

  const handleQuickBid = useCallback((increment: number) => {
    const amount = currentPrice + increment * 1000;
    promptConfirm(amount, `+${increment} DT`);
  }, [currentPrice, promptConfirm]);

  const state = testMode
    ? isEnded
      ? "ended"
      : "active"
    : !currentUser
    ? "login"
    : currentUser.kyc_status !== "verified"
    ? currentUser.kyc_status === "rejected"
      ? "rejected"
      : "pending"
    : isEnded
    ? "ended"
    : "active";

  return (
    <div data-testid="bid-card" className="rounded-xl border border-line bg-paper p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-tint px-2.5 py-1 text-xs font-bold text-accent">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
          </span>
          Enchère en cours
        </span>
      </div>

      <div className="mt-5">
        <CountdownTimer endDate={new Date(auction.ends_at)} size="lg" />
      </div>

      <div className="mt-6 rounded-lg bg-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Enchère actuelle</p>
        <p className="mt-1 text-3xl font-extrabold text-ink font-heading">{(currentPrice / 1000).toLocaleString("fr-FR")} DT</p>
        <p className="mt-1 text-xs text-ink-secondary">{bidCount} enchères · Dernière il y a 4 min</p>
      </div>

      {state === "active" && (
        <>
          <div className="mt-5">
            <label className="block text-sm font-medium text-ink">Votre enchère</label>
            <div className="relative mt-1.5">
              <input type="number" value={bidInput} onChange={(e) => setBidInput(e.target.value)} className="block w-full rounded-md border border-line bg-paper py-3 pl-3 pr-12 text-lg font-bold text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent font-heading" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-ink-muted">DT</span>
            </div>
            <p className="mt-1.5 text-xs text-ink-muted">Enchère minimum : {(minBid / 1000).toLocaleString("fr-FR")} DT</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button onClick={handlePlaceBid} disabled={placing} data-testid="bid-submit" className="col-span-2 flex min-h-12 items-center justify-center rounded-md bg-accent px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60">
              {placing ? "En cours..." : testMode ? "Enchérir (mode test)" : "Enchérir maintenant"}
            </button>
            <button onClick={() => handleQuickBid(200)} disabled={placing} data-testid="bid-quick-200" className="flex min-h-12 items-center justify-center rounded-md border-2 border-accent bg-white px-4 py-3.5 text-sm font-bold text-accent transition-colors hover:bg-accent-tint disabled:opacity-60">
              +200 DT
            </button>
            <button onClick={() => handleQuickBid(500)} disabled={placing} data-testid="bid-quick-500" className="flex min-h-12 items-center justify-center rounded-md border-2 border-accent bg-white px-4 py-3.5 text-sm font-bold text-accent transition-colors hover:bg-accent-tint disabled:opacity-60">
              +500 DT
            </button>
            <button onClick={() => handleQuickBid(1000)} disabled={placing} data-testid="bid-quick-1000" className="col-span-2 flex min-h-12 items-center justify-center rounded-md border-2 border-accent bg-white px-4 py-3.5 text-sm font-bold text-accent transition-colors hover:bg-accent-tint disabled:opacity-60">
              +1 000 DT
            </button>
          </div>
        </>
      )}

      {state === "login" && (
        <div className="mt-5 rounded-lg bg-surface p-4 text-center">
          <p className="text-sm text-ink-secondary">Connectez-vous pour enchérir</p>
          <Link href="/connexion" className="mt-2 inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark">Connexion</Link>
        </div>
      )}

      {state === "pending" && (
        <div className="mt-5 rounded-lg bg-yellow-50 p-4 text-center">
          <p className="text-sm text-yellow-700">Votre vérification est en cours (24-48h)</p>
        </div>
      )}

      {state === "rejected" && (
        <div className="mt-5 rounded-lg bg-red-50 p-4 text-center">
          <p className="text-sm text-red-600">Votre vérification a échoué. Contactez le support.</p>
        </div>
      )}

      {state === "ended" && (
        <div className="mt-5 rounded-lg bg-surface p-4 text-center">
          <p className="text-lg font-bold text-ink font-heading">Enchère terminée</p>
        </div>
      )}

      {/* Watch / Share */}
      <div className="mt-5 flex items-center gap-3">
        <button onClick={() => setWatching((w) => !w)} className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-semibold transition-colors ${watching ? "border-red-200 bg-red-50 text-red-600" : "border-line bg-paper text-ink-secondary hover:bg-surface"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={watching ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          {watching ? "Suivie" : "Suivre"}
        </button>
        <button onClick={async () => { await navigator.clipboard.writeText(window.location.href); toast.success("Lien copié !"); }} className="flex flex-1 items-center justify-center gap-2 rounded-md border border-line bg-paper px-3 py-2.5 text-sm font-semibold text-ink-secondary transition-colors hover:bg-surface">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          Partager
        </button>
      </div>

      <BidConfirmModal
        open={confirmModal.open}
        amount={confirmModal.amount}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
        placing={placing}
      />
    </div>
  );
}
