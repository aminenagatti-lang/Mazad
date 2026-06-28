import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
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
    console.error("API /vehicles/[slug] error:", error?.message);
    return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  }

  const row = data[0];
  const profile = row.profiles as any;
  const vehicle = {
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

  return NextResponse.json(vehicle);
}
