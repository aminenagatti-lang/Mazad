import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fkjjxewilfdrhbnsglrn.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data } = await supabase.from("vehicles").select("id, slug");
  const slugs = (data || []).map((v: any) => v.slug);
  const duplicates = slugs.filter((item, index) => slugs.indexOf(item) !== index);
  console.log("Slugs:", slugs);
  console.log("Duplicates:", duplicates);
}

main();
