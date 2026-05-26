"use client";

import { motion } from "framer-motion";

interface Bid {
  bidder_id: string;
  amount: number;
  placed_at: string;
}

interface BidHistoryProps {
  bids: Bid[];
  bidCount: number;
}

function anonymize(name: string): string {
  if (!name || name.length < 3) return "Anonyme";
  return name.charAt(0) + "***" + name.charAt(name.length - 1);
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Il y a ${hrs}h`;
  return `Il y a ${Math.floor(hrs / 24)}j`;
}

export function BidHistory({ bids, bidCount }: BidHistoryProps) {
  const display = bids.slice(0, 10);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-ink font-heading">Historique des enchères</h2>
        <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-bold text-ink-secondary">{bidCount}</span>
      </div>

      {display.length > 0 ? (
        <table className="mt-4 w-full">
          <thead>
            <tr className="border-b border-line text-left">
              <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Enchérisseur</th>
              <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-ink-muted">Montant</th>
              <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-ink-muted">Heure</th>
            </tr>
          </thead>
          <tbody>
            {display.map((bid, i) => (
              <motion.tr
                key={`${bid.bidder_id}-${bid.placed_at}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-line last:border-0"
              >
                <td className="py-3 text-sm font-medium text-ink">{anonymize(bid.bidder_id)}</td>
                <td className="py-3 text-right text-sm font-bold text-accent font-heading">
                  {(bid.amount / 1000).toLocaleString("fr-FR")} DT
                </td>
                <td className="py-3 text-right text-xs text-ink-muted">{timeAgo(bid.placed_at)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-4 text-sm text-ink-muted">Soyez le premier à enchérir !</p>
      )}
    </div>
  );
}
