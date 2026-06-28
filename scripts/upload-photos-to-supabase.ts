import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fkjjxewilfdrhbnsglrn.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TMP_DIR = path.join(process.cwd(), "scripts", "tmp-photos");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

function cleanName(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

async function downloadFile(url: string, dest: string): Promise<void> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Status ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buffer);
}

async function main() {
  const { data: vehicles, error } = await supabase
    .from("vehicles")
    .select("id, slug, vehicle_photos(id, storage_path, is_cover, display_order)");
  if (error || !vehicles) {
    console.error("Failed to fetch vehicles:", error?.message);
    process.exit(1);
  }

  for (const v of vehicles as any[]) {
    const photos = v.vehicle_photos || [];
    if (photos.length === 0) continue;

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      if (!photo.storage_path.startsWith("http")) {
        console.log(`  ⏭️  Already local: ${photo.storage_path}`);
        continue;
      }

      const url = photo.storage_path;
      const fileName = `${cleanName(v.slug)}-${i}.jpg`;
      const localPath = path.join(TMP_DIR, fileName);

      console.log(`  ⬇️  Downloading ${url}...`);
      try {
        await downloadFile(url, localPath);
      } catch (err) {
        console.error(`  ❌ Download failed:`, err);
        continue;
      }

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
