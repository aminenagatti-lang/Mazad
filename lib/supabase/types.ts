export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "buyer" | "seller" | "admin";
export type SellerType = "particulier" | "entreprise";
export type KycStatus = "pending" | "verified" | "rejected";
export type VehicleStatus = "draft" | "pending_inspection" | "active" | "sold" | "unsold" | "cancelled";
export type AuctionStatus = "scheduled" | "active" | "ended" | "cancelled";
export type BidStatus = "active" | "outbid" | "won" | "cancelled";
export type DocumentType = "cin_recto" | "cin_verso" | "selfie" | "rib" | "patente" | "statuts" | "carte_grise" | "rapport_inspection";
export type Transmission = "manuelle" | "automatique";
export type FuelType = "essence" | "diesel" | "hybride" | "electrique" | "gpl";

export interface Profile {
  id: string;
  role: UserRole;
  seller_type: SellerType | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  city: string | null;
  company_name: string | null;
  matricule_fiscal: string | null;
  secteur: string | null;
  representant_legal: string | null;
  adresse_siege: string | null;
  kyc_status: KycStatus;
  kyc_submitted_at: string | null;
  kyc_verified_at: string | null;
  kyc_rejection_reason: string | null;
  // deposit
  deposit_paid: boolean;
  deposit_amount: number | null;
  deposit_paid_at: string | null;
  // notifications
  email_notifications: boolean;
  sms_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface KycDocument {
  id: string;
  user_id: string;
  document_type: DocumentType;
  storage_path: string;
  file_name: string | null;
  file_size: number | null;
  uploaded_at: string;
  verified: boolean;
}

export interface Vehicle {
  id: string;
  seller_id: string;
  status: VehicleStatus;
  marque: string;
  modele: string;
  version: string | null;
  annee: number;
  kilometrage: number;
  carburant: FuelType;
  transmission: Transmission;
  couleur: string | null;
  nb_portes: number | null;
  puissance_cv: number | null;
  origine: string | null;
  prix_depart: number;
  prix_reserve: number | null;
  description: string | null;
  slug: string | null;
  inspection_date: string | null;
  inspection_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface VehiclePhoto {
  id: string;
  vehicle_id: string;
  storage_path: string;
  is_cover: boolean;
  display_order: number;
  uploaded_at: string;
}

export interface VehicleDocument {
  id: string;
  vehicle_id: string;
  document_type: DocumentType;
  storage_path: string;
  file_name: string | null;
  uploaded_at: string;
}

export interface InspectionItem {
  id: string;
  vehicle_id: string;
  category: string;
  label: string;
  status: "ok" | "warning" | "fail";
  note: string | null;
}

export interface Auction {
  id: string;
  vehicle_id: string;
  status: AuctionStatus;
  starts_at: string;
  ends_at: string;
  current_price: number;
  bid_count: number;
  winner_id: string | null;
  created_at: string;
}

export interface Bid {
  id: string;
  auction_id: string;
  bidder_id: string;
  amount: number;
  status: BidStatus;
  placed_at: string;
}

export interface WatchlistItem {
  user_id: string;
  auction_id: string;
  added_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  read: boolean;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/*  Wallet System (Production)                                        */
/* ------------------------------------------------------------------ */

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  status: "active" | "frozen" | "forfeited";
  deposit_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: "deposit" | "refund" | "reserve" | "commission" | "forfeit" | "release";
  amount: number;
  payment_method: "konnect" | "flouci" | "virement";
  external_ref: string | null;
  status: "pending" | "completed" | "failed";
  proof_url: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  completed_at: string | null;
}

export interface CommissionPayment {
  id: string;
  auction_id: string;
  user_id: string;
  total_commission: number;
  caution_credit: number;
  remaining_amount: number;
  status: "pending" | "paid" | "forfeited";
  paid_at: string | null;
  forfeited_at: string | null;
  due_at: string;
  created_at: string;
}

export interface SellerRelease {
  id: string;
  auction_id: string;
  seller_id: string;
  buyer_id: string;
  commission_payment_id: string | null;
  coordinates_released_at: string | null;
  proof_url: string | null;
  notes: string | null;
  created_at: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: "konnect" | "flouci" | "virement";
  provider_ref: string | null;
  rib: string | null;
  is_default: boolean;
  created_at: string;
}
