'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function VehicleDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h2 className="mt-6 text-xl font-extrabold text-ink font-heading">Impossible de charger cette enchère</h2>
      <p className="mt-2 text-sm text-ink-secondary">{error.message || "Veuillez réessayer."}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          Réessayer
        </button>
        <Link
          href="/encheres"
          className="rounded-md border border-line bg-paper px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface"
        >
          Retour aux enchères
        </Link>
      </div>
    </div>
  );
}
