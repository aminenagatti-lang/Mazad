import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ wallet: null, transactions: [] }, { status: 401 });
    }

    const { data: wallet } = await supabase
      .from("wallets")
      .select("id, balance, status, deposit_verified_at")
      .eq("user_id", user.id)
      .single();

    const { data: transactions } = await supabase
      .from("wallet_transactions")
      .select("id, type, amount, payment_method, status, created_at")
      .eq("wallet_id", wallet?.id)
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({ wallet, transactions: transactions ?? [] });
  } catch {
    return NextResponse.json({ wallet: null, transactions: [] }, { status: 500 });
  }
}
