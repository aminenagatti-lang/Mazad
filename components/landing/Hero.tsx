"use client";

import { motion } from "framer-motion";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

function VehicleCardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
      className="relative w-full max-w-md overflow-hidden rounded-2xl bg-paper shadow-card"
    >
      <div className="aspect-video bg-surface flex items-center justify-center relative">
        <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">PHOTO</span>
        <div className="absolute top-3 right-3 rounded-full bg-accent-tint px-2.5 py-1 text-xs font-semibold text-accent">En cours</div>
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-bold text-ink font-heading">Peugeot 308</h3>
          <span className="text-sm font-medium text-ink-secondary">2019</span>
        </div>
        <p className="mt-1 text-sm text-ink-muted">Tunis · 78 000 km · Diesel</p>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium text-ink-muted uppercase tracking-wide">Enchère actuelle</p>
            <p className="mt-0.5 text-2xl font-bold text-accent font-heading">42 500 DT</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-ink-muted uppercase tracking-wide">Temps restant</p>
            <CountdownTimer endDate={new Date(Date.now() + 12 * 60 * 60 * 1000 + 34 * 60 * 1000)} size="sm" />
          </div>
        </div>
        <Link href="/encheres" className="mt-5 block w-full rounded-md bg-ink py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-accent">
          Voir la fiche &rarr;
        </Link>
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-paper"
      style={{ backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)", backgroundSize: "24px 24px" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-start">
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center rounded-full bg-accent-tint px-3 py-1 text-xs font-semibold text-accent">Enchères · Tunisie</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl font-heading">
              Les enchères pro
              <br />
              de l&apos;automobile
              <br />
              tunisienne.
            </motion.h1>

            <motion.p variants={itemVariants} className="mt-6 max-w-lg text-lg leading-8 text-ink-secondary">
              MazadAuto connecte particuliers et professionnels pour acheter et vendre des véhicules aux enchères. Transparence totale, adjudication en 48h.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-4">
              <Link href="/encheres" className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-dark">
                Voir les enchères
              </Link>
              <Link href="/commencer" className="inline-flex items-center justify-center rounded-md border border-ink bg-transparent px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white">
                Vendre un véhicule
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 flex flex-wrap gap-8">
              {[
                { value: "120+", label: "véhicules" },
                { value: "48h", label: "délai moyen" },
                { value: "4%", label: "commission" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-ink font-heading">{stat.value}</p>
                  <p className="mt-0.5 text-sm text-ink-secondary">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="flex justify-center lg:justify-end">
            <VehicleCardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
