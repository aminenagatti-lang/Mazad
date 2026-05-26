"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

interface SellerInfo {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  city: string | null;
  company_name: string | null;
}

interface VehicleInfo {
  marque: string;
  modele: string;
  annee: number;
}

export default function ConfirmationPage({ params }: { params: Promise<{ slug: string }> }) {
  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const [vehicle, setVehicle] = useState<VehicleInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const slug = typeof window !== "undefined" ? window.location.pathname.split("/")[2] : "";

  useEffect(() => {
    if (!slug) return;
    fetchSellerInfo();
  }, [slug]);

  async function fetchSellerInfo() {
    try {
      const res = await fetch(`/api/seller-info?slug=${slug}`);
      const data = await res.json();
      if (data.seller) {
        setSeller(data.seller);
        setVehicle(data.vehicle);
      }
    } catch {
      toast.error("Erreur de chargement des coordonnées");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg text-ink">Coordonnées indisponibles</p>
          <p className="mt-2 text-sm text-ink-secondary">
            Assurez-vous d&apos;avoir payé la commission plateforme.
          </p>
          <Link href={`/encheres/${slug}/victoire`} className="mt-4 inline-block text-sm text-accent">
            Retour au paiement →
          </Link>
        </div>
      </div>
    );
  }

  const vehicleName = vehicle ? `${vehicle.marque} ${vehicle.modele} ${vehicle.annee}` : "Votre véhicule";

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-md"
      >
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-tint">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-ink font-heading">
            Paiement confirmé
          </h1>
          <p className="mt-2 text-sm text-ink-secondary">
            Les coordonnées du vendeur sont maintenant débloquées pour <strong>{vehicleName}</strong>
          </p>
        </div>

        {/* Seller Card */}
        <div className="mt-6 rounded-xl border border-line bg-paper p-5">
          <h3 className="text-sm font-bold text-ink">Coordonnées du vendeur</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-ink">
                  {seller.first_name ?? ""} {seller.last_name ?? ""}
                  {seller.company_name && (
                    <span className="ml-1 text-xs text-ink-muted">({seller.company_name})</span>
                  )}
                </p>
                <p className="text-xs text-ink-muted">Vendeur</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-ink">{seller.phone ?? "Non disponible"}</p>
                <p className="text-xs text-ink-muted">Téléphone</p>
              </div>
            </div>

            {seller.phone && (
              <a
                href={`https://wa.me/${seller.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26 9.87 9.87 0 019.865-9.865 9.87 9.87 0 016.984 2.888 9.87 9.87 0 012.889 6.984 9.869 9.869 0 01-9.865 9.865M12 2.167a9.833 9.833 0 00-9.833 9.833 9.787 9.787 0 001.293 4.907L2.09 21.166l4.329-1.124a9.817 9.817 0 004.581 1.142 9.833 9.833 0 009.833-9.833 9.833 9.833 0 00-9.833-9.833z"/></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">Contacter sur WhatsApp</p>
                  <p className="text-xs text-ink-muted">Réponse rapide garantie</p>
                </div>
              </a>
            )}

            {seller.city && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{seller.city}</p>
                  <p className="text-xs text-ink-muted">Ville</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reminder */}
        <div className="mt-4 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Prochaines étapes :</strong>
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-blue-700">
            <li>Contactez le vendeur pour organiser une visite</li>
            <li>Payez le prix du véhicule directement au vendeur (espèces ou virement)</li>
            <li>Signez l&apos;acte de vente en mairie ou chez un notaire</li>
            <li>Effectuez le transfert de carte grise</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <Link href="/dashboard/acheteur" className="text-sm font-medium text-accent hover:text-accent-dark">
            Aller à mon dashboard →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
