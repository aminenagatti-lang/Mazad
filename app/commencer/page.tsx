"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CommencerPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-lg text-center"
      >
        <Link href="/" className="inline-flex items-center gap-0 text-2xl font-bold tracking-tight">
          <span className="text-ink">Mazad</span>
          <span className="text-accent">Auto</span>
        </Link>

        <h1 className="mt-10 text-3xl font-extrabold tracking-tight text-ink font-heading sm:text-4xl">
          Commencer sur MazadAuto
        </h1>
        <p className="mt-3 text-ink-secondary">
          Connectez-vous à votre compte ou créez-en un nouveau pour acheter ou vendre des véhicules.
        </p>

        <div className="mt-10 flex flex-col gap-4">
          <Link
            href="/connexion"
            className="inline-flex items-center justify-center rounded-xl border border-ink bg-paper px-6 py-4 text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            J&apos;ai déjà un compte — Connexion
          </Link>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-line" />
            <span className="text-xs font-medium text-ink-muted">ou</span>
            <div className="h-px flex-1 bg-line" />
          </div>

          <Link
            href="/inscription/nouveau"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            Créer un compte gratuitement
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 text-left">
          <div className="rounded-lg bg-paper p-4">
            <p className="text-sm font-semibold text-ink">Acheteur</p>
            <p className="mt-1 text-xs text-ink-secondary">Parcourez les enchères et achetez au meilleur prix.</p>
          </div>
          <div className="rounded-lg bg-paper p-4">
            <p className="text-sm font-semibold text-ink">Vendeur</p>
            <p className="mt-1 text-xs text-ink-secondary">Mettez vos véhicules en vente et touchez des acheteurs.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
