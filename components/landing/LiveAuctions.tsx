"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import Link from "next/link";
import { getAllVehiclesClient, type VehicleWithAuction } from "@/lib/data/vehicles-client";
import { getPublicUrl } from "@/lib/supabase/storage";

function AuctionCard({ auction, index }: { auction: VehicleWithAuction; index: number }) {
  const coverPhoto = auction.photos.find((p) => p.is_cover) ?? auction.photos[0];
  const imageSrc = coverPhoto ? getPublicUrl("vehicle-photos", coverPhoto.storage_path) : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -4, boxShadow: "var(--shadow-card-hover)" }}
      className="flex w-full flex-col overflow-hidden rounded-xl bg-paper shadow-card transition-shadow lg:w-72 lg:shrink-0"
    >
      <Link href={`/encheres/${auction.slug}`} className="relative aspect-video bg-surface block">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`${auction.marque} ${auction.modele}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 50vw, 300px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">PHOTO</span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-base font-bold text-ink font-heading">{auction.marque} {auction.modele}</h3>
          <span className="text-sm font-medium text-ink-secondary">{auction.annee}</span>
        </div>
        <p className="mt-1 text-xs text-ink-muted">{auction.carburant} · {auction.transmission}</p>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              Enchère actuelle
            </p>
            <p className="mt-0.5 text-xl font-bold text-accent font-heading">
              {(auction.current_price / 1000).toLocaleString("fr-FR")} DT
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              Temps restant
            </p>
            <CountdownTimer endDate={new Date(auction.ends_at)} size="sm" />
          </div>
        </div>
        <Link
          href={`/encheres/${auction.slug}`}
          className="mt-4 block w-full rounded-md bg-ink py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-accent"
        >
          Voir la fiche &rarr;
        </Link>
      </div>
    </motion.div>
  );
}

export function LiveAuctions() {
  const [auctions, setAuctions] = useState<VehicleWithAuction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAllVehiclesClient().then((data) => {
      if (!cancelled) {
        setAuctions(data.slice(0, 4));
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="encheres" className="bg-paper py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex items-center gap-3">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl font-heading">
            Enchères en cours
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-tint px-2.5 py-1 text-xs font-bold text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
            </span>
            Live
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-5 lg:flex lg:overflow-x-auto lg:pb-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse w-full lg:w-72 lg:shrink-0 overflow-hidden rounded-xl">
                <div className="aspect-video bg-gray-200" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                  <div className="h-6 w-1/3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 lg:flex lg:overflow-x-auto lg:pb-4">
            {auctions.map((auction, i) => (
              <AuctionCard key={auction.id} auction={auction} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
