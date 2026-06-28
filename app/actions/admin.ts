"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Non authentifié");
  }

  // Use admin client to bypass RLS infinite-recursion on profiles
  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    throw new Error("Accès réservé aux administrateurs");
  }
}

export async function approveKyc(userId: string) {
  try {
    await requireAdmin();

    const admin = createAdminClient();
    const { error } = await admin
      .from("profiles")
      .update({ kyc_status: "verified", kyc_verified_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) {
      return { data: null, error: "Erreur lors de l'approbation KYC" };
    }

    return { data: { success: true }, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur serveur";
    return { data: null, error: message };
  }
}

export async function rejectKyc(userId: string, reason: string) {
  try {
    await requireAdmin();

    const admin = createAdminClient();
    const { error } = await admin
      .from("profiles")
      .update({ kyc_status: "rejected", kyc_rejection_reason: reason })
      .eq("id", userId);

    if (error) {
      return { data: null, error: "Erreur lors du rejet KYC" };
    }

    return { data: { success: true }, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur serveur";
    return { data: null, error: message };
  }
}

export async function approveVehicle(vehicleId: string) {
  const supabase = await createClient();

  try {
    await requireAdmin();

    const { error: vehicleError } = await supabase
      .from("vehicles")
      .update({ status: "active" })
      .eq("id", vehicleId);

    if (vehicleError) {
      return { data: null, error: "Erreur lors de l'approbation du véhicule" };
    }

    const { error: auctionError } = await supabase
      .from("auctions")
      .update({ status: "active" })
      .eq("vehicle_id", vehicleId);

    if (auctionError) {
      return { data: null, error: "Erreur lors de l'activation de l'enchère" };
    }

    return { data: { success: true }, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur serveur";
    return { data: null, error: message };
  }
}
