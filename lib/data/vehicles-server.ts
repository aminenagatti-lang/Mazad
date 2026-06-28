/**
 * Server-side vehicle data helpers.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import type { VehicleWithAuction, VehicleDetail } from "./vehicles";

export async function getAllVehicles(): Promise<VehicleWithAuction[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select(`
      id, slug, status, marque, modele, version, annee, kilometrage,
      carburant, transmission, couleur, nb_portes, puissance_cv, origine,
      prix_depart, prix_reserve, description, inspection_date, inspection_score,
      auctions!inner(current_price, bid_count, ends_at),
      vehicle_photos(id, storage_path, is_cover, display_order)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("getAllVehicles error:", error?.message);
    return [];
  }

  return data.map((row: any) => ({
    ...row,
    current_price: row.auctions?.current_price ?? row.prix_depart,
    bid_count: row.auctions?.bid_count ?? 0,
    ends_at: row.auctions?.ends_at ?? new Date().toISOString(),
    photos: row.vehicle_photos ?? [],
  }));
}

export async function getVehicleBySlug(slug: string): Promise<VehicleDetail | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select(`
      *,
      auctions!inner(*),
      vehicle_photos(id, storage_path, is_cover, display_order),
      inspection_items(id, category, label, status, note),
      vehicle_documents(id, document_type, storage_path, file_name, uploaded_at),
      profiles!inner(id, first_name, last_name, company_name, seller_type, kyc_status)
    `)
    .eq("slug", slug)
    .eq("status", "active");

  if (error || !data || data.length === 0) {
    console.error("getVehicleBySlug error:", error?.message ?? "No data found");
    return null;
  }

  const row = data[0];
  const profile = row.profiles as any;
  return {
    ...row,
    current_price: row.auctions?.current_price ?? row.prix_depart,
    bid_count: row.auctions?.bid_count ?? 0,
    ends_at: row.auctions?.ends_at ?? new Date().toISOString(),
    photos: row.vehicle_photos ?? [],
    inspection_items: row.inspection_items ?? [],
    documents: row.vehicle_documents ?? [],
    seller_id: profile?.id ?? "",
    seller_first_name: profile?.first_name ?? null,
    seller_last_name: profile?.last_name ?? null,
    seller_company_name: profile?.company_name ?? null,
    seller_type: profile?.seller_type ?? null,
    seller_kyc_status: profile?.kyc_status ?? "pending",
  };
}

export async function getSimilarVehicles(excludeSlug: string, limit = 3): Promise<VehicleWithAuction[]> {
  const all = await getAllVehicles();
  return all.filter((v) => v.slug !== excludeSlug).slice(0, limit);
}
