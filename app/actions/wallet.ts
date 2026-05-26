"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createPayment, verifyPayment } from "@/lib/payments";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendAuctionWonEmail } from "@/lib/email/send";
import { sendSMS, smsTemplates } from "@/lib/sms/send";
import type { PaymentProvider } from "@/lib/payments";

const CAUTION_AMOUNT = 200000; // 200 DT in millimes
const COMMISSION_RATE = 0.02; // 2%
const BLACKLIST_DURATION_DAYS = 30;

async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
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
}

/* ------------------------------------------------------------------ */
/*  1. Deposit Caution                                                */
/* ------------------------------------------------------------------ */

export async function depositCaution(opts: {
  userId: string;
  method: PaymentProvider;
  successUrl: string;
  failUrl: string;
}) {
  try {
    const supabase = await getSupabaseServer();

    // Get or create wallet
    let { data: wallet } = await supabase
      .from("wallets")
      .select("id, balance, status")
      .eq("user_id", opts.userId)
      .single();

    if (!wallet) {
      const { data: created } = await supabase
        .from("wallets")
        .insert({ user_id: opts.userId, balance: 0, status: "active" })
        .select("id, balance, status")
        .single();
      wallet = created;
    }

    if (!wallet) {
      return { success: false, error: "Impossible de créer le portefeuille" };
    }

    // Create transaction record
    const ref = `caution_${opts.userId}_${Date.now()}`;
    const { data: txn } = await supabase
      .from("wallet_transactions")
      .insert({
        wallet_id: wallet.id,
        type: "deposit",
        amount: CAUTION_AMOUNT,
        payment_method: opts.method,
        external_ref: ref,
        status: "pending",
      })
      .select("id")
      .single();

    if (!txn) {
      return { success: false, error: "Erreur création transaction" };
    }

    // Initiate payment
    const payment = await createPayment(opts.method, {
      amount: CAUTION_AMOUNT,
      reference: ref,
      description: "Caution MazadAuto — 200 DT",
      successUrl: opts.successUrl,
      failUrl: opts.failUrl,
    });

    return {
      success: true,
      transactionId: txn.id,
      payUrl: payment.payUrl,
      paymentRef: payment.paymentRef,
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/* ------------------------------------------------------------------ */
/*  2. Verify Deposit (also used by webhooks)                        */
/* ------------------------------------------------------------------ */

export async function verifyDeposit(transactionId: string) {
  try {
    const supabase = await getSupabaseServer();

    const { data: txn } = await supabase
      .from("wallet_transactions")
      .select("id, wallet_id, type, status, payment_method, external_ref")
      .eq("id", transactionId)
      .single();

    if (!txn || txn.status === "completed") {
      return { success: true };
    }

    // Verify with provider
    const verified = await verifyPayment(
      txn.payment_method as PaymentProvider,
      txn.external_ref
    );

    if (!verified.success) {
      return { success: false, error: "Paiement non confirmé" };
    }

    // Mark completed
    await supabase
      .from("wallet_transactions")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", txn.id);

    // Credit wallet
    const { data: wallet } = await supabase
      .from("wallets")
      .select("id, balance, status")
      .eq("id", txn.wallet_id)
      .single();

    if (wallet && wallet.status !== "forfeited") {
      await supabase
        .from("wallets")
        .update({
          balance: wallet.balance + CAUTION_AMOUNT,
          deposit_verified_at: new Date().toISOString(),
          status: "active",
        })
        .eq("id", wallet.id);
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/* ------------------------------------------------------------------ */
/*  3. Check Wallet (for bid placement)                               */
/* ------------------------------------------------------------------ */

export async function checkWalletForBidding(userId: string) {
  try {
    const supabase = await getSupabaseServer();

    const { data: wallet } = await supabase
      .from("wallets")
      .select("id, balance, status, deposit_verified_at")
      .eq("user_id", userId)
      .single();

    if (!wallet) {
      return {
        canBid: false,
        error: "Vous devez déposer une caution de 200 DT pour enchérir.",
        wallet: null,
      };
    }

    if (wallet.status === "forfeited") {
      return {
        canBid: false,
        error: "Votre compte est temporairement suspendu. Contactez le support.",
        wallet,
      };
    }

    if (wallet.balance < CAUTION_AMOUNT) {
      return {
        canBid: false,
        error: "Caution insuffisante. Rechargez votre portefeuille.",
        wallet,
      };
    }

    return { canBid: true, error: null, wallet };
  } catch (err) {
    return { canBid: false, error: (err as Error).message, wallet: null };
  }
}

/* ------------------------------------------------------------------ */
/*  4. Calculate Commission                                         */
/* ------------------------------------------------------------------ */

export async function calculateCommission(price: number): Promise<{
  total: number;
  cautionCredit: number;
  remaining: number;
}> {
  const total = Math.max(Math.round(price * COMMISSION_RATE), CAUTION_AMOUNT);
  return {
    total,
    cautionCredit: CAUTION_AMOUNT,
    remaining: Math.max(0, total - CAUTION_AMOUNT),
  };
}

/* ------------------------------------------------------------------ */
/*  5. Pay Commission (post-auction win)                              */
/* ------------------------------------------------------------------ */

export async function payCommission(opts: {
  auctionId: string;
  userId: string;
  method: PaymentProvider;
  successUrl: string;
  failUrl: string;
}) {
  try {
    const supabase = await getSupabaseServer();

    // Get auction current price
    const { data: auction } = await supabase
      .from("auctions")
      .select("id, current_price, vehicle_id, status")
      .eq("id", opts.auctionId)
      .single();

    if (!auction || auction.status !== "ended") {
      return { success: false, error: "Enchère invalide ou non terminée" };
    }

    const commission = await calculateCommission(auction.current_price);

    // Get wallet
    const { data: wallet } = await supabase
      .from("wallets")
      .select("id, balance")
      .eq("user_id", opts.userId)
      .single();

    if (!wallet || wallet.balance < CAUTION_AMOUNT) {
      return { success: false, error: "Caution insuffisante" };
    }

    // Create commission payment record
    const dueAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    const { data: commissionPayment } = await supabase
      .from("commission_payments")
      .insert({
        auction_id: opts.auctionId,
        user_id: opts.userId,
        total_commission: commission.total,
        caution_credit: commission.cautionCredit,
        remaining_amount: commission.remaining,
        status: "pending",
        due_at: dueAt,
      })
      .select("id")
      .single();

    if (!commissionPayment) {
      return { success: false, error: "Erreur création commission" };
    }

    // Reserve caution from wallet
    await supabase
      .from("wallet_transactions")
      .insert({
        wallet_id: wallet.id,
        type: "reserve",
        amount: CAUTION_AMOUNT,
        payment_method: opts.method,
        status: "completed",
        metadata: { commission_payment_id: commissionPayment.id },
      });

    await supabase
      .from("wallets")
      .update({ balance: wallet.balance - CAUTION_AMOUNT })
      .eq("id", wallet.id);

    // If no remaining amount, auto-complete
    if (commission.remaining === 0) {
      await completeCommissionPayment(commissionPayment.id);
      return { success: true, commissionPaymentId: commissionPayment.id, payUrl: null };
    }

    // Otherwise initiate payment for remaining
    const ref = `commission_${opts.auctionId}_${Date.now()}`;
    const payment = await createPayment(opts.method, {
      amount: commission.remaining,
      reference: ref,
      description: `Commission MazadAuto — ${(commission.remaining / 1000).toLocaleString("fr-FR")} DT`,
      successUrl: opts.successUrl,
      failUrl: opts.failUrl,
    });

    // Store external ref
    await supabase
      .from("wallet_transactions")
      .insert({
        wallet_id: wallet.id,
        type: "commission",
        amount: commission.remaining,
        payment_method: opts.method,
        external_ref: payment.paymentRef,
        status: "pending",
        metadata: { commission_payment_id: commissionPayment.id },
      });

    return {
      success: true,
      commissionPaymentId: commissionPayment.id,
      payUrl: payment.payUrl,
      paymentRef: payment.paymentRef,
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/* ------------------------------------------------------------------ */
/*  6. Complete Commission Payment                                    */
/* ------------------------------------------------------------------ */

export async function completeCommissionPayment(commissionPaymentId: string) {
  try {
    const supabase = await getSupabaseServer();

    const { data: commissionPayment } = await supabase
      .from("commission_payments")
      .select("id, auction_id, user_id, status")
      .eq("id", commissionPaymentId)
      .single();

    if (!commissionPayment || commissionPayment.status === "paid") {
      return { success: true };
    }

    await supabase
      .from("commission_payments")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", commissionPaymentId);

    // Update auction
    await supabase
      .from("auctions")
      .update({
        commission_amount: (await supabase.from("commission_payments").select("total_commission").eq("id", commissionPaymentId).single()).data?.total_commission,
        commission_paid_at: new Date().toISOString(),
      })
      .eq("id", commissionPayment.auction_id);

    // Release seller coordinates
    await releaseSellerCoordinates(commissionPayment.auction_id);

    // Notify seller
    await notifySellerOfSale(commissionPayment.auction_id);

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/* ------------------------------------------------------------------ */
/*  7. Forfeit Caution (48h non-payment)                              */
/* ------------------------------------------------------------------ */

export async function forfeitCaution(commissionPaymentId: string) {
  try {
    const supabase = await getSupabaseServer();

    const { data: commissionPayment } = await supabase
      .from("commission_payments")
      .select("id, auction_id, user_id, status")
      .eq("id", commissionPaymentId)
      .single();

    if (!commissionPayment || commissionPayment.status !== "pending") {
      return { success: false, error: "Commission déjà traitée" };
    }

    // Mark forfeited
    await supabase
      .from("commission_payments")
      .update({ status: "forfeited", forfeited_at: new Date().toISOString() })
      .eq("id", commissionPaymentId);

    // Mark wallet as forfeited (blacklist 30 days)
    const { data: wallet } = await supabase
      .from("wallets")
      .select("id")
      .eq("user_id", commissionPayment.user_id)
      .single();

    if (wallet) {
      await supabase
        .from("wallets")
        .update({ status: "forfeited" })
        .eq("id", wallet.id);

      // Record forfeit transaction
      await supabase.from("wallet_transactions").insert({
        wallet_id: wallet.id,
        type: "forfeit",
        amount: CAUTION_AMOUNT,
        payment_method: "konnect",
        status: "completed",
        metadata: { commission_payment_id: commissionPaymentId, reason: "Non-paiement sous 48h" },
      });
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/* ------------------------------------------------------------------ */
/*  8. Request Refund                                                 */
/* ------------------------------------------------------------------ */

export async function requestRefund(userId: string) {
  try {
    const supabase = await getSupabaseServer();

    // Check no active/won auction
    const { data: activeBids } = await supabase
      .from("bids")
      .select("auction_id, status")
      .eq("bidder_id", userId)
      .in("status", ["active", "won"]);

    if (activeBids && activeBids.length > 0) {
      return {
        success: false,
        error: "Vous avez une enchère en cours ou gagnée. Impossible de rembourser pour le moment.",
      };
    }

    const { data: wallet } = await supabase
      .from("wallets")
      .select("id, balance, status")
      .eq("user_id", userId)
      .single();

    if (!wallet || wallet.balance < CAUTION_AMOUNT) {
      return { success: false, error: "Aucune caution à rembourser" };
    }

    // Find original deposit transaction
    const { data: depositTxn } = await supabase
      .from("wallet_transactions")
      .select("id, payment_method, external_ref")
      .eq("wallet_id", wallet.id)
      .eq("type", "deposit")
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const method = (depositTxn?.payment_method as PaymentProvider) || "konnect";

    // Create refund transaction
    await supabase.from("wallet_transactions").insert({
      wallet_id: wallet.id,
      type: "refund",
      amount: CAUTION_AMOUNT,
      payment_method: method,
      status: "pending",
    });

    // Deduct from wallet
    await supabase
      .from("wallets")
      .update({ balance: wallet.balance - CAUTION_AMOUNT })
      .eq("id", wallet.id);

    // Attempt refund via provider
    if (depositTxn?.external_ref) {
      const { refundPayment } = await import("@/lib/payments");
      await refundPayment(method, depositTxn.external_ref, CAUTION_AMOUNT);
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/* ------------------------------------------------------------------ */
/*  9. Release Seller Coordinates                                     */
/* ------------------------------------------------------------------ */

export async function releaseSellerCoordinates(auctionId: string) {
  try {
    const supabase = await getSupabaseServer();

    const { data: auction } = await supabase
      .from("auctions")
      .select("id, vehicle_id, winner_id, commission_paid_at")
      .eq("id", auctionId)
      .single();

    if (!auction || !auction.commission_paid_at) {
      return { success: false, error: "Commission non payée" };
    }

    // Get seller info
    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("seller_id")
      .eq("id", auction.vehicle_id)
      .single();

    if (!vehicle) {
      return { success: false, error: "Véhicule introuvable" };
    }

    // Get or create release record
    const { data: existing } = await supabase
      .from("seller_releases")
      .select("id")
      .eq("auction_id", auctionId)
      .single();

    if (!existing) {
      await supabase.from("seller_releases").insert({
        auction_id: auctionId,
        seller_id: vehicle.seller_id,
        buyer_id: auction.winner_id,
        coordinates_released_at: new Date().toISOString(),
      });
    }

    // Update auction
    await supabase
      .from("auctions")
      .update({ seller_coordinates_released_at: new Date().toISOString() })
      .eq("id", auctionId);

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/* ------------------------------------------------------------------ */
/*  10. Notify Seller of Sale                                         */
/* ------------------------------------------------------------------ */

export async function notifySellerOfSale(auctionId: string) {
  try {
    if (!supabaseAdmin) return { success: false };

    const { data: auction } = await supabaseAdmin
      .from("auctions")
      .select("id, vehicle_id, winner_id, current_price, commission_paid_at, buyer_winner_notified_at")
      .eq("id", auctionId)
      .single();

    if (!auction || auction.buyer_winner_notified_at) {
      return { success: true };
    }

    const { data: vehicle } = await supabaseAdmin
      .from("vehicles")
      .select("seller_id, marque, modele")
      .eq("id", auction.vehicle_id)
      .single();

    if (!vehicle) return { success: false };

    // Email seller
    await sendAuctionWonEmail(vehicle.seller_id, auctionId);

    // SMS seller
    const { data: sellerProfile } = await supabaseAdmin
      .from("profiles")
      .select("phone")
      .eq("id", vehicle.seller_id)
      .single();

    if (sellerProfile?.phone) {
      await sendSMS(
        vehicle.seller_id,
        `Votre ${vehicle.marque} ${vehicle.modele} a été vendu à ${(auction.current_price / 1000).toLocaleString("fr-FR")} DT. Notre équipe vous appelle sous 24h. Ne remettez pas le véhicule avant notre appel.`
      );
    }

    // Create admin notification
    await supabaseAdmin.from("notifications").insert({
      user_id: vehicle.seller_id,
      type: "system",
      title: "🎉 Votre véhicule a été vendu !",
      body: `${vehicle.marque} ${vehicle.modele} — Notre équipe vous contactera sous 24h.`,
    });

    // Mark notified
    await supabaseAdmin
      .from("auctions")
      .update({ buyer_winner_notified_at: new Date().toISOString() })
      .eq("id", auctionId);

    return { success: true };
  } catch {
    return { success: false };
  }
}

/* ------------------------------------------------------------------ */
/*  11. Approve Bank Transfer (Admin)                                 */
/* ------------------------------------------------------------------ */

export async function approveBankTransfer(transactionId: string) {
  try {
    const supabase = await getSupabaseServer();

    const { data: txn } = await supabase
      .from("wallet_transactions")
      .select("id, wallet_id, type, status")
      .eq("id", transactionId)
      .eq("payment_method", "virement")
      .single();

    if (!txn || txn.status === "completed") {
      return { success: false, error: "Transaction déjà traitée" };
    }

    await supabase
      .from("wallet_transactions")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", txn.id);

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
            balance: wallet.balance + CAUTION_AMOUNT,
            deposit_verified_at: new Date().toISOString(),
            status: "active",
          })
          .eq("id", wallet.id);
      }
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
