import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
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

  if (error) {
    console.error("API /vehicles error:", error.message);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }

  const vehicles = (data || []).map((row: any) => ({
    ...row,
    current_price: row.auctions?.current_price ?? row.prix_depart,
    bid_count: row.auctions?.bid_count ?? 0,
    ends_at: row.auctions?.ends_at ?? new Date().toISOString(),
    photos: row.vehicle_photos ?? [],
  }));

  return NextResponse.json(vehicles);
}
