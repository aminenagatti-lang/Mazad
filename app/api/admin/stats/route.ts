import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const admin = createAdminClient();

  const [
    { count: totalUsers },
    { count: buyers },
    { count: sellers },
    { count: kycPending },
    { count: activeVehicles },
    { count: activeAuctions },
  ] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin.from("profiles").select("*", { count: "exact", head: true }).eq("role", "buyer"),
    admin.from("profiles").select("*", { count: "exact", head: true }).eq("role", "seller"),
    admin.from("profiles").select("*", { count: "exact", head: true }).eq("kyc_status", "pending"),
    admin.from("vehicles").select("*", { count: "exact", head: true }).eq("status", "active"),
    admin.from("auctions").select("*", { count: "exact", head: true }).eq("status", "active"),
  ]);

  return NextResponse.json({
    totalUsers: totalUsers ?? 0,
    buyers: buyers ?? 0,
    sellers: sellers ?? 0,
    kycPending: kycPending ?? 0,
    activeVehicles: activeVehicles ?? 0,
    activeAuctions: activeAuctions ?? 0,
  });
}
