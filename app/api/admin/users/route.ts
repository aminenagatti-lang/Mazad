import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("profiles")
    .select("id, first_name, last_name, role, kyc_status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[api/admin/users] error:", error.message);
    return NextResponse.json({ users: [] }, { status: 500 });
  }

  return NextResponse.json({ users: data ?? [] });
}
