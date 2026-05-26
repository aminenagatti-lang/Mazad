import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ auction: null }, { status: 400 });
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

    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("id, slug, marque, modele, annee")
      .eq("slug", slug)
      .single();

    if (!vehicle) {
      return NextResponse.json({ auction: null });
    }

    const { data: auction } = await supabase
      .from("auctions")
      .select("id, current_price, ends_at, status, commission_paid_at, seller_coordinates_released_at")
      .eq("vehicle_id", vehicle.id)
      .single();

    return NextResponse.json({
      auction: auction ? { ...auction, vehicle } : null,
    });
  } catch {
    return NextResponse.json({ auction: null }, { status: 500 });
  }
}
