"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isTestMode } from "@/lib/test-mode";
import {
  getCurrentUser,
  fetchBuyerStats,
  fetchActiveBids,
  fetchBidHistory,
  fetchWatchlist,
  fetchSellerStats,
  fetchSellerListings,
  fetchSellerDrafts,
  fetchSellerSales,
  fetchAdminStats,
  fetchAdminActivities,
  fetchKycPending,
  updateProfile,
  approveKyc,
  rejectKyc,
  type UserProfile,
  type BuyerStats,
  type ActiveBid,
  type BidHistoryItem,
  type WatchlistItem,
  type SellerStats,
  type SellerListing,
  type SellerDraft,
  type SellerSale,
  type AdminStats,
  type AdminActivity,
  type KycPendingUser,
} from "./data";

export function useUser() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
      if (!u && !isTestMode()) {
        router.push("/connexion");
      }
    });
  }, [router]);

  return { user, loading };
}

export function useBuyerDashboard(userId: string | undefined) {
  const [stats, setStats] = useState<BuyerStats>({ activeBids: 0, wonAuctions: 0, lostAuctions: 0, totalSpent: 0 });
  const [activeBids, setActiveBids] = useState<ActiveBid[]>([]);
  const [history, setHistory] = useState<BidHistoryItem[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      fetchBuyerStats(userId).catch(() => ({ activeBids: 0, wonAuctions: 0, lostAuctions: 0, totalSpent: 0 })),
      fetchActiveBids(userId).catch(() => []),
      fetchBidHistory(userId).catch(() => []),
      fetchWatchlist(userId).catch(() => []),
    ]).then(([s, a, h, w]) => {
      setStats(s);
      setActiveBids(a);
      setHistory(h);
      setWatchlist(w);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [userId]);

  return { stats, activeBids, history, watchlist, loading };
}

export function useSellerDashboard(userId: string | undefined) {
  const [stats, setStats] = useState<SellerStats>({ activeListings: 0, soldVehicles: 0, totalRevenue: 0, totalCommission: 0 });
  const [listings, setListings] = useState<SellerListing[]>([]);
  const [drafts, setDrafts] = useState<SellerDraft[]>([]);
  const [sales, setSales] = useState<SellerSale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      fetchSellerStats(userId).catch(() => ({ activeListings: 0, soldVehicles: 0, totalRevenue: 0, totalCommission: 0 })),
      fetchSellerListings(userId).catch(() => []),
      fetchSellerDrafts(userId).catch(() => []),
      fetchSellerSales(userId).catch(() => []),
    ]).then(([s, l, d, sa]) => {
      setStats(s);
      setListings(l);
      setDrafts(d);
      setSales(sa);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [userId]);

  return { stats, listings, drafts, sales, loading };
}

export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, buyers: 0, sellers: 0, kycPending: 0, activeVehicles: 0, activeAuctions: 0 });
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [kycPending, setKycPending] = useState<KycPendingUser[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = () => {
    setLoading(true);
    Promise.all([
      fetchAdminStats().catch(() => ({ totalUsers: 0, buyers: 0, sellers: 0, kycPending: 0, activeVehicles: 0, activeAuctions: 0 })),
      fetchAdminActivities().catch(() => []),
      fetchKycPending().catch(() => []),
    ]).then(([s, a, k]) => {
      setStats(s);
      setActivities(a);
      setKycPending(k);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  return { stats, activities, kycPending, loading, refresh };
}

export function useProfile(userId: string | undefined) {
  const [saving, setSaving] = useState(false);

  const save = async (updates: Partial<UserProfile>) => {
    if (!userId) return { success: false, error: "No user" };
    setSaving(true);
    const res = await updateProfile(userId, updates);
    setSaving(false);
    return res;
  };

  return { save, saving };
}

export function useKycActions() {
  const [processing, setProcessing] = useState<string | null>(null);

  const approve = async (userId: string) => {
    setProcessing(userId);
    const res = await approveKyc(userId);
    setProcessing(null);
    return res;
  };

  const reject = async (userId: string, reason: string) => {
    setProcessing(userId);
    const res = await rejectKyc(userId, reason);
    setProcessing(null);
    return res;
  };

  return { approve, reject, processing };
}
