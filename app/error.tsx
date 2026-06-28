"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console (Sentry would be here when configured)
    console.error(error);
  }, [error]);

  const errorMessage = error?.message || "Erreur inconnue";
  const errorStack = error?.stack || "";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">
        Une erreur est survenue
      </h1>
      <p className="mt-2 max-w-lg text-center text-ink-secondary">
        {errorMessage}
      </p>
      {errorStack && (
        <pre className="mt-4 max-h-60 max-w-lg overflow-auto rounded bg-surface p-3 text-xs text-ink-secondary">
          {errorStack}
        </pre>
      )}
      <button
        onClick={reset}
        className="mt-6 rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
      >
        Réessayer
      </button>
      <Link
        href="/"
        className="mt-3 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
