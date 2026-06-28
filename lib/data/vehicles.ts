/**
 * Vehicle types shared between server and client.
 */

export interface VehicleWithAuction {
  id: string;
  slug: string;
  status: string;
  marque: string;
  modele: string;
  version: string | null;
  annee: number;
  kilometrage: number;
  carburant: string;
  transmission: string;
  couleur: string | null;
  nb_portes: number | null;
  puissance_cv: number | null;
  origine: string;
  prix_depart: number;
  prix_reserve: number | null;
  description: string | null;
  inspection_date: string | null;
  inspection_score: number | null;
  current_price: number;
  bid_count: number;
  ends_at: string;
  photos: { id: string; storage_path: string; is_cover: boolean; display_order: number }[];
}

export interface VehicleDocument {
  id: string;
  document_type: string;
  storage_path: string;
  file_name: string | null;
  uploaded_at: string;
}

export interface VehicleDetail extends VehicleWithAuction {
  inspection_items: { id: string; category: string; label: string; status: "ok" | "warning" | "fail"; note: string | null }[];
  documents: VehicleDocument[];
  seller_id: string;
  seller_first_name: string | null;
  seller_last_name: string | null;
  seller_company_name: string | null;
  seller_type: string | null;
  seller_kyc_status: string;
}
