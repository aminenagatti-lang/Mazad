"use client";

import { useState } from "react";
import { BidCard } from "@/components/vehicle/bid-card";
import { BidHistory } from "@/components/vehicle/bid-history";
import type { Auction, Profile } from "@/lib/supabase/types";

interface BidManagerProps {
  auction: Auction;
  currentUser: Profile | null;
  initialBids: { bidder_id: string; amount: number; placed_at: string }[];
  initialBidCount: number;
  children: React.ReactNode;
}

export function BidManager({
  auction,
  currentUser,
  initialBids,
  initialBidCount,
  children,
}: BidManagerProps) {
  const [liveBids, setLiveBids] = useState(initialBids);
  const [liveBidCount, setLiveBidCount] = useState(initialBidCount);

  const handleBidPlaced = (amount: number) => {
    const newBid = {
      bidder_id: "moi",
      amount,
      placed_at: new Date().toISOString(),
    };
    setLiveBids((prev) => [newBid, ...prev]);
    setLiveBidCount((c) => c + 1);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
      <div>
        {children}
        <BidHistory bids={liveBids} bidCount={liveBidCount} />
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <BidCard
          auction={auction}
          currentUser={currentUser}
          onBidPlaced={handleBidPlaced}
        />
      </aside>
    </div>
  );
}
