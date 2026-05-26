interface SellerCardProps {
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  sellerType: string | null;
  kycStatus: string | null;
  memberSince: string;
  listingCount: number;
}

export function SellerCard({
  firstName,
  lastName,
  companyName,
  sellerType,
  kycStatus,
  memberSince,
  listingCount,
}: SellerCardProps) {
  const displayName = companyName ?? `${firstName ?? ""} ${lastName ?? ""}`.trim();
  const initials = companyName
    ? companyName.slice(0, 2).toUpperCase()
    : `${(firstName?.[0] ?? "")}${(lastName?.[0] ?? "")}`.toUpperCase() || "V";

  return (
    <div className="mt-6 flex items-center gap-3 rounded-lg border border-line bg-surface p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-bold text-white text-sm font-heading">
        {initials}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-ink">{displayName || "Vendeur"}</span>
          {kycStatus === "verified" && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-accent-tint px-1.5 py-0.5 text-[10px] font-bold text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Vérifié
            </span>
          )}
        </div>
        <p className="text-xs text-ink-muted capitalize">
          {sellerType === "entreprise" ? "Professionnel" : "Particulier"} · {listingCount} annonces
        </p>
      </div>
    </div>
  );
}
