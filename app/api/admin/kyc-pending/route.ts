import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("profiles")
    .select("id, first_name, last_name, phone, city, role, company_name, seller_type, kyc_status, deposit_paid, deposit_amount, created_at, kyc_submitted_at")
    .eq("kyc_status", "pending")
    .order("kyc_submitted_at", { ascending: false });

  if (error) {
    console.error("[api/admin/kyc-pending] error:", error.message);
    return NextResponse.json({ profiles: [] }, { status: 500 });
  }

  return NextResponse.json({ profiles: data ?? [] });
}
