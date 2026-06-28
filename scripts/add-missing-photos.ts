import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fkjjxewilfdrhbnsglrn.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PHOTO_MAP: Record<string, string[]> = {
  "peugeot-308-allure-2020": [
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800&q=80",
  ],
  "renault-clio-iv-intens-2018": [
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
  ],
  "volkswagen-passat-carat-2020": [
    "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800&q=80",
    "https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80",
  ],
  "ford-ranger-wildtrak-2021": [
    "https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80",
  ],
  "hyundai-tucson-executive-2019": [
    "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800&q=80",
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
  ],
  "bmw-serie-3-320d-m-sport-2019": [
    "https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80",
    "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800&q=80",
  ],
  "toyota-corolla-design-2021": [
    "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800&q=80",
  ],
  "mercedes-classe-c-220d-avantgarde-2020": [
    "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800&q=80",
    "https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80",
  ],
  "kia-sportage-gt-line-2020": [
    "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800&q=80",
  ],
  "citroen-c5-aircross-shine-2021": [
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800&q=80",
  ],
};

async function main() {
  const { data: vehicles, error } = await supabase.from("vehicles").select("id, slug");
  if (error || !vehicles) {
    console.error("Failed to fetch vehicles:", error?.message);
    process.exit(1);
  }

  let inserted = 0;
  for (const v of vehicles) {
    const photos = PHOTO_MAP[v.slug];
    if (!photos) {
      console.log(`  ⚠️  No photo map for ${v.slug}`);
      continue;
    }

    // Check existing photos
    const { data: existing } = await supabase.from("vehicle_photos").select("id").eq("vehicle_id", v.id);
    if (existing && existing.length > 0) {
      console.log(`  ⏭️  Photos already exist for ${v.slug}`);
      continue;
    }

    for (let p = 0; p < photos.length; p++) {
      const { error: insertErr } = await supabase.from("vehicle_photos").insert({
        vehicle_id: v.id,
        storage_path: photos[p],
        is_cover: p === 0,
        display_order: p,
      });
      if (insertErr) {
        console.error(`  ❌ Failed to insert photo for ${v.slug}:`, insertErr.message);
      } else {
        inserted++;
      }
    }
    console.log(`  ✅ Inserted ${photos.length} photos for ${v.slug}`);
  }

  console.log(`\n📊 Total photos inserted: ${inserted}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
