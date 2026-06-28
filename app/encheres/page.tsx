"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { FilterSidebar } from "@/components/search/filter-sidebar";
import { SortAndFilterBar } from "@/components/search/sort-and-filter-bar";
import { ActiveFiltersBar } from "@/components/search/active-filters-bar";
import { Pagination } from "@/components/search/pagination";
import { EmptyState } from "@/components/search/empty-state";
import { getAllVehiclesClient, type VehicleWithAuction } from "@/lib/data/vehicles-client";
import { getPublicUrl } from "@/lib/supabase/storage";
import Link from "next/link";

const MotionLink = motion(Link);

export default function EncheresPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [vehicles, setVehicles] = useState<VehicleWithAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const page = Number(searchParams.get("page") || "1");
  const perPage = 12;

  useEffect(() => {
    let cancelled = false;
    getAllVehiclesClient().then((data) => {
      if (!cancelled) {
        setVehicles(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const currentFilters = useMemo(() => {
    const f: Record<string, string> = {};
    ["marque", "carburant", "transmission", "prix_min", "prix_max", "km_max", "annee_min"].forEach(
      (key) => {
        const val = searchParams.get(key);
        if (val) f[key] = val;
      }
    );
    return f;
  }, [searchParams]);

  const currentSort = searchParams.get("sort") || "";

  const activeFilterCount = Object.keys(currentFilters).length;

  const filtered = useMemo(() => {
    let data = [...vehicles];

    const norm = (s: string) =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (currentFilters.marque) data = data.filter((d) => norm(d.marque) === norm(currentFilters.marque));
    if (currentFilters.carburant)
      data = data.filter((d) => norm(d.carburant) === norm(currentFilters.carburant));
    if (currentFilters.transmission)
      data = data.filter((d) => norm(d.transmission) === norm(currentFilters.transmission));
    if (currentFilters.prix_min)
      data = data.filter((d) => d.current_price >= Number(currentFilters.prix_min) * 1000);
    if (currentFilters.prix_max)
      data = data.filter((d) => d.current_price <= Number(currentFilters.prix_max) * 1000);
    if (currentFilters.km_max) data = data.filter((d) => d.kilometrage <= Number(currentFilters.km_max));
    if (currentFilters.annee_min) data = data.filter((d) => d.annee >= Number(currentFilters.annee_min));

    switch (currentSort) {
      case "ending_soon":
        data.sort((a, b) => new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime());
        break;
      case "price_asc":
        data.sort((a, b) => a.current_price - b.current_price);
        break;
      case "price_desc":
        data.sort((a, b) => b.current_price - a.current_price);
        break;
      default:
        data.sort((a, b) => new Date(b.ends_at).getTime() - new Date(a.ends_at).getTime());
    }

    return data;
  }, [vehicles, currentFilters, currentSort]);

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / perPage);
  const from = (page - 1) * perPage;
  const pageData = filtered.slice(from, from + perPage);

  const uniqueMarques = Array.from(new Set(vehicles.map((v) => v.marque)));

  const navigateWithFilters = (newFilters: Record<string, string>, newSort?: string, newPage?: number) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (newSort) params.set("sort", newSort);
    if (newPage && newPage > 1) params.set("page", String(newPage));
    router.push(`/encheres?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-0 text-xl font-bold tracking-tight">
            <span className="text-ink">Mazad</span>
            <span className="text-accent">Auto</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/commencer" className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark">
              Connexion
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink font-heading">
            Enchères en cours
          </h1>
          <p className="mt-1 text-ink-secondary">
            {totalCount} véhicule{totalCount !== 1 ? "s" : ""} disponible{totalCount !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Mobile filter trigger */}
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-line bg-paper px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>
            Filtrer
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop filter sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <FilterSidebar
              marques={uniqueMarques}
              currentFilters={currentFilters}
              onChange={(f) => navigateWithFilters(f, currentSort, 1)}
            />
          </aside>

          <div className="flex-1">
            <SortAndFilterBar
              currentSort={currentSort}
              currentFilters={currentFilters}
              marques={uniqueMarques}
              onSortChange={(sort) => navigateWithFilters(currentFilters, sort, 1)}
              onFilterChange={(f) => navigateWithFilters(f, currentSort, 1)}
            />

            <ActiveFiltersBar
              filters={currentFilters}
              onRemove={(key) => {
                const next = { ...currentFilters };
                delete next[key];
                navigateWithFilters(next, currentSort, 1);
              }}
            />

            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse overflow-hidden rounded-xl border border-gray-100">
                    <div className="aspect-video bg-gray-200" />
                    <div className="space-y-3 p-4">
                      <div className="h-5 w-3/4 bg-gray-200 rounded" />
                      <div className="h-4 w-1/2 bg-gray-200 rounded" />
                      <div className="h-6 w-1/3 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : pageData.length === 0 ? (
              <EmptyState onReset={() => navigateWithFilters({}, currentSort, 1)} />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {pageData.map((auction) => (
                  <VehicleCard key={auction.id} auction={auction} />
                ))}
              </div>
            )}

            {!loading && totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => navigateWithFilters(currentFilters, currentSort, p)}
              />
            )}
          </div>
        </div>
      </main>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-paper p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-ink font-heading">Filtrer</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-ink-secondary hover:text-ink"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <FilterSidebar
                marques={uniqueMarques}
                currentFilters={currentFilters}
                onChange={(f) => {
                  navigateWithFilters(f, currentSort, 1);
                  setMobileFiltersOpen(false);
                }}
              />
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="mt-6 w-full rounded-md bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
              >
                Appliquer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VehicleCard({ auction }: { auction: VehicleWithAuction }) {
  const [imgError, setImgError] = useState(false);

  const coverPhoto = auction.photos.find((p) => p.is_cover) ?? auction.photos[0];
  const imageSrc = coverPhoto ? getPublicUrl("vehicle-photos", coverPhoto.storage_path) : "";

  return (
    <MotionLink
      href={`/encheres/${auction.slug}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      data-testid="vehicle-card"
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-paper shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="relative aspect-video bg-surface">
        {imageSrc && !imgError ? (
          <Image
            src={imageSrc}
            alt={`${auction.marque} ${auction.modele}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">PHOTO</span>
          </div>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-white">
          Enchère en cours
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-base font-bold text-ink font-heading">
            {auction.marque} {auction.modele}
          </h3>
          <span className="text-sm text-ink-secondary">{auction.annee}</span>
        </div>

        <p className="mt-1 text-xs text-ink-muted">
          {auction.kilometrage.toLocaleString("fr-FR")} km · {auction.carburant} · {auction.transmission}
          {auction.couleur ? ` · ${auction.couleur}` : ""}
        </p>

        <div className="mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            Enchère actuelle
          </p>
          <p className="mt-0.5 text-xl font-bold text-accent font-heading">
            {(auction.current_price / 1000).toLocaleString("fr-FR")} DT
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <CountdownTimer endDate={new Date(auction.ends_at)} size="sm" />
          <span className="text-xs text-ink-muted">{auction.bid_count} enchères</span>
        </div>
      </div>
    </MotionLink>
  );
}
