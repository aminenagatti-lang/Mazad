import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ seller: null, vehicle: null }, { status: 400 });
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ seller: null, vehicle: null }, { status: 401 });
    }

    // Get vehicle
    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("id, slug, marque, modele, annee, seller_id")
      .eq("slug", slug)
      .single();

    if (!vehicle) {
      return NextResponse.json({ seller: null, vehicle: null });
    }

    // Check if commission was paid for this auction
    const { data: auction } = await supabase
      .from("auctions")
      .select("id, winner_id, commission_paid_at")
      .eq("vehicle_id", vehicle.id)
      .single();

    if (!auction || auction.winner_id !== user.id || !auction.commission_paid_at) {
      return NextResponse.json({ seller: null, vehicle: null }, { status: 403 });
    }

    // Get seller info (admin client bypasses RLS recursion)
    const admin = createAdminClient();
    const { data: seller } = await admin
      .from("profiles")
      .select("first_name, last_name, phone, city, company_name")
      .eq("id", vehicle.seller_id)
      .single();

    return NextResponse.json({
      seller,
      vehicle: { marque: vehicle.marque, modele: vehicle.modele, annee: vehicle.annee },
    });
  } catch {
    return NextResponse.json({ seller: null, vehicle: null }, { status: 500 });
  }
}
