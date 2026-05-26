import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mockVehicles } from "@/lib/data/mock-vehicles";
import { PhotoGallery } from "@/components/vehicle/photo-gallery";
import { VehicleHeader } from "@/components/vehicle/vehicle-header";
import { SpecsGrid } from "@/components/vehicle/specs-grid";
import { InspectionReport } from "@/components/vehicle/inspection-report";
import { BidManager } from "./bid-manager";
import { SimilarAuctions } from "@/components/vehicle/similar-auctions";
import { VehicleJsonLd } from "@/components/seo/vehicle-jsonld";
import Link from "next/link";

export function generateStaticParams() {
  return mockVehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mock = mockVehicles.find((v) => v.slug === slug);
  if (!mock) {
    return { title: "Enchère introuvable — MazadAuto" };
  }

  const title = `${mock.annee} ${mock.marque} ${mock.modele}`;
  const currentPrice = mock.auction.current_price / 1000;
  const imageUrl = `/api/og?title=${encodeURIComponent(title)}&price=${currentPrice}`;
  const description =
    `${mock.annee} ${mock.marque} ${mock.modele}, ` +
    `${mock.kilometrage.toLocaleString("fr-FR")} km, ${mock.carburant}. ` +
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
  const mock = mockVehicles.find((v) => v.slug === slug);
  if (!mock) notFound();

  const specs = [
    { label: "Année", value: mock.annee.toString() },
    { label: "Kilométrage", value: `${mock.kilometrage.toLocaleString("fr-FR")} km` },
    { label: "Carburant", value: mock.carburant },
    { label: "Boîte", value: mock.transmission },
    { label: "Couleur", value: mock.couleur ?? "—" },
    { label: "Puissance", value: mock.puissance_cv ? `${mock.puissance_cv} ch` : "—" },
    { label: "Portes", value: mock.nb_portes?.toString() ?? "—" },
    { label: "Origine", value: mock.origine ?? "Tunisie" },
  ];

  const bids = [...mock.auction.bids].sort(
    (a, b) => new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime()
  );

  const similarVehicles = mockVehicles
    .filter((v) => v.id !== mock.id)
    .slice(0, 3)
    .map((v) => ({
      id: v.id,
      slug: v.slug,
      marque: v.marque,
      modele: v.modele,
      annee: v.annee,
      current_price: v.auction.current_price,
      bid_count: v.auction.bid_count,
      ends_at: v.auction.ends_at,
    }));

  const auction = {
    id: mock.auction.id,
    vehicle_id: mock.id,
    status: "active" as const,
    starts_at: new Date().toISOString(),
    ends_at: mock.auction.ends_at,
    current_price: mock.auction.current_price,
    bid_count: mock.auction.bid_count,
    winner_id: null,
    created_at: new Date().toISOString(),
  };

  return (
    <div className="min-h-full bg-paper">
      <VehicleJsonLd
        vehicle={{
          marque: mock.marque,
          modele: mock.modele,
          annee: mock.annee,
          description: mock.description,
          couleur: mock.couleur,
          carburant: mock.carburant,
          transmission: mock.transmission,
          kilometrage: mock.kilometrage,
          nb_portes: mock.nb_portes,
          slug: mock.slug,
        }}
        auction={{
          current_price: mock.auction.current_price,
          bid_count: mock.auction.bid_count,
          ends_at: mock.auction.ends_at,
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
          initialBids={bids}
          initialBidCount={mock.auction.bid_count}
        >
          <PhotoGallery
            photos={mock.photos}
            vehicleName={`${mock.marque} ${mock.modele}`}
          />

          <VehicleHeader
            marque={mock.marque}
            modele={mock.modele}
            version={mock.version}
            annee={mock.annee}
            kilometrage={mock.kilometrage}
            transmission={mock.transmission}
            carburant={mock.carburant}
            couleur={mock.couleur}
            sellerType={mock.seller_type}
            inspectionDate={mock.inspection_date}
            prixReserve={mock.prix_reserve}
            prixDepart={mock.prix_depart}
          />

          <SpecsGrid specs={specs} />

          {mock.description && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-ink font-heading">Description du vendeur</h2>
              <p className="mt-3 leading-7 text-ink-secondary">{mock.description}</p>
            </div>
          )}

          <InspectionReport
            items={mock.inspection_items}
            score={mock.inspection_score ?? null}
          />

          {/* Inspection / Technical Control Document */}
          {mock.inspection_document && (
            <div className="mt-8 rounded-xl border border-line bg-paper p-5">
              <h2 className="text-lg font-bold text-ink font-heading">Document de contrôle</h2>
              <p className="mt-1 text-sm text-ink-secondary">Rapport d&apos;inspection / Contrôle technique du véhicule.</p>
              <a
                href={mock.inspection_document.storage_path}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Télécharger le rapport
              </a>
            </div>
          )}
        </BidManager>

        <SimilarAuctions vehicles={similarVehicles} />
      </main>
    </div>
  );
}
