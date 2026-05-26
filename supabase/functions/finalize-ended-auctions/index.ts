// Supabase Edge Function: finalize-ended-auctions
// Triggered every minute via pg_cron

import { createClient } from "jsr:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

Deno.serve(async () => {
  const now = new Date().toISOString();

  const { data: auctions, error } = await supabase
    .from("auctions")
    .select("*, bids(bidder_id, amount, status), vehicles!inner(id, seller_id, marque, modele)")
    .eq("status", "active")
    .lt("ends_at", now);

  if (error || !auctions || auctions.length === 0) {
    return new Response(JSON.stringify({ ok: true, count: 0 }), { status: 200 });
  }

  for (const auction of auctions as unknown as Array<Record<string, unknown>>) {
    const auctionId = auction.id as string;
    const auctionStatus = auction.status as string;

    // Guard against double-finalization
    if (auctionStatus !== "active") continue;

    const vehicle = auction.vehicles as Record<string, unknown> | null;
    const vehicleId = (vehicle?.id as string) ?? "";
    const sellerId = (vehicle?.seller_id as string) ?? "";
    const bids = (auction.bids ?? []) as Array<Record<string, unknown>>;

    const activeBids = bids.filter((b) => b.status === "active");
    const winner = activeBids.sort((a, b) => (b.amount as number) - (a.amount as number))[0];

    if (winner) {
      const winnerId = winner.bidder_id as string;
      const finalPrice = winner.amount as number;

      // Update auction
      await supabase
        .from("auctions")
        .update({ status: "ended", winner_id: winnerId })
        .eq("id", auctionId);

      // Update vehicle
      await supabase
        .from("vehicles")
        .update({ status: "sold" })
        .eq("id", vehicleId);

      // Update winning bid
      await supabase
        .from("bids")
        .update({ status: "won" })
        .eq("auction_id", auctionId)
        .eq("bidder_id", winnerId);

      // Update other bids
      await supabase
        .from("bids")
        .update({ status: "outbid" })
        .eq("auction_id", auctionId)
        .neq("bidder_id", winnerId);

      // Notify winner
      await supabase.from("notifications").insert({
        user_id: winnerId,
        type: "won",
        title: `🏆 Félicitations ! Vous avez remporté l'enchère`,
        body: `${vehicle?.marque ?? ""} ${vehicle?.modele ?? ""} pour ${(finalPrice / 1000).toLocaleString("fr-FR")} DT`,
      });

      // Notify seller
      await supabase.from("notifications").insert({
        user_id: sellerId,
        type: "vehicle_sold",
        title: "🎉 Votre véhicule a été vendu !",
        body: `${vehicle?.marque ?? ""} ${vehicle?.modele ?? ""} a trouvé preneur.`,
      });

      // Notify losers
      const loserIds = Array.from(
        new Set(activeBids.filter((b) => b.bidder_id !== winnerId).map((b) => b.bidder_id as string))
      );
      for (const loserId of loserIds) {
        await supabase.from("notifications").insert({
          user_id: loserId,
          type: "outbid",
          title: `Enchère terminée — ${vehicle?.marque ?? ""} ${vehicle?.modele ?? ""}`,
          body: "Le véhicule a été adjugé. De nouveaux véhicules arrivent chaque jour.",
        });
      }
    } else {
      // No bids
      await supabase
        .from("auctions")
        .update({ status: "ended" })
        .eq("id", auctionId);

      await supabase
        .from("vehicles")
        .update({ status: "unsold" })
        .eq("id", vehicleId);

      await supabase.from("notifications").insert({
        user_id: sellerId,
        type: "system",
        title: `Enchère terminée sans offre — ${vehicle?.marque ?? ""} ${vehicle?.modele ?? ""}`,
        body: "L'enchère s'est terminée sans enchère. Vous pouvez remettre le véhicule en vente.",
      });
    }
  }

  return new Response(
    JSON.stringify({ ok: true, count: auctions.length }),
    { status: 200 }
  );
});
