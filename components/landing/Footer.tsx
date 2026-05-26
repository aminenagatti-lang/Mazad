"use client";

import Link from "next/link";

const platformLinks = [
  { label: "Enchères en cours", href: "#encheres" },
  { label: "Comment ça marche", href: "#comment-ca-marche" },
  { label: "Tarifs", href: "#" },
];

const sellerLinks = [
  { label: "Déposer un véhicule", href: "#vendre" },
  { label: "Nos garanties", href: "#" },
  { label: "FAQ vendeurs", href: "#" },
];

const legalLinks = [
  { label: "Conditions d'utilisation", href: "#" },
  { label: "Politique de confidentialité", href: "#" },
  { label: "Mentions légales", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-surface border-t border-line">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Tagline */}
          <div>
            <Link href="/" className="inline-flex items-center gap-0 text-xl font-bold tracking-tight">
              <span className="text-ink">Mazad</span>
              <span className="text-accent">Auto</span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-ink-secondary">
              La plateforme B2B de référence pour les enchères automobiles en Tunisie.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Plateforme
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-ink-secondary transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Vendeurs */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Vendeurs
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {sellerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-ink-secondary transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Légal
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-ink-secondary transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-8 text-center">
          <p className="text-xs text-ink-muted">
            &copy; 2025 MazadAuto · Tunis, Tunisie
          </p>
        </div>
      </div>
    </footer>
  );
}
