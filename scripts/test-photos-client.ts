import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fkjjxewilfdrhbnsglrn.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_0Lky0zPnDLxOkvB7BJGOjA_PnIOFnjf";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  const { data, error } = await supabase
    .from("vehicles")
    .select(`
      id, slug, status, marque, modele,
      auctions!inner(current_price, bid_count, ends_at),
      vehicle_photos(id, storage_path, is_cover, display_order)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error:", error.message);
    return;
  }

  console.log("Vehicles returned:", data.length);
  for (const v of data as any[]) {
    const photos = v.vehicle_photos || [];
    console.log(v.slug, "photos:", photos.length, photos.map((p: any) => p.storage_path).join(", "));
  }
}

main().catch(console.error);
