import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVehicleBySlug, getSimilarVehicles } from "@/lib/data/vehicles-server";
import { PhotoGallery } from "@/components/vehicle/photo-gallery";
import { VehicleHeader } from "@/components/vehicle/vehicle-header";
import { SpecsGrid } from "@/components/vehicle/specs-grid";
import { InspectionReport } from "@/components/vehicle/inspection-report";
import { BidManager } from "./bid-manager";
import { SimilarAuctions } from "@/components/vehicle/similar-auctions";
import { VehicleJsonLd } from "@/components/seo/vehicle-jsonld";
import { getPublicUrl } from "@/lib/supabase/storage";
import Link from "next/link";

export async function generateStaticParams() {
  // In production with real data, you may want to disable static generation
  // or fetch slugs at build time. For now, return empty to allow dynamic rendering.
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) {
    return { title: "Enchère introuvable — MazadAuto" };
  }

  const title = `${vehicle.annee} ${vehicle.marque} ${vehicle.modele}`;
  const currentPrice = vehicle.current_price / 1000;
  const imageUrl = `/api/og?title=${encodeURIComponent(title)}&price=${currentPrice}`;
  const description =
    `${vehicle.annee} ${vehicle.marque} ${vehicle.modele}, ` +
    `${vehicle.kilometrage.toLocaleString("fr-FR")} km, ${vehicle.carburant}. ` +
    `Enchère actuelle: ${currentPrice.toLocaleString("fr-FR")} DT. Enchérissez sur MazadAuto.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      type: "website",
      locale: "fr_TN",
      siteName: "MazadAuto",
      url: `https://mazadauto.tn/encheres/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://mazadauto.tn/encheres/${slug}`,
    },
  };
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const specs = [
    { label: "Année", value: vehicle.annee.toString() },
    { label: "Kilométrage", value: `${vehicle.kilometrage.toLocaleString("fr-FR")} km` },
    { label: "Carburant", value: vehicle.carburant },
    { label: "Boîte", value: vehicle.transmission },
    { label: "Couleur", value: vehicle.couleur ?? "—" },
    { label: "Puissance", value: vehicle.puissance_cv ? `${vehicle.puissance_cv} ch` : "—" },
    { label: "Portes", value: vehicle.nb_portes?.toString() ?? "—" },
    { label: "Origine", value: vehicle.origine ?? "Tunisie" },
  ];

  const similarVehiclesRaw = await getSimilarVehicles(slug, 3);
  const similarVehicles = similarVehiclesRaw.map((v) => ({
    id: v.id,
    slug: v.slug,
    marque: v.marque,
    modele: v.modele,
    annee: v.annee,
    current_price: v.current_price,
    bid_count: v.bid_count,
    ends_at: v.ends_at,
  }));

  const auction = {
    id: vehicle.id,
    vehicle_id: vehicle.id,
    status: "active" as const,
    starts_at: new Date().toISOString(),
    ends_at: vehicle.ends_at,
    current_price: vehicle.current_price,
    bid_count: vehicle.bid_count,
    winner_id: null,
    created_at: new Date().toISOString(),
  };

  return (
    <div className="min-h-full bg-paper">
      <VehicleJsonLd
        vehicle={{
          marque: vehicle.marque,
          modele: vehicle.modele,
          annee: vehicle.annee,
          description: vehicle.description ?? "",
          couleur: vehicle.couleur,
          carburant: vehicle.carburant,
          transmission: vehicle.transmission,
          kilometrage: vehicle.kilometrage,
          nb_portes: vehicle.nb_portes,
          slug: vehicle.slug,
        }}
        auction={{
          current_price: vehicle.current_price,
          bid_count: vehicle.bid_count,
          ends_at: vehicle.ends_at,
        }}
      />

      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-0 text-xl font-bold tracking-tight">
            <span className="text-ink">Mazad</span>
            <span className="text-accent">Auto</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/encheres" className="text-sm font-medium text-ink-secondary hover:text-ink">Enchères</Link>
            <Link href="/dashboard/acheteur" className="text-sm font-medium text-ink-secondary hover:text-ink">Dashboard</Link>
            <Link href="/commencer" className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark">Connexion</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
        <BidManager
          auction={auction}
          currentUser={null}
          initialBids={[]}
          initialBidCount={vehicle.bid_count}
        >
          <PhotoGallery
            photos={vehicle.photos}
            vehicleName={`${vehicle.marque} ${vehicle.modele}`}
          />

          <VehicleHeader
            marque={vehicle.marque}
            modele={vehicle.modele}
            version={vehicle.version}
            annee={vehicle.annee}
            kilometrage={vehicle.kilometrage}
            transmission={vehicle.transmission}
            carburant={vehicle.carburant}
            couleur={vehicle.couleur}
            sellerType={vehicle.seller_type}
            inspectionDate={vehicle.inspection_date}
            prixReserve={vehicle.prix_reserve}
            prixDepart={vehicle.prix_depart}
          />

          <SpecsGrid specs={specs} />

          {vehicle.description && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-ink font-heading">Description du vendeur</h2>
              <p className="mt-3 leading-7 text-ink-secondary">{vehicle.description}</p>
            </div>
          )}

          <InspectionReport
            items={vehicle.inspection_items}
            score={vehicle.inspection_score ?? null}
          />

          {vehicle.documents && vehicle.documents.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-ink font-heading">Documents</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {vehicle.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={getPublicUrl("vehicle-documents", doc.storage_path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-line bg-paper px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    {doc.file_name ?? "Document"}
                  </a>
                ))}
              </div>
            </div>
          )}
        </BidManager>

        <SimilarAuctions vehicles={similarVehicles} />
      </main>
    </div>
  );
}
