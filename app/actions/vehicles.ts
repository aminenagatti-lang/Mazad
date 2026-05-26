"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const vehicleSchema = z.object({
  marque: z.string().min(1),
  modele: z.string().min(1),
  version: z.string().optional(),
  annee: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  kilometrage: z.number().int().nonnegative(),
  carburant: z.enum(["essence", "diesel", "hybride", "electrique", "gpl"]),
  transmission: z.enum(["manuelle", "automatique"]),
  couleur: z.string().optional(),
  nbPortes: z.number().int().min(2).max(5).optional(),
  puissance: z.number().int().positive().optional(),
  origine: z.string().optional(),
  description: z.string().max(500).optional(),
  prixDepart: z.number().int().positive(),
  prixReserve: z.number().int().positive().optional(),
  duree: z.number().int().positive(),
});

function generateVehicleSlug(marque: string, modele: string, annee: number): string {
  const base = `${marque}-${modele}-${annee}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base}-${Math.random().toString(36).substring(2, 6)}`;
}

export async function createVehicle(input: Record<string, unknown>) {
  const parsed = vehicleSchema.safeParse(input);
  if (!parsed.success) {
    return { data: null, error: "Données du véhicule invalides" };
  }

  const supabase = await createClient();

  try {
    // 1. Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: "Vous devez être connecté pour créer un véhicule" };
    }

    // 2. Verify seller KYC
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("kyc_status, role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return { data: null, error: "Profil introuvable" };
    }

    if (profile.kyc_status !== "verified") {
      return { data: null, error: "Votre KYC doit être vérifié pour mettre en vente" };
    }

    if (profile.role !== "seller" && profile.role !== "admin") {
      return { data: null, error: "Vous devez être vendeur pour créer un véhicule" };
    }

    // 3. Multiply prices by 1000 (millimes)
    const prixDepart = parsed.data.prixDepart * 1000;
    const prixReserve = parsed.data.prixReserve ? parsed.data.prixReserve * 1000 : null;

    // 4. Generate unique slug
    const slug = generateVehicleSlug(parsed.data.marque, parsed.data.modele, parsed.data.annee);

    // 5. Insert vehicle
    const { data: vehicle, error: vehicleError } = await supabase
      .from("vehicles")
      .insert({
        seller_id: user.id,
        status: "pending_inspection",
        marque: parsed.data.marque,
        modele: parsed.data.modele,
        version: parsed.data.version ?? null,
        annee: parsed.data.annee,
        kilometrage: parsed.data.kilometrage,
        carburant: parsed.data.carburant,
        transmission: parsed.data.transmission,
        couleur: parsed.data.couleur ?? null,
        nb_portes: parsed.data.nbPortes ?? null,
        puissance_cv: parsed.data.puissance ?? null,
        origine: parsed.data.origine ?? null,
        description: parsed.data.description ?? null,
        prix_depart: prixDepart,
        prix_reserve: prixReserve,
        slug,
      })
      .select("id")
      .single();

    if (vehicleError || !vehicle) {
      return { data: null, error: "Erreur lors de la création du véhicule" };
    }

    // 6. Create auction
    const now = new Date();
    const endsAt = new Date(now.getTime() + parsed.data.duree * 60 * 60 * 1000);

    const { error: auctionError } = await supabase.from("auctions").insert({
      vehicle_id: vehicle.id,
      status: "scheduled",
      starts_at: now.toISOString(),
      ends_at: endsAt.toISOString(),
      current_price: prixDepart,
      bid_count: 0,
    });

    if (auctionError) {
      return { data: null, error: "Erreur lors de la création de l'enchère" };
    }

    return { data: { vehicleId: vehicle.id, slug }, error: null };
  } catch {
    return { data: null, error: "Une erreur est survenue lors de la création du véhicule" };
  }
}
