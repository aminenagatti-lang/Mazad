"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Toggle } from "@/components/ui/toggle";
import { useUser, useProfile } from "@/lib/dashboard/hooks";

export default function BuyerProfilePage() {
  const { user, loading: userLoading } = useUser();
  const { save, saving } = useProfile(user?.id);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    city: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        city: user.city ?? "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    const res = await save({
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
      city: form.city,
    });
    if (res.success) {
      toast.success("Profil mis à jour");
      setEditMode(false);
    } else {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const fields = [
    { label: "Prénom", key: "first_name" as const },
    { label: "Nom", key: "last_name" as const },
    { label: "Email", key: "email" as const, readOnly: true },
    { label: "Téléphone", key: "phone" as const },
    { label: "Ville", key: "city" as const },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">Mon profil</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-paper p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink font-heading">Informations personnelles</h2>
            <button
              onClick={() => setEditMode((e) => !e)}
              data-testid="edit-profile"
              className="text-sm font-semibold text-accent hover:text-accent-dark"
            >
              {editMode ? "Annuler" : "Modifier"}
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {userLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 w-16 animate-pulse rounded bg-surface" />
                  <div className="mt-1 h-6 w-full animate-pulse rounded bg-surface" />
                </div>
              ))
            ) : (
              fields.map((f) => (
                <div key={f.key}>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">{f.label}</p>
                  {editMode && !f.readOnly ? (
                    <input
                      value={form[f.key]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      className="mt-1 block w-full rounded-md border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                  ) : (
                    <p className="mt-1 text-sm font-medium text-ink">{form[f.key] || "—"}</p>
                  )}
                </div>
              ))
            )}
          </div>
          {editMode && (
            <button
              onClick={handleSave}
              disabled={saving}
              data-testid="save-profile"
              className="mt-6 w-full rounded-md bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
            >
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-line bg-paper p-6">
            <h2 className="text-lg font-bold text-ink font-heading">KYC</h2>
            <div className="mt-4 space-y-3">
              <div className={`flex items-center justify-between rounded-lg px-4 py-3 ${user?.kyc_status === "verified" ? "bg-accent-tint" : "bg-surface"}`}>
                <span className={`text-sm font-medium ${user?.kyc_status === "verified" ? "text-accent" : "text-ink-secondary"}`}>Statut KYC</span>
                <span className={`text-xs font-bold ${user?.kyc_status === "verified" ? "text-accent" : user?.kyc_status === "rejected" ? "text-red-600" : "text-yellow-600"}`}>
                  {user?.kyc_status === "verified" ? "Vérifié" : user?.kyc_status === "rejected" ? "Refusé" : "En attente"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent-tint px-4 py-3">
                <span className="text-sm font-medium text-accent">CIN recto</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-accent-tint px-4 py-3">
                <span className="text-sm font-medium text-accent">CIN verso</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface px-4 py-3">
                <span className="text-sm font-medium text-ink-secondary">Selfie</span>
                <span className="text-xs font-medium text-ink-muted">Optionnel</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-paper p-6">
            <h2 className="text-lg font-bold text-ink font-heading">Préférences de notifications</h2>
            <NotificationToggles />
          </div>

          <div className="rounded-xl border border-line bg-paper p-6">
            <h2 className="text-lg font-bold text-ink font-heading">Sécurité</h2>
            <button className="mt-4 w-full rounded-md border border-line bg-paper py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface">
              Changer mon mot de passe
            </button>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-lg font-bold text-red-700 font-heading">Zone dangereuse</h2>
            <button
              onClick={() => toast.error("Fonctionnalité à confirmer")}
              className="mt-4 w-full rounded-md bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationToggles() {
  const [emailOn, setEmailOn] = useState(true);
  const [smsOn, setSmsOn] = useState(false);

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="font-medium text-sm text-ink">Emails</p>
          <p className="text-sm text-ink-secondary">Surenchères, fins d&apos;enchères, mises à jour du compte</p>
        </div>
        <Toggle checked={emailOn} onChange={setEmailOn} />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="font-medium text-sm text-ink">SMS</p>
          <p className="text-sm text-ink-secondary">Surenchères urgentes et enchères se terminant bientôt</p>
          <p className="text-xs text-ink-muted">Envoyés sur le +216 20 123 456</p>
        </div>
        <Toggle checked={smsOn} onChange={setSmsOn} />
      </div>
    </div>
  );
}
