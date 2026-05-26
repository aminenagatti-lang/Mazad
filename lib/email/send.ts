"use server";

import { resend, FROM_EMAIL } from "@/lib/resend/client";
import { getProfileById, getUserEmail } from "@/lib/profile/get";
import {
  welcomeBuyerHtml,
  welcomeSellerHtml,
  kycApprovedHtml,
  kycRejectedHtml,
  outbidHtml,
  auctionEndingSoonHtml,
  auctionWonHtml,
  auctionLostHtml,
  vehicleListedHtml,
  vehicleSoldHtml,
  auctionNoBidsHtml,
} from "@/lib/email/templates";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function send({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!resend) {
    return;
  }
  try {
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
  } catch {
    // silently ignore email send errors in production
  }
}

export async function sendWelcomeBuyerEmail(userId: string) {
  try {
    const profile = await getProfileById(userId);
    const email = await getUserEmail(userId);
    if (!profile || !email) return;
    await send({
      to: email,
      subject: "Bienvenue sur MazadAuto 👋",
      html: welcomeBuyerHtml(profile.first_name),
    });
  } catch {
    // ignore
  }
}

export async function sendWelcomeSellerEmail(userId: string) {
  try {
    const profile = await getProfileById(userId);
    const email = await getUserEmail(userId);
    if (!profile || !email) return;
    await send({
      to: email,
      subject: "Votre dossier vendeur est en cours d'examen",
      html: welcomeSellerHtml(profile.first_name),
    });
  } catch {
    // ignore
  }
}

export async function sendKycApprovedEmail(userId: string) {
  try {
    const profile = await getProfileById(userId);
    const email = await getUserEmail(userId);
    if (!profile || !email) return;
    await send({
      to: email,
      subject: "✅ Votre compte est vérifié !",
      html: kycApprovedHtml(profile.first_name, profile.role),
    });
  } catch {
    // ignore
  }
}

export async function sendKycRejectedEmail(userId: string, reason: string) {
  try {
    const profile = await getProfileById(userId);
    const email = await getUserEmail(userId);
    if (!profile || !email) return;
    await send({
      to: email,
      subject: "⚠️ Action requise — Vérification d'identité",
      html: kycRejectedHtml(profile.first_name, reason),
    });
  } catch {
    // ignore
  }
}

export async function sendOutbidEmail(bidderId: string, auctionId: string) {
  try {
    const profile = await getProfileById(bidderId);
    const email = await getUserEmail(bidderId);
    if (!profile || !email) return;

    if (!supabaseAdmin) return;
    const { data: auction } = await supabaseAdmin
      .from("auctions")
      .select("*, vehicles!inner(slug, marque, modele)")
      .eq("id", auctionId)
      .single();

    if (!auction) return;
    const vehicle = (auction as Record<string, unknown>).vehicles as Record<string, string> | null;
    const vehicleName = vehicle ? `${vehicle.marque} ${vehicle.modele}` : "Véhicule";
    const vehicleSlug = vehicle?.slug ?? "";

    const { data: myBidData } = await supabaseAdmin
      .from("bids")
      .select("amount")
      .eq("auction_id", auctionId)
      .eq("bidder_id", bidderId)
      .order("placed_at", { ascending: false })
      .limit(1)
      .single();

    const currentPrice = (auction as Record<string, number>).current_price ?? 0;
    const myBid = (myBidData as Record<string, number> | null)?.amount ?? currentPrice;
    const endsAt = (auction as Record<string, string>).ends_at;

    await send({
      to: email,
      subject: `😮 Vous avez été surenchéri — ${vehicleName}`,
      html: outbidHtml(profile.first_name, vehicleName, vehicleSlug, currentPrice, myBid, endsAt),
    });
  } catch {
    // ignore
  }
}

export async function sendAuctionEndingSoonEmail(auctionId: string) {
  try {
    if (!supabaseAdmin) return;
    const { data: auction } = await supabaseAdmin
      .from("auctions")
      .select("*, vehicles!inner(slug, marque, modele)")
      .eq("id", auctionId)
      .single();
    if (!auction) return;

    const vehicle = (auction as Record<string, unknown>).vehicles as Record<string, string> | null;
    const vehicleName = vehicle ? `${vehicle.marque} ${vehicle.modele}` : "Véhicule";
    const vehicleSlug = vehicle?.slug ?? "";
    const currentPrice = (auction as Record<string, number>).current_price ?? 0;
    const endsAt = (auction as Record<string, string>).ends_at;

    const { data: bids } = await supabaseAdmin
      .from("bids")
      .select("bidder_id")
      .eq("auction_id", auctionId);
    const { data: watches } = await supabaseAdmin
      .from("watchlist")
      .select("user_id")
      .eq("auction_id", auctionId);

    const userIds = Array.from(
      new Set([
        ...(bids?.map((b: Record<string, string>) => b.bidder_id) ?? []),
        ...(watches?.map((w: Record<string, string>) => w.user_id) ?? []),
      ])
    );

    for (const uid of userIds) {
      const profile = await getProfileById(uid);
      const email = await getUserEmail(uid);
      if (!profile || !email) continue;

      const { data: topBid } = await supabaseAdmin
        .from("bids")
        .select("bidder_id")
        .eq("auction_id", auctionId)
        .eq("status", "active")
        .order("amount", { ascending: false })
        .limit(1)
        .single();
      const isWinning = (topBid as Record<string, string> | null)?.bidder_id === uid;

      await send({
        to: email,
        subject: `⏰ Plus que 1h — ${vehicleName}`,
        html: auctionEndingSoonHtml(profile.first_name, vehicleName, vehicleSlug, currentPrice, isWinning),
      });
    }
  } catch {
    // ignore
  }
}

export async function sendAuctionWonEmail(winnerId: string, auctionId: string) {
  try {
    const profile = await getProfileById(winnerId);
    const email = await getUserEmail(winnerId);
    if (!profile || !email) return;

    if (!supabaseAdmin) return;
    const { data: auction } = await supabaseAdmin
      .from("auctions")
      .select("*, vehicles!inner(slug, marque, modele)")
      .eq("id", auctionId)
      .single();
    if (!auction) return;

    const vehicle = (auction as Record<string, unknown>).vehicles as Record<string, string> | null;
    const vehicleName = vehicle ? `${vehicle.marque} ${vehicle.modele}` : "Véhicule";
    const vehicleSlug = vehicle?.slug ?? "";
    const finalPrice = (auction as Record<string, number>).current_price ?? 0;

    await send({
      to: email,
      subject: "🏆 Félicitations ! Vous avez remporté l'enchère",
      html: auctionWonHtml(profile.first_name, vehicleName, vehicleSlug, finalPrice),
    });
  } catch {
    // ignore
  }
}

export async function sendAuctionLostEmail(loserId: string, auctionId: string) {
  try {
    const profile = await getProfileById(loserId);
    const email = await getUserEmail(loserId);
    if (!profile || !email) return;

    if (!supabaseAdmin) return;
    const { data: auction } = await supabaseAdmin
      .from("auctions")
      .select("*, vehicles!inner(marque, modele)")
      .eq("id", auctionId)
      .single();
    if (!auction) return;

    const vehicle = (auction as Record<string, unknown>).vehicles as Record<string, string> | null;
    const vehicleName = vehicle ? `${vehicle.marque} ${vehicle.modele}` : "Véhicule";
    const finalPrice = (auction as Record<string, number>).current_price ?? 0;

    await send({
      to: email,
      subject: `Enchère terminée — ${vehicleName}`,
      html: auctionLostHtml(profile.first_name, vehicleName, finalPrice),
    });
  } catch {
    // ignore
  }
}

export async function sendVehicleListedEmail(sellerId: string, vehicleId: string) {
  try {
    const profile = await getProfileById(sellerId);
    const email = await getUserEmail(sellerId);
    if (!profile || !email) return;

    if (!supabaseAdmin) return;
    const { data: vehicle } = await supabaseAdmin
      .from("vehicles")
      .select("*, auctions!inner(ends_at)")
      .eq("id", vehicleId)
      .single();
    if (!vehicle) return;

    const v = vehicle as Record<string, unknown>;
    const auctions = v.auctions as Record<string, string>[] | null;
    const endsAt = Array.isArray(auctions) ? auctions[0]?.ends_at : (auctions as Record<string, string> | null)?.ends_at ?? new Date().toISOString();

    await send({
      to: email,
      subject: "🚗 Votre véhicule est en ligne !",
      html: vehicleListedHtml(profile.first_name, `${v.marque} ${v.modele}`, (v.slug as string) ?? "", endsAt),
    });
  } catch {
    // ignore
  }
}

export async function sendVehicleSoldEmail(sellerId: string, auctionId: string) {
  try {
    const profile = await getProfileById(sellerId);
    const email = await getUserEmail(sellerId);
    if (!profile || !email) return;

    if (!supabaseAdmin) return;
    const { data: auction } = await supabaseAdmin
      .from("auctions")
      .select("*, vehicles!inner(marque, modele)")
      .eq("id", auctionId)
      .single();
    if (!auction) return;

    const a = auction as Record<string, unknown>;
    const adjudicationPrice = (a.current_price as number) ?? 0;
    const sellerCommission = Math.round(adjudicationPrice * 0.015);
    const sellerPayout = adjudicationPrice - sellerCommission;
    const vehicle = a.vehicles as Record<string, string> | null;

    await send({
      to: email,
      subject: "🎉 Votre véhicule a été vendu !",
      html: vehicleSoldHtml(
        profile.first_name,
        vehicle ? `${vehicle.marque} ${vehicle.modele}` : "Véhicule",
        adjudicationPrice,
        sellerCommission,
        sellerPayout
      ),
    });
  } catch {
    // ignore
  }
}

export async function sendAuctionNoBidsEmail(sellerId: string, vehicleId: string) {
  try {
    const profile = await getProfileById(sellerId);
    const email = await getUserEmail(sellerId);
    if (!profile || !email) return;

    if (!supabaseAdmin) return;
    const { data: vehicle } = await supabaseAdmin
      .from("vehicles")
      .select("marque, modele")
      .eq("id", vehicleId)
      .single();
    if (!vehicle) return;

    const v = vehicle as Record<string, string>;

    await send({
      to: email,
      subject: `Enchère terminée sans offre — ${v.marque} ${v.modele}`,
      html: auctionNoBidsHtml(profile.first_name, `${v.marque} ${v.modele}`),
    });
  } catch {
    // ignore
  }
}
