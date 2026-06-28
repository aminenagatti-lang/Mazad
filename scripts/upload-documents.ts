import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fkjjxewilfdrhbnsglrn.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TMP_DIR = path.join(process.cwd(), "scripts", "tmp-docs");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

function createMinimalPDF(title: string): Buffer {
  const content = `BT /F1 12 Tf 100 700 Td (${title}) Tj ET`;
  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length ${content.length} >>
stream
${content}
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000214 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
313
%%EOF`;
  return Buffer.from(pdf, "utf-8");
}

async function main() {
  // Ensure bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const hasBucket = buckets?.some((b) => b.name === "vehicle-documents");
  if (!hasBucket) {
    console.log("Creating bucket vehicle-documents...");
    await supabase.storage.createBucket("vehicle-documents", { public: true });
    console.log("✅ Bucket created");
  }

  const { data: vehicles, error } = await supabase.from("vehicles").select("id, slug, marque, modele");
  if (error || !vehicles) {
    console.error("Failed to fetch vehicles:", error?.message);
    process.exit(1);
  }

  for (const v of vehicles as any[]) {
    const cleanSlug = v.slug
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9-]/g, "-")
      .replace(/-+/g, "-");
    const fileName = `controle-technique-${cleanSlug}.pdf`;
    const storagePath = `${v.id}/${fileName}`;

    // Check if already exists
    const { data: existing } = await supabase
      .from("vehicle_documents")
      .select("id")
      .eq("vehicle_id", v.id)
      .eq("document_type", "rapport_inspection")
      .single();

    if (existing) {
      console.log(`  ⏭️  Document already exists for ${v.marque} ${v.modele}`);
      continue;
    }

    const pdfBuffer = createMinimalPDF(`Rapport Controle Technique - ${v.marque} ${v.modele}`);
    const localPath = path.join(TMP_DIR, fileName);
    fs.writeFileSync(localPath, pdfBuffer);

    console.log(`  📤 Uploading ${fileName}...`);
    const { error: uploadError } = await supabase.storage
      .from("vehicle-documents")
      .upload(storagePath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error(`  ❌ Upload failed:`, uploadError.message);
      continue;
    }

    const { error: insertError } = await supabase.from("vehicle_documents").insert({
      vehicle_id: v.id,
      document_type: "rapport_inspection",
      storage_path: storagePath,
      file_name: fileName,
    });

    if (insertError) {
      console.error(`  ❌ DB insert failed:`, insertError.message);
    } else {
      console.log(`  ✅ Document inserted for ${v.marque} ${v.modele}`);
    }
  }

  console.log("\n📊 Done!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
