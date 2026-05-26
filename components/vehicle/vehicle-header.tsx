import Link from "next/link";

interface VehicleHeaderProps {
  marque: string;
  modele: string;
  version: string | null;
  annee: number;
  kilometrage: number;
  transmission: string;
  carburant: string;
  couleur: string | null;
  sellerType: string | null;
  inspectionDate: string | null;
  prixReserve: number | null;
  prixDepart: number;
}

export function VehicleHeader({
  marque,
  modele,
  version,
  annee,
  kilometrage,
  transmission,
  carburant,
  couleur,
  sellerType,
  inspectionDate,
  prixReserve,
  prixDepart,
}: VehicleHeaderProps) {
  const fullTitle = `${annee} ${marque} ${modele}${version ? ` ${version}` : ""}`;
  const commission = Math.max(Math.round(prixDepart * 0.02), 200000); // 2% ou min 200 DT

  return (
    <div className="mt-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-ink-muted">
        <Link href="/encheres" className="hover:text-ink">Enchères</Link>
        <span className="mx-2">/</span>
        <a href="#" className="hover:text-ink">{marque}</a>
        <span className="mx-2">/</span>
        <span className="text-ink">{fullTitle}</span>
      </nav>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {inspectionDate && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-tint px-2.5 py-1 text-xs font-bold text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Inspection certifiée
          </span>
        )}
        <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-ink-secondary capitalize">
          {sellerType === "entreprise" ? "Professionnel" : sellerType ?? "Particulier"}
        </span>
        {prixReserve === null && (
          <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-bold text-yellow-700">
            Sans réserve
          </span>
        )}
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
          Commission : {(commission / 1000).toLocaleString("fr-FR")} DT
        </span>
      </div>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink font-heading sm:text-4xl">
        {fullTitle}
      </h1>
      <p className="mt-2 text-ink-secondary">
        {kilometrage.toLocaleString("fr-FR")} km · {transmission} · {carburant} · {couleur ?? "—"}
      </p>
    </div>
  );
}
