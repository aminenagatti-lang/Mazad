/**
 * Verification script for MazadAuto seed data
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fkjjxewilfdrhbnsglrn.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function countRows(table: string): Promise<number> {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) {
    console.error(`  Error counting ${table}:`, error.message);
    return -1;
  }
  return count ?? 0;
}

async function verify() {
  console.log("🔍 MazadAuto Database Integrity Verification\n");
  console.log("═══════════════════════════════════════════\n");

  let errors = 0;

  // 1. Row counts
  console.log("📊 Table Row Counts");
  console.log("───────────────────");
  const counts = [
    { table: "profiles", expected: 3 },
    { table: "vehicles", expected: 10 },
    { table: "vehicle_photos", expected: 16 },
    { table: "inspection_items", expected: 60 },
    { table: "auctions", expected: 10 },
    { table: "bids", expected: 25 },
    { table: "wallets", expected: 2 },
    { table: "wallet_transactions", expected: 0 },
    { table: "commission_payments", expected: 0 },
    { table: "seller_releases", expected: 0 },
    { table: "payment_methods", expected: 0 },
    { table: "watchlist", expected: 0 },
    { table: "notifications", expected: 0 },
  ];

  for (const c of counts) {
    const actual = await countRows(c.table);
    const ok = actual === c.expected;
    console.log(`  ${c.table.padEnd(25)} ${actual.toString().padStart(3)} / ${c.expected.toString().padStart(3)} ${ok ? "✅" : "❌"}`);
    if (!ok) errors++;
  }
  console.log();

  // 2. Vehicle sanity checks
  console.log("🚗 Vehicle Sanity Checks");
  console.log("────────────────────────");
  const { data: vehicles } = await supabase.from("vehicles").select("*");
  if (!vehicles || vehicles.length !== 10) {
    console.log("  ❌ Vehicle count mismatch");
    errors++;
  } else {
    const allActive = vehicles.every((v: any) => v.status === "active");
    const allHaveSlug = vehicles.every((v: any) => v.slug && v.slug.length > 0);
    const allHavePrice = vehicles.every((v: any) => v.prix_depart > 0);
    const uniqueSlugs = new Set(vehicles.map((v: any) => v.slug)).size === vehicles.length;

    console.log(`  All status = active       ${allActive ? "✅" : "❌"}`);
    console.log(`  All have slug             ${allHaveSlug ? "✅" : "❌"}`);
    console.log(`  All have prix_depart      ${allHavePrice ? "✅" : "❌"}`);
    console.log(`  Slugs are unique          ${uniqueSlugs ? "✅" : "❌"}`);
    if (!allActive || !allHaveSlug || !allHavePrice || !uniqueSlugs) errors++;
  }
  console.log();

  // 3. Auction sanity checks
  console.log("🏷️  Auction Sanity Checks");
  console.log("─────────────────────────");
  const { data: auctions } = await supabase.from("auctions").select("*");
  if (!auctions || auctions.length !== 10) {
    console.log("  ❌ Auction count mismatch");
    errors++;
  } else {
    const allActive = auctions.every((a: any) => a.status === "active");
    const allFuture = auctions.every((a: any) => new Date(a.ends_at) > new Date());
    const allHavePrice = auctions.every((a: any) => a.current_price > 0);

    console.log(`  All status = active       ${allActive ? "✅" : "❌"}`);
    console.log(`  All end in future         ${allFuture ? "✅" : "❌"}`);
    console.log(`  All have current_price    ${allHavePrice ? "✅" : "❌"}`);
    if (!allActive || !allFuture || !allHavePrice) errors++;
  }
  console.log();

  // 4. Bid sanity checks
  console.log("💰 Bid Sanity Checks");
  console.log("────────────────────");
  const { data: bids } = await supabase.from("bids").select("*");
  if (!bids || bids.length !== 25) {
    console.log("  ❌ Bid count mismatch");
    errors++;
  } else {
    const validStatuses = ["active", "outbid"];
    const allValid = bids.every((b: any) => validStatuses.includes(b.status));
    console.log(`  All statuses valid        ${allValid ? "✅" : "❌"}`);
    if (!allValid) errors++;
  }
  console.log();

  // 5. Inspection sanity checks
  console.log("📋 Inspection Sanity Checks");
  console.log("───────────────────────────");
  const { data: inspections } = await supabase.from("inspection_items").select("*");
  if (!inspections || inspections.length !== 60) {
    console.log("  ❌ Inspection count mismatch");
    errors++;
  } else {
    const validStatuses = ["ok", "warning", "fail"];
    const allValid = inspections.every((i: any) => validStatuses.includes(i.status));
    console.log(`  All statuses valid        ${allValid ? "✅" : "❌"}`);
    if (!allValid) errors++;
  }
  console.log();

  // 6. Wallet sanity checks
  console.log("💳 Wallet Sanity Checks");
  console.log("───────────────────────");
  const { data: wallets } = await supabase.from("wallets").select("*");
  if (!wallets || wallets.length !== 2) {
    console.log("  ❌ Wallet count mismatch");
    errors++;
  } else {
    const allActive = wallets.every((w: any) => w.status === "active");
    const all200 = wallets.every((w: any) => w.balance === 200000);
    console.log(`  All status = active       ${allActive ? "✅" : "❌"}`);
    console.log(`  All balance = 200 DT      ${all200 ? "✅" : "❌"}`);
    if (!allActive || !all200) errors++;
  }
  console.log();

  // 7. Foreign key integrity
  console.log("🔗 Foreign Key Integrity");
  console.log("────────────────────────");
  const { data: fkCheck } = await supabase
    .from("vehicles")
    .select("seller_id, profiles(id)");
  const allFkValid = fkCheck?.every((row: any) => row.profiles != null) ?? false;
  console.log(`  vehicles.seller_id → profiles.id  ${allFkValid ? "✅" : "❌"}`);
  if (!allFkValid) errors++;
  console.log();

  // Summary
  console.log("═══════════════════════════════════════════");
  if (errors === 0) {
    console.log("✅ ALL CHECKS PASSED — Database is healthy!");
  } else {
    console.log(`❌ ${errors} CHECK(S) FAILED — Review output above`);
  }
  console.log("═══════════════════════════════════════════");
}

verify().catch(console.error);

