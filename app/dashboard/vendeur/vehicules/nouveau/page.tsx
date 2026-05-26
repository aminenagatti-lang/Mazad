"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StepIndicator } from "@/components/ui/step-indicator";
import { FileUploadZone } from "@/components/ui/file-upload-zone";
import { createVehicle } from "@/app/actions/vehicles";
import { supabase } from "@/lib/supabase/client";

const steps = ["Véhicule", "Photos", "Documents", "Enchère"];

const marques = ["Peugeot", "Renault", "Volkswagen", "Hyundai", "Ford", "BMW", "Mercedes", "Toyota", "Kia", "Citroën"];

function validateVehicleForm(form: Record<string, unknown>): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!form.marque) errs.marque = "Marque requise";
  if (!form.modele) errs.modele = "Modèle requis";
  if (!form.annee) errs.annee = "Année requise";
  if (!form.kilometrage) errs.kilometrage = "Kilométrage requis";
  if (!form.couleur) errs.couleur = "Couleur requise";
  if (!form.prixDepart) errs.prixDepart = "Prix de départ requis";
  const prixDepart = parseInt(form.prixDepart as string, 10);
  if (isNaN(prixDepart) || prixDepart <= 0) errs.prixDepart = "Prix invalide";
  if (form.avecReserve && form.prixReserve) {
    const prixReserve = parseInt(form.prixReserve as string, 10);
    if (isNaN(prixReserve) || prixReserve <= 0) errs.prixReserve = "Prix de réserve invalide";
  }
  return errs;
}

export default function AddVehiclePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<Record<string, unknown>>({
    marque: "", modele: "", version: "", annee: "", kilometrage: "",
    carburant: "essence", transmission: "manuelle", couleur: "", nbPortes: "5", puissance: "", origine: "Tunisie",
    description: "", prixDepart: "", avecReserve: true, prixReserve: "",
    duree: "48",
  });
  const [inspectionDoc, setInspectionDoc] = useState<File | null>(null);
  const [carteGrise, setCarteGrise] = useState<File | null>(null);

  const descLength = (form.description as string)?.length ?? 0;

  const setField = (key: string, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    const validation = validateVehicleForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      toast.error("Veuillez corriger les erreurs du formulaire");
      return;
    }
    setErrors({});
    setSubmitting(true);

    const payload = {
      marque: form.marque as string,
      modele: form.modele as string,
      version: (form.version as string) || undefined,
      annee: parseInt(form.annee as string, 10),
      kilometrage: parseInt(form.kilometrage as string, 10),
      carburant: form.carburant as "essence" | "diesel" | "hybride" | "electrique" | "gpl",
      transmission: form.transmission as "manuelle" | "automatique",
      couleur: (form.couleur as string) || undefined,
      nbPortes: parseInt((form.nbPortes as string) || "5", 10),
      puissance: form.puissance ? parseInt(form.puissance as string, 10) : undefined,
      origine: (form.origine as string) || undefined,
      description: (form.description as string) || undefined,
      prixDepart: parseInt(form.prixDepart as string, 10),
      prixReserve: form.avecReserve && form.prixReserve ? parseInt(form.prixReserve as string, 10) : undefined,
      duree: parseInt(form.duree as string, 10),
    };

    const result = await createVehicle(payload);

    if (result.error || !result.data) {
      setSubmitting(false);
      toast.error(result.error || "Erreur lors de la création du véhicule");
      return;
    }

    const vehicleId = result.data.vehicleId;

    // Upload documents to Supabase storage
    const uploadFile = async (file: File | null, bucket: string, pathPrefix: string) => {
      if (!file) return null;
      const path = `${pathPrefix}/${vehicleId}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file);
      if (error) return null;
      return path;
    };

    const inspectionPath = await uploadFile(inspectionDoc, "vehicle-documents", "inspections");
    const carteGrisePath = await uploadFile(carteGrise, "vehicle-documents", "carte-grise");

    // Insert document records
    if (inspectionPath) {
      await supabase.from("vehicle_documents").insert({
        vehicle_id: vehicleId,
        document_type: "rapport_inspection",
        storage_path: inspectionPath,
        file_name: inspectionDoc!.name,
      });
    }
    if (carteGrisePath) {
      await supabase.from("vehicle_documents").insert({
        vehicle_id: vehicleId,
        document_type: "carte_grise",
        storage_path: carteGrisePath,
        file_name: carteGrise!.name,
      });
    }

    setSubmitting(false);
    toast.success("Véhicule et documents soumis pour inspection !");
    router.push("/dashboard/vendeur");
  };

  const endDate = new Date();
  endDate.setHours(endDate.getHours() + parseInt((form.duree as string) || "48", 10));

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">Ajouter un véhicule</h1>

      <div className="mt-8 max-w-2xl">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      <div className="mt-8 max-w-2xl space-y-6">
        {currentStep === 0 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink">Marque</label>
                <select value={form.marque as string} onChange={(e) => setField("marque", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.marque ? "border-red-300" : "border-line"}`}>
                  <option value="">Sélectionnez...</option>
                  {marques.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                {errors.marque && <p className="mt-1 text-xs text-red-600">{errors.marque}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">Modèle</label>
                <input value={form.modele as string} onChange={(e) => setField("modele", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.modele ? "border-red-300" : "border-line"}`} />
                {errors.modele && <p className="mt-1 text-xs text-red-600">{errors.modele}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink">Version / Finition</label>
                <input value={form.version as string} onChange={(e) => setField("version", e.target.value)} className="mt-1.5 block w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">Année</label>
                <select value={form.annee as string} onChange={(e) => setField("annee", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.annee ? "border-red-300" : "border-line"}`}>
                  <option value="">Sélectionnez...</option>
                  {Array.from({ length: 36 }).map((_, i) => {
                    const year = 2025 - i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
                {errors.annee && <p className="mt-1 text-xs text-red-600">{errors.annee}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink">Kilométrage (km)</label>
                <input type="number" value={form.kilometrage as string} onChange={(e) => setField("kilometrage", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.kilometrage ? "border-red-300" : "border-line"}`} />
                {errors.kilometrage && <p className="mt-1 text-xs text-red-600">{errors.kilometrage}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">Couleur</label>
                <input value={form.couleur as string} onChange={(e) => setField("couleur", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.couleur ? "border-red-300" : "border-line"}`} />
                {errors.couleur && <p className="mt-1 text-xs text-red-600">{errors.couleur}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink">Carburant</label>
              <div className="mt-2 flex flex-wrap gap-3">
                {["essence", "diesel", "hybride", "electrique", "gpl"].map((f) => (
                  <label key={f} className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm capitalize transition-colors ${form.carburant === f ? "border-accent bg-accent-tint text-accent" : "border-line bg-paper text-ink-secondary"}`}>
                    <input type="radio" name="carburant" checked={form.carburant === f} onChange={() => setField("carburant", f)} className="sr-only" />
                    {f === "electrique" ? "Électrique" : f}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink">Boîte de vitesses</label>
              <div className="mt-2 flex gap-3">
                {["manuelle", "automatique"].map((t) => (
                  <label key={t} className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm capitalize transition-colors ${form.transmission === t ? "border-accent bg-accent-tint text-accent" : "border-line bg-paper text-ink-secondary"}`}>
                    <input type="radio" name="transmission" checked={form.transmission === t} onChange={() => setField("transmission", t)} className="sr-only" />
                    {t}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink">Nb portes</label>
                <select value={form.nbPortes as string} onChange={(e) => setField("nbPortes", e.target.value)} className="mt-1.5 block w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent">
                  {[2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">Puissance (CV)</label>
                <input type="number" value={form.puissance as string} onChange={(e) => setField("puissance", e.target.value)} className="mt-1.5 block w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">Origine</label>
                <select value={form.origine as string} onChange={(e) => setField("origine", e.target.value)} className="mt-1.5 block w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent">
                  <option>Tunisie</option>
                  <option>Europe</option>
                  <option>Autre</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink">Description</label>
              <textarea value={form.description as string} onChange={(e) => setField("description", e.target.value)} maxLength={500} rows={4} className="mt-1.5 block w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
              <p className="mt-1 text-xs text-ink-muted">{descLength}/500 caractères</p>
            </div>
          </>
        )}

        {currentStep === 1 && (
          <div>
            <div className="rounded-lg border-2 border-dashed border-line bg-surface p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-ink-muted"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <p className="mt-3 text-sm font-medium text-ink">Glissez vos photos ici ou cliquez pour parcourir</p>
              <p className="mt-1 text-xs text-ink-muted">Min 3 photos · Max 20 · JPG, PNG</p>
            </div>
            <p className="mt-4 text-xs text-ink-muted">Photo principale : la première uploadée</p>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5">
            <FileUploadZone
              label="Carte grise"
              required
              accept=".pdf,image/*"
              onFileChange={setCarteGrise}
              file={carteGrise}
            />
            <FileUploadZone
              label="Rapport d'inspection / Contrôle technique"
              required
              accept=".pdf,image/*"
              onFileChange={setInspectionDoc}
              file={inspectionDoc}
            />
            <FileUploadZone
              label="Autre document (optionnel)"
              accept=".pdf,image/*"
              onFileChange={() => {}}
              file={null}
            />
          </div>
        )}

        {currentStep === 3 && (
          <>
            <div>
              <label className="block text-sm font-medium text-ink">Prix de départ (DT)</label>
              <input type="number" value={form.prixDepart as string} onChange={(e) => setField("prixDepart", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.prixDepart ? "border-red-300" : "border-line"}`} />
              {errors.prixDepart && <p className="mt-1 text-xs text-red-600">{errors.prixDepart}</p>}
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={form.avecReserve as boolean} onChange={(e) => setForm((prev) => ({ ...prev, avecReserve: e.target.checked }))} className="h-4 w-4 rounded border-line text-accent focus:ring-accent" />
              <span className="text-sm text-ink">Avec réserve</span>
            </div>
            {form.avecReserve && (
              <div>
                <label className="block text-sm font-medium text-ink">Prix de réserve (DT)</label>
                <input type="number" value={form.prixReserve as string} onChange={(e) => setField("prixReserve", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.prixReserve ? "border-red-300" : "border-line"}`} />
                {errors.prixReserve && <p className="mt-1 text-xs text-red-600">{errors.prixReserve}</p>}
              </div>
            )}
            {!form.avecReserve && (
              <span className="inline-flex rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-bold text-yellow-700">Sans réserve</span>
            )}
            <div>
              <label className="block text-sm font-medium text-ink">Durée</label>
              <div className="mt-2 flex flex-wrap gap-3">
                {["24", "48", "72", "168"].map((d) => (
                  <label key={d} className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${form.duree === d ? "border-accent bg-accent-tint text-accent" : "border-line bg-paper text-ink-secondary"}`}>
                    <input type="radio" name="duree" checked={form.duree === d} onChange={() => setField("duree", d)} className="sr-only" />
                    {d === "168" ? "7 jours" : `${d}h`}
                  </label>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-surface p-4">
              <p className="text-xs text-ink-muted">L&apos;enchère se terminera le</p>
              <p className="text-sm font-semibold text-ink">{endDate.toLocaleString("fr-FR")}</p>
            </div>
            <p className="text-xs text-ink-muted">Commission vendeur : 1.5% du prix d&apos;adjudication</p>
          </>
        )}

        <div className="flex items-center justify-between pt-4">
          {currentStep > 0 && (
            <button onClick={() => setCurrentStep((s) => s - 1)} className="rounded-md border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface">
              Retour
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button onClick={() => setCurrentStep((s) => s + 1)} className="ml-auto rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark">
              Continuer →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="ml-auto rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60">
              {submitting ? "Traitement..." : "Soumettre pour inspection"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
