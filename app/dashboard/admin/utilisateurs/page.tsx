"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createBrowserClient } from "@supabase/ssr";
import { isTestMode } from "@/lib/test-mode";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UserRow {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  kyc_status: string;
  created_at: string;
}

function isSupabaseReady() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "your-project-url" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "your-anon-key"
  );
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "buyer" | "seller" | "admin">("all");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseReady() || isTestMode()) {
      setUsers([
        { id: "1", email: "karim@email.com", first_name: "Karim", last_name: "Ben Ali", role: "buyer", kyc_status: "pending", created_at: "2025-01-15" },
        { id: "2", email: "contact@tunisie-location.tn", first_name: "Mohamed", last_name: "Khadhraoui", role: "seller", kyc_status: "verified", created_at: "2025-02-10" },
        { id: "3", email: "sami@email.com", first_name: "Sami", last_name: "Trabelsi", role: "buyer", kyc_status: "verified", created_at: "2025-03-22" },
        { id: "4", email: "admin@mazadauto.tn", first_name: "Admin", last_name: "User", role: "admin", kyc_status: "verified", created_at: "2024-01-01" },
      ]);
      setLoading(false);
      return;
    }

    // Note: profiles table does not have an email column.
    // In production, fetch emails from auth.users via service role or join.
    // For now we fetch profiles and supplement with client-side auth lookup if needed.
    supabase
      .from("profiles")
      .select("id, first_name, last_name, role, kyc_status, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          toast.error("Erreur de chargement des utilisateurs");
          setLoading(false);
          return;
        }
        const rows = (data ?? []).map((p) => ({
          id: p.id,
          email: "", // email not stored in profiles; would need service-role auth lookup
          first_name: p.first_name,
          last_name: p.last_name,
          role: p.role,
          kyc_status: p.kyc_status,
          created_at: p.created_at,
        }));
        setUsers(rows);
        setLoading(false);
      });
  }, []);

  const filtered = users.filter((u) => {
    const name = `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim();
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">Utilisateurs</h1>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou email..."
          className="w-full max-w-sm rounded-md border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
          className="rounded-md border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        >
          <option value="all">Tous les rôles</option>
          <option value="buyer">Acheteur</option>
          <option value="seller">Vendeur</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-full animate-pulse rounded bg-surface" />
            ))}
          </div>
        ) : (
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Nom</th>
                <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Email</th>
                <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Rôle</th>
                <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">KYC</th>
                <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Inscrit le</th>
                <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const name = `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || u.email;
                return (
                  <tr key={u.id} className="border-b border-line last:border-0">
                    <td className="py-3 text-sm font-medium text-ink">{name}</td>
                    <td className="py-3 text-sm text-ink-secondary">{u.email || "—"}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold capitalize ${
                        u.role === "admin" ? "bg-ink text-white" : u.role === "seller" ? "bg-accent-tint text-accent" : "bg-surface text-ink-secondary"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        u.kyc_status === "verified" ? "bg-accent-tint text-accent" : u.kyc_status === "pending" ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-600"
                      }`}>
                        {u.kyc_status === "verified" ? "Vérifié" : u.kyc_status === "pending" ? "En attente" : "Rejeté"}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-ink-muted">{new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button onClick={() => toast("Voir le profil")} className="text-xs font-semibold text-accent hover:text-accent-dark">Voir</button>
                        <button onClick={() => toast.error("Utilisateur suspendu")} className="text-xs font-semibold text-red-600 hover:text-red-700">Suspendre</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-sm text-ink-muted">Aucun utilisateur trouvé</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
