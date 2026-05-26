"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import Link from "next/link";

const now = new Date();
const auctions = [
  {
    id: 1,
    slug: "renault-clio-iv-intens-2018",
    name: "Renault Clio IV",
    year: 2018,
    location: "Tunis",
    bid: "31 500",
    endDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
  },
  {
    id: 2,
    slug: "volkswagen-passat-carat-2020",
    name: "Volkswagen Passat",
    year: 2020,
    location: "Ariana",
    bid: "58 000",
    endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
  },
  {
    id: 3,
    slug: "ford-ranger-wildtrak-2021",
    name: "Ford Ranger",
    year: 2021,
    location: "Sousse",
    bid: "74 500",
    endDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
  },
  {
    id: 4,
    slug: "hyundai-tucson-executive-2019",
    name: "Hyundai Tucson",
    year: 2019,
    location: "Tunis",
    bid: "46 800",
    endDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000),
  },
];

function AuctionCard({ auction, index }: { auction: (typeof auctions)[0]; index: number }) {
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/og?title=${encodeURIComponent(auction.name)}&price=${auction.bid.replace(/\s/g, "")}`}
          alt={auction.name}
          className="h-full w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-base font-bold text-ink font-heading">{auction.name}</h3>
          <span className="text-sm font-medium text-ink-secondary">{auction.year}</span>
        </div>
        <p className="mt-1 text-xs text-ink-muted">{auction.location}</p>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              Enchère actuelle
            </p>
            <p className="mt-0.5 text-xl font-bold text-accent font-heading">
              {auction.bid} DT
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              Temps restant
            </p>
            <CountdownTimer endDate={auction.endDate} size="sm" />
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

        {/* 2-col grid on mobile, horizontal scroll on desktop */}
        <div className="grid grid-cols-2 gap-5 lg:flex lg:overflow-x-auto lg:pb-4">
          {auctions.map((auction, i) => (
            <AuctionCard key={auction.id} auction={auction} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
