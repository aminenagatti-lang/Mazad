import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fkjjxewilfdrhbnsglrn.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TMP_DIR = path.join(process.cwd(), "scripts", "tmp-photos");
const SOURCE_IMAGE = path.join(TMP_DIR, "peugeot-308-allure-2020-0.jpg");

// Hue rotation per vehicle (degrees)
const HUE_MAP: Record<string, number[]> = {
  "peugeot-308-allure-2020": [0, 180],
  "renault-clio-iv-intens-2018": [30],
  "volkswagen-passat-carat-2020": [60, 240],
  "ford-ranger-wildtrak-2021": [90],
  "hyundai-tucson-executive-2019": [120, 300],
  "bmw-serie-3-320d-m-sport-2019": [150, 330],
  "toyota-corolla-design-2021": [210],
  "mercedes-classe-c-220d-avantgarde-2020": [270, 45],
  "kia-sportage-gt-line-2020": [315],
  "citroen-c5-aircross-shine-2021": [0, 180],
};

function cleanName(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

async function main() {
  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error("Source image not found:", SOURCE_IMAGE);
    process.exit(1);
  }

  const { data: vehicles, error } = await supabase
    .from("vehicles")
    .select("id, slug, vehicle_photos(id, storage_path, is_cover, display_order)");
  if (error || !vehicles) {
    console.error("Failed to fetch vehicles:", error?.message);
    process.exit(1);
  }

  for (const v of vehicles as any[]) {
    const photos = v.vehicle_photos || [];
    const hues = HUE_MAP[cleanName(v.slug)] || [0];

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      if (!photo.storage_path.startsWith("http")) {
        console.log(`  ⏭️  Already local: ${photo.storage_path}`);
        continue;
      }

      const hue = hues[i % hues.length];
      const fileName = `${cleanName(v.slug)}-${i}.jpg`;
      const localPath = path.join(TMP_DIR, fileName);

      console.log(`  🎨 Generating ${fileName} (hue ${hue}°)...`);
      await sharp(SOURCE_IMAGE).modulate({ hue }).toFile(localPath);

      const fileBuffer = fs.readFileSync(localPath);
      const storagePath = `${v.id}/${fileName}`;

      console.log(`  📤 Uploading to ${storagePath}...`);
      const { error: uploadError } = await supabase.storage
        .from("vehicle-photos")
        .upload(storagePath, fileBuffer, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error(`  ❌ Upload failed:`, uploadError.message);
        continue;
      }

      const { error: updateError } = await supabase
        .from("vehicle_photos")
        .update({ storage_path: storagePath })
        .eq("id", photo.id);

      if (updateError) {
        console.error(`  ❌ DB update failed:`, updateError.message);
      } else {
        console.log(`  ✅ Updated DB: ${storagePath}`);
      }
    }
  }

  console.log("\n📊 Done!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
