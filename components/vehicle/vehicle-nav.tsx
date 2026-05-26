"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export function VehicleNav() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(!!data.session);
    });
  }, []);

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-0 text-xl font-bold tracking-tight">
          <span className="text-ink">Mazad</span>
          <span className="text-accent">Auto</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/encheres" className="text-sm font-medium text-ink-secondary hover:text-ink">Enchères</Link>
          {authenticated ? (
            <Link href="/dashboard" className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark">Mon compte</Link>
          ) : (
            <Link href="/commencer" className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark">Connexion</Link>
          )}
        </div>
      </div>
    </header>
  );
}
