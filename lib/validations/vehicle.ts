import { z } from "zod";

export const vehicleSchema = z.object({
  marque: z.string().min(1, "Marque requise").max(50),
  modele: z.string().min(1, "Modèle requis").max(50),
  version: z.string().max(100).optional(),
  annee: z.number().int().min(1990, "Année trop ancienne").max(new Date().getFullYear() + 1, "Année invalide"),
  kilometrage: z.number().int().min(0, "Kilométrage invalide").max(1000000, "Kilométrage trop élevé"),
  carburant: z.enum(["essence", "diesel", "hybride", "electrique", "gpl"]),
  transmission: z.enum(["manuelle", "automatique"]),
  couleur: z.string().max(50).optional(),
  nbPortes: z.number().int().min(2).max(5).optional(),
  puissanceCv: z.number().int().min(50).max(1000).optional(),
  origine: z.string().max(50).optional(),
  description: z.string().max(500).optional(),
});

export const auctionSettingsSchema = z.object({
  prixDepart: z.number().int().min(500, "Prix de départ minimum : 500 DT").max(500000, "Prix de départ maximum : 500 000 DT"),
  prixReserve: z.number().int().min(0).optional().nullable(),
  startsAt: z.string().datetime(),
  dureeHeures: z.enum(["24", "48", "72", "168"]),
});

export const bidSchema = z.object({
  auctionId: z.string().uuid(),
  amount: z.number().int().positive("Montant invalide"),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
export type AuctionSettingsInput = z.infer<typeof auctionSettingsSchema>;
export type BidInput = z.infer<typeof bidSchema>;
