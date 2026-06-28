import { supabase } from "@/lib/supabase/client";
import { isTestMode } from "@/lib/test-mode";
import {
  approveKyc as approveKycServer,
  rejectKyc as rejectKycServer,
} from "@/app/actions/admin";
import { updateProfile as updateProfileServer } from "@/app/actions/profile";
import {
  demoUser,
  demoBuyerStats,
  demoActiveBids,
  demoBidHistory,
  demoWatchlist,
  demoSellerStats,
  demoSellerListings,
  demoSellerDrafts,
  demoSellerSales,
  demoAdminStats,
  demoAdminActivities,
  demoKycPending,
} from "./demo-data";

/* ------------------------------------------------------------------ */
/*  Supabase query result helpers (avoid any)                         */
/* ------------------------------------------------------------------ */

interface ActiveBidRow {
  amount: number;
  status: string;
  auctions: {
    id: string;
    current_price: number;
    ends_at: string;
    vehicle: { slug: string; marque: string; modele: string; annee: number } | null;
  } | null;
}

interface BidHistoryRow {
  amount: number;
  status: string;
  auctions: {
    id: string;
    vehicle: { slug: string; marque: string; modele: string; annee: number; created_at: string } | null;
  } | null;
}

interface WatchlistRow {
  auction: {
    current_price: number;
    ends_at: string;
    vehicle: { slug: string; marque: string; modele: string; annee: number } | null;
  } | null;
}

interface SellerAuctionRow {
  id: string;
  marque: string | null;
  modele: string | null;
  annee: number | null;
  prix_depart: number | null;
  auctions: { current_price: number; bid_count: number; ends_at: string; status: string } | null;
}

interface SellerVehicleRow {
  id: string;
  marque: string | null;
  modele: string | null;
  annee: number | null;
  status: string;
  created_at: string;
}

interface SellerSaleRow {
  id: string;
  marque: string | null;
  modele: string | null;
  annee: number | null;
  auctions: { current_price: number; winner_id: string | null; created_at: string } | null;
}

interface AdminActivityRow {
  type: string;
  title: string;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  city: string | null;
  role: "buyer" | "seller" | "admin";
  seller_type: "particulier" | "entreprise" | null;
  company_name: string | null;
  kyc_status: "pending" | "verified" | "rejected";
  deposit_paid: boolean;
  deposit_amount: number | null;
  created_at: string;
}

export interface BuyerStats {
  activeBids: number;
  wonAuctions: number;
  lostAuctions: number;
  totalSpent: number;
}

export interface ActiveBid {
  auctionId: string;
  vehicleSlug: string;
  vehicleName: string;
  myBid: number;
  currentBid: number;
  status: "leading" | "outbid";
  endsAt: string;
}

export interface BidHistoryItem {
  auctionId: string;
  vehicleSlug: string;
  vehicleName: string;
  finalAmount: number;
  status: "won" | "lost";
  date: string;
}

export interface WatchlistItem {
  slug: string;
  name: string;
  year: number;
  currentPrice: number;
  endsAt: string;
}

export interface SellerStats {
  activeListings: number;
  soldVehicles: number;
  totalRevenue: number;
  totalCommission: number;
}

export interface SellerListing {
  id: string;
  vehicleName: string;
  prixDepart: number;
  currentBid: number;
  bidCount: number;
  endsAt: string;
  status: "active" | "ended" | "cancelled";
}

export interface SellerDraft {
  id: string;
  vehicleName: string;
  status: string;
  submittedAt: string;
}

export interface SellerSale {
  id: string;
  vehicleName: string;
  prixAdjudication: number;
  commission: number;
  net: number;
  buyer: string;
  date: string;
}

export interface AdminStats {
  totalUsers: number;
  buyers: number;
  sellers: number;
  kycPending: number;
  activeVehicles: number;
  activeAuctions: number;
}

export interface AdminActivity {
  icon: string;
  text: string;
  time: string;
}

export interface KycPendingUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  city: string | null;
  role: "buyer" | "seller" | "admin";
  company_name: string | null;
  seller_type: string | null;
  kyc_status: "pending" | "verified" | "rejected";
  deposit_paid: boolean;
  deposit_amount: number | null;
  created_at: string;
  kyc_submitted_at: string | null;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Il y a ${hrs}h`;
  return `Il y a ${Math.floor(hrs / 24)}j`;
}

/* ------------------------------------------------------------------ */
/*  Auth                                                               */
/* ------------------------------------------------------------------ */

export async function getCurrentUser(): Promise<UserProfile | null> {
  if (isTestMode()) return demoUser;
  try {
    // Use the /api/me endpoint which uses the admin client to bypass
    // the RLS infinite-recursion bug on the profiles table.
    const res = await fetch("/api/me", { credentials: "include" });
    if (!res.ok) return null;
    const json = (await res.json()) as { user: UserProfile | null };
    return json.user;
  } catch {
    return null;
  }
}

export async function signOut() {
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
}

/* ------------------------------------------------------------------ */
/*  Buyer                                                              */
/* ------------------------------------------------------------------ */

export async function fetchBuyerStats(userId: string): Promise<BuyerStats> {
  if (isTestMode()) return demoBuyerStats;
  try {
    const now = new Date().toISOString();

    const { data: active } = await supabase
      .from("bids")
      .select("auction_id")
      .eq("bidder_id", userId)
      .in("status", ["active", "outbid"]);

    const { data: won } = await supabase
      .from("bids")
      .select("auction_id")
      .eq("bidder_id", userId)
      .eq("status", "won");

    const { data: lost } = await supabase
      .from("bids")
      .select("auction_id")
      .eq("bidder_id", userId)
      .eq("status", "lost");

    const { data: spent } = await supabase
      .from("bids")
      .select("amount")
      .eq("bidder_id", userId)
      .eq("status", "won");

    return {
      activeBids: active?.length ?? 0,
      wonAuctions: won?.length ?? 0,
      lostAuctions: lost?.length ?? 0,
      totalSpent: (spent ?? []).reduce((sum, b) => sum + (b.amount ?? 0), 0),
    };
  } catch {
    return { activeBids: 0, wonAuctions: 0, lostAuctions: 0, totalSpent: 0 };
  }
}

export async function fetchActiveBids(userId: string): Promise<ActiveBid[]> {
  if (isTestMode()) return demoActiveBids;
  try {
    const { data } = await supabase
      .from("bids")
      .select("amount, status, auctions(id, current_price, ends_at, vehicle:vehicles(id, slug, marque, modele, annee))")
      .eq("bidder_id", userId)
      .in("status", ["active", "outbid"]);

    const rows = (data ?? []) as unknown as ActiveBidRow[];
    return rows.map((b) => ({
      auctionId: b.auctions?.id ?? "",
      vehicleSlug: b.auctions?.vehicle?.slug ?? "",
      vehicleName: `${b.auctions?.vehicle?.marque ?? ""} ${b.auctions?.vehicle?.modele ?? ""} ${b.auctions?.vehicle?.annee ?? ""}`.trim(),
      myBid: b.amount,
      currentBid: b.auctions?.current_price ?? b.amount,
      status: b.status as "leading" | "outbid",
      endsAt: b.auctions?.ends_at ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function fetchBidHistory(userId: string): Promise<BidHistoryItem[]> {
  if (isTestMode()) return demoBidHistory;
  try {
    const { data } = await supabase
      .from("bids")
      .select("amount, status, auctions(id, vehicle:vehicles(id, slug, marque, modele, annee, created_at))")
      .eq("bidder_id", userId)
      .in("status", ["won", "lost"]);

    const rows = (data ?? []) as unknown as BidHistoryRow[];
    return rows.map((b) => ({
      auctionId: b.auctions?.id ?? "",
      vehicleSlug: b.auctions?.vehicle?.slug ?? "",
      vehicleName: `${b.auctions?.vehicle?.marque ?? ""} ${b.auctions?.vehicle?.modele ?? ""} ${b.auctions?.vehicle?.annee ?? ""}`.trim(),
      finalAmount: b.amount,
      status: b.status as "won" | "lost",
      date: b.auctions?.vehicle?.created_at ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function fetchWatchlist(userId: string): Promise<WatchlistItem[]> {
  if (isTestMode()) return demoWatchlist;
  try {
    const { data } = await supabase
      .from("watchlist")
      .select("auction:auctions(current_price, ends_at, vehicle:vehicles(slug, marque, modele, annee))")
      .eq("user_id", userId);

    const rows = (data ?? []) as unknown as WatchlistRow[];
    return rows.map((w) => ({
      slug: w.auction?.vehicle?.slug ?? "",
      name: `${w.auction?.vehicle?.marque ?? ""} ${w.auction?.vehicle?.modele ?? ""}`.trim(),
      year: w.auction?.vehicle?.annee ?? 0,
      currentPrice: w.auction?.current_price ?? 0,
      endsAt: w.auction?.ends_at ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Seller                                                             */
/* ------------------------------------------------------------------ */

export async function fetchSellerStats(userId: string): Promise<SellerStats> {
  if (isTestMode()) return demoSellerStats;
  try {
    const { data: active } = await supabase
      .from("vehicles")
      .select("id")
      .eq("seller_id", userId)
      .eq("status", "active");

    const { data: sold } = await supabase
      .from("vehicles")
      .select("id")
      .eq("seller_id", userId)
      .eq("status", "sold");

    const { data: revenue } = await supabase
      .from("vehicles")
      .select("auctions(current_price)")
      .eq("seller_id", userId)
      .eq("status", "sold")
      .not("auctions", "is", null);

    const total = (revenue ?? []).reduce((sum, v) => {
      const auctionPrice = (v.auctions as { current_price?: number } | null)?.current_price ?? 0;
      return sum + auctionPrice;
    }, 0);

    // Commission buyer 2% (min 200 DT) — seller pays nothing in this model
    const commission = total > 0 ? Math.max(Math.round(total * 0.02), 200000) : 0;

    return {
      activeListings: active?.length ?? 0,
      soldVehicles: sold?.length ?? 0,
      totalRevenue: total,
      totalCommission: commission,
    };
  } catch {
    return { activeListings: 0, soldVehicles: 0, totalRevenue: 0, totalCommission: 0 };
  }
}

export async function fetchSellerListings(userId: string): Promise<SellerListing[]> {
  if (isTestMode()) return demoSellerListings;
  try {
    const { data } = await supabase
      .from("vehicles")
      .select("id, marque, modele, annee, prix_depart, status, auctions(current_price, bid_count, ends_at, status)")
      .eq("seller_id", userId)
      .in("status", ["active", "sold"]);

    const rows = (data ?? []) as unknown as SellerAuctionRow[];
    return rows.map((v) => {
      const a = v.auctions;
      return {
        id: v.id,
        vehicleName: `${v.marque ?? ""} ${v.modele ?? ""} ${v.annee ?? ""}`.trim(),
        prixDepart: v.prix_depart ?? 0,
        currentBid: a?.current_price ?? 0,
        bidCount: a?.bid_count ?? 0,
        endsAt: a?.ends_at ?? new Date().toISOString(),
        status: (a?.status as "active" | "ended" | "cancelled") ?? "active",
      };
    });
  } catch {
    return [];
  }
}

export async function fetchSellerDrafts(userId: string): Promise<SellerDraft[]> {
  if (isTestMode()) return demoSellerDrafts;
  try {
    const { data } = await supabase
      .from("vehicles")
      .select("id, marque, modele, annee, status, created_at")
      .eq("seller_id", userId)
      .in("status", ["draft", "pending_inspection"]);

    const rows = (data ?? []) as unknown as SellerVehicleRow[];
    return rows.map((v) => ({
      id: v.id,
      vehicleName: `${v.marque ?? ""} ${v.modele ?? ""} ${v.annee ?? ""}`.trim(),
      status: v.status,
      submittedAt: v.created_at ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function fetchSellerSales(userId: string): Promise<SellerSale[]> {
  if (isTestMode()) return demoSellerSales;
  try {
    const { data } = await supabase
      .from("vehicles")
      .select("id, marque, modele, annee, auctions(current_price, winner_id, created_at)")
      .eq("seller_id", userId)
      .eq("status", "sold");

    const rows = (data ?? []) as unknown as SellerSaleRow[];
    return rows.map((v) => {
      const a = v.auctions;
      const price = a?.current_price ?? 0;
      // Commission buyer 2% (min 200 DT)
      const commission = price > 0 ? Math.max(Math.round(price * 0.02), 200000) : 0;
      return {
        id: v.id ?? "",
        vehicleName: `${v.marque ?? ""} ${v.modele ?? ""} ${v.annee ?? ""}`.trim(),
        prixAdjudication: price,
        commission,
        net: price - commission,
        buyer: a?.winner_id ? "A***i" : "—",
        date: a?.created_at ?? new Date().toISOString(),
      };
    });
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Admin                                                              */
/* ------------------------------------------------------------------ */

export async function fetchAdminStats(): Promise<AdminStats> {
  if (isTestMode()) return demoAdminStats;
  try {
    const res = await fetch("/api/admin/stats", { credentials: "include" });
    if (!res.ok) return { totalUsers: 0, buyers: 0, sellers: 0, kycPending: 0, activeVehicles: 0, activeAuctions: 0 };
    return await res.json();
  } catch {
    return { totalUsers: 0, buyers: 0, sellers: 0, kycPending: 0, activeVehicles: 0, activeAuctions: 0 };
  }
}

export async function fetchAdminActivities(): Promise<AdminActivity[]> {
  if (isTestMode()) return demoAdminActivities;
  try {
    const { data } = await supabase
      .from("notifications")
      .select("type, title, created_at")
      .eq("type", "system")
      .order("created_at", { ascending: false })
      .limit(10);

    const rows = (data ?? []) as unknown as AdminActivityRow[];
    return rows.map((n) => ({
      icon: "gavel",
      text: n.title ?? "Activité système",
      time: timeAgo(n.created_at),
    }));
  } catch {
    return [];
  }
}

export async function fetchKycPending(): Promise<KycPendingUser[]> {
  if (isTestMode()) return demoKycPending;
  try {
    const res = await fetch("/api/admin/kyc-pending", { credentials: "include" });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.profiles ?? []).map((p: Record<string, unknown>) => ({
      id: p.id as string,
      email: "",
      first_name: p.first_name as string | null,
      last_name: p.last_name as string | null,
      phone: p.phone as string | null,
      city: p.city as string | null,
      role: p.role as "buyer" | "seller" | "admin",
      company_name: p.company_name as string | null,
      seller_type: p.seller_type as string | null,
      kyc_status: p.kyc_status as "pending" | "verified" | "rejected",
      deposit_paid: (p.deposit_paid as boolean) ?? false,
      deposit_amount: p.deposit_amount as number | null,
      created_at: p.created_at as string,
      kyc_submitted_at: p.kyc_submitted_at as string | null,
    }));
  } catch {
    return [];
  }
}

export async function approveKyc(userId: string) {
  if (isTestMode()) return { success: true, error: null };
  try {
    const result = await approveKycServer(userId);
    return { success: !result.error, error: result.error ?? null };
  } catch {
    return { success: false, error: "Erreur serveur" };
  }
}

export async function rejectKyc(userId: string, reason: string) {
  if (isTestMode()) return { success: true, error: null };
  try {
    const result = await rejectKycServer(userId, reason);
    return { success: !result.error, error: result.error ?? null };
  } catch {
    return { success: false, error: "Erreur serveur" };
  }
}

/* ------------------------------------------------------------------ */
/*  Profile                                                            */
/* ------------------------------------------------------------------ */

export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
  if (isTestMode()) return { success: true, error: null };
  try {
    const result = await updateProfileServer(userId, updates as Record<string, unknown>);
    return { success: result.success, error: result.error ?? null };
  } catch {
    return { success: false, error: "Erreur serveur" };
  }
}
