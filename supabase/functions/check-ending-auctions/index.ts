// Supabase Edge Function: check-ending-auctions
// Triggered every 5 minutes via pg_cron

import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

Deno.serve(async () => {
  const oneHourFromNow = new Date(Date.now() + 3600000).toISOString();
  const now = new Date().toISOString();

  const { data: auctions, error } = await supabase
    .from("auctions")
    .select("id, vehicle_id, ends_at, vehicles!inner(marque, modele, slug)")
    .eq("status", "active")
    .eq("ending_soon_notified", false)
    .lt("ends_at", oneHourFromNow)
    .gt("ends_at", now);

  if (error || !auctions || auctions.length === 0) {
    return new Response(JSON.stringify({ ok: true, count: 0 }), { status: 200 });
  }

  for (const auction of auctions as unknown as Array<Record<string, unknown>>) {
    const vehicle = auction.vehicles as Record<string, string> | null;
    const auctionId = auction.id as string;

    // Get bidders
    const { data: bids } = await supabase
      .from("bids")
      .select("bidder_id")
      .eq("auction_id", auctionId);

    // Get watchers
    const { data: watches } = await supabase
      .from("watchlist")
      .select("user_id")
      .eq("auction_id", auctionId);

    const userIds = Array.from(
      new Set([
        ...(bids?.map((b: Record<string, string>) => b.bidder_id) ?? []),
        ...(watches?.map((w: Record<string, string>) => w.user_id) ?? []),
      ])
    );

    for (const userId of userIds) {
      await supabase.from("notifications").insert({
        user_id: userId,
        type: "auction_ending",
        title: `⏰ Plus que 1h — ${vehicle?.marque ?? ""} ${vehicle?.modele ?? ""}`,
        body: "L'enchère se termine bientôt. Renchérissez maintenant !",
      });
    }

    // Mark as notified
    await supabase
      .from("auctions")
      .update({ ending_soon_notified: true })
      .eq("id", auctionId);
  }

  return new Response(
    JSON.stringify({ ok: true, count: auctions.length }),
    { status: 200 }
  );
});
