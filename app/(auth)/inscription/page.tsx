"use client";

import { motion } from "framer-motion";

export default function InscriptionEntryPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-3xl"
      >
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl font-heading">
            Créer un compte
          </h1>
          <p className="mt-3 text-ink-secondary">
            Choisissez votre profil pour commencer.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {/* Buyer card */}
          <a
            href="/inscription/acheteur"
            className="group flex flex-col rounded-2xl border-2 border-line bg-paper p-8 text-center transition-colors hover:border-accent hover:bg-accent-tint/30"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface transition-colors group-hover:bg-accent group-hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8.5 14.5 2 2 5-5"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              </svg>
            </div>
            <h2 className="mt-5 text-xl font-bold text-ink font-heading">Je veux acheter</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
              Participez aux enchères et achetez des véhicules au meilleur prix.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-ink-muted text-left mx-auto">
              <li>· Inscription gratuite</li>
              <li>· KYC simple</li>
              <li>· Enchérissez dès validation</li>
            </ul>
            <span className="mt-6 inline-flex items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-accent-dark">
              Créer un compte acheteur &rarr;
            </span>
          </a>

          {/* Seller card */}
          <a
            href="/inscription/vendeur"
            className="group flex flex-col rounded-2xl border-2 border-line bg-paper p-8 text-center transition-colors hover:border-accent hover:bg-accent-tint/30"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface transition-colors group-hover:bg-accent group-hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-5.25a1 1 0 0 0-1.76 0L9 11 4.84 11.86a1 1 0 0 0-.84.99V16h3"/><path d="M19 8v4"/><path d="M4 8v4"/><circle cx="6.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <h2 className="mt-5 text-xl font-bold text-ink font-heading">Je veux vendre</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
              Mettez vos véhicules aux enchères et touchez des acheteurs qualifiés.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-ink-muted text-left mx-auto">
              <li>· Particulier ou entreprise</li>
              <li>· Commission 1.5%</li>
              <li>· Paiement sécurisé</li>
            </ul>
            <span className="mt-6 inline-flex items-center justify-center rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-accent-dark">
              Créer un compte vendeur &rarr;
            </span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
