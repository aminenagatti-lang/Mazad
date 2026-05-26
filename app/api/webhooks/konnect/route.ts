import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const paymentRef = payload.paymentRef as string | undefined;
    const status = payload.status as string | undefined;

    if (!paymentRef || status !== "completed") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

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

    // Trouver la transaction par external_ref
    const { data: txn } = await supabase
      .from("wallet_transactions")
      .select("id, wallet_id, type, status")
      .eq("external_ref", paymentRef)
      .eq("payment_method", "konnect")
      .single();

    if (!txn || txn.status === "completed") {
      return NextResponse.json({ ok: true });
    }

    // Mettre à jour transaction
    await supabase
      .from("wallet_transactions")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", txn.id);

    // Si c'est un dépôt, créditer le wallet
    if (txn.type === "deposit") {
      const { data: wallet } = await supabase
        .from("wallets")
        .select("id, balance, status")
        .eq("id", txn.wallet_id)
        .single();

      if (wallet && wallet.status !== "forfeited") {
        await supabase
          .from("wallets")
          .update({
            balance: wallet.balance + 200000, // 200 DT en millimes
            deposit_verified_at: new Date().toISOString(),
            status: "active",
          })
          .eq("id", wallet.id);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
