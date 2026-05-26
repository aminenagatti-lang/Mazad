interface VehicleJsonLdProps {
  vehicle: {
    marque: string;
    modele: string;
    annee: number;
    description: string | null;
    couleur: string | null;
    carburant: string;
    transmission: string;
    kilometrage: number;
    nb_portes: number | null;
    slug: string;
  };
  auction: {
    current_price: number;
    bid_count: number;
    ends_at: string;
  } | null;
}

export function VehicleJsonLd({ vehicle, auction }: VehicleJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${vehicle.annee} ${vehicle.marque} ${vehicle.modele}`,
    description: vehicle.description ?? `${vehicle.annee} ${vehicle.marque} ${vehicle.modele}`,
    brand: { "@type": "Brand", name: vehicle.marque },
    model: vehicle.modele,
    modelDate: String(vehicle.annee),
    color: vehicle.couleur ?? undefined,
    fuelType: vehicle.carburant,
    vehicleTransmission: vehicle.transmission,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.kilometrage,
      unitCode: "KMT",
    },
    numberOfDoors: vehicle.nb_portes ?? undefined,
    offers: auction
      ? {
          "@type": "AggregateOffer",
          priceCurrency: "TND",
          lowPrice: auction.current_price / 1000,
          offerCount: auction.bid_count,
          availability: "https://schema.org/InStock",
          url: `https://mazadauto.tn/encheres/${vehicle.slug}`,
        }
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
