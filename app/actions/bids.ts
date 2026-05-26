"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const placeBidSchema = z.object({
  auctionId: z.string().uuid(),
  amount: z.number().int().positive(),
});

export async function placeBid(input: { auctionId: string; amount: number }) {
  const parsed = placeBidSchema.safeParse(input);
  if (!parsed.success) {
    return { data: null, error: "Données d'enchère invalides" };
  }

  const supabase = await createClient();

  try {
    // 1. Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Vous devez être connecté pour enchérir" };
    }

    // 2. Verify KYC and wallet
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("kyc_status")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return { data: null, error: "Profil introuvable" };
    }

    if (profile.kyc_status !== "verified") {
      return { data: null, error: "Votre KYC doit être vérifié pour enchérir" };
    }

    // Check wallet caution
    const { data: wallet } = await supabase
      .from("wallets")
      .select("id, balance, status")
      .eq("user_id", user.id)
      .single();

    if (!wallet || wallet.status === "forfeited" || wallet.balance < 200000) {
      return {
        data: null,
        error: "Déposez une caution de 200 DT pour enchérir. Rendez-vous dans votre portefeuille.",
      };
    }

    // 3. Get current auction state
    const { data: auction, error: auctionError } = await supabase
      .from("auctions")
      .select("current_price, status, ends_at")
      .eq("id", input.auctionId)
      .single();

    if (auctionError || !auction) {
      return { data: null, error: "Enchère introuvable" };
    }

    if (auction.status !== "active") {
      return { data: null, error: "Cette enchère n'est plus active" };
    }

    if (new Date(auction.ends_at) < new Date()) {
      return { data: null, error: "L'enchère est terminée" };
    }

    // 4. Validate minimum bid (current_price + 200 DT = 200000 millimes)
    const minBid = auction.current_price + 200 * 1000;
    if (input.amount < minBid) {
      return {
        data: null,
        error: `L'enchère minimum est de ${(minBid / 1000).toLocaleString("fr-FR")} DT`,
      };
    }

    // 5. Insert bid
    const { error: insertError } = await supabase.from("bids").insert({
      auction_id: input.auctionId,
      bidder_id: user.id,
      amount: input.amount,
    });

    if (insertError) {
      return { data: null, error: "Impossible de placer l'enchère. Réessayez." };
    }

    return { data: { success: true }, error: null };
  } catch {
    return { data: null, error: "Une erreur est survenue lors du placement de l'enchère" };
  }
}
