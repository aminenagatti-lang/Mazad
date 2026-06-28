import "@/lib/supabase/suppress-warnings";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  // 1. Verify the user is authenticated (getSession refreshes tokens)
  const supabase = await createClient();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const userId = session.user.id;

  // 2. Query profiles with admin client to bypass RLS recursion bug
  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    console.error("[api/me] profile error:", profileError?.message);
    return NextResponse.json({ user: null }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: userId,
      email: session.user.email ?? "",
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone,
      city: profile.city,
      role: profile.role,
      seller_type: profile.seller_type,
      company_name: profile.company_name,
      kyc_status: profile.kyc_status,
      deposit_paid: profile.deposit_paid,
      deposit_amount: profile.deposit_amount,
      created_at: profile.created_at,
    },
  });
}
