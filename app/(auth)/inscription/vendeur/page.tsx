"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StepIndicator } from "@/components/ui/step-indicator";
import { FileUploadZone } from "@/components/ui/file-upload-zone";
import Link from "next/link";

const steps = ["Type", "Compte", "KYC", "Confirmation"];

const villes = ["Tunis", "Sfax", "Sousse", "Bizerte", "Nabeul", "Monastir", "Gabès", "Autre"];

const secteurs = ["Location de véhicules", "Concessionnaire", "Leasing", "Autre"];

export default function InscriptionVendeurPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [sellerType, setSellerType] = useState<"particulier" | "professionnel" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Step 2 fields
  const [form, setForm] = useState<Record<string, string>>({});
  const [acceptedCGU, setAcceptedCGU] = useState(false);

  // Step 3 fields
  const [docs, setDocs] = useState<Record<string, File | null>>({});

  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (sellerType === "particulier") {
      if (!form.prenom?.trim()) errs.prenom = "Prénom requis";
      if (!form.nom?.trim()) errs.nom = "Nom requis";
      if (!form.email?.trim()) errs.email = "Email requis";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Format invalide";
      if (!form.telephone?.trim()) errs.telephone = "Téléphone requis";
      if (!form.password) errs.password = "Mot de passe requis";
      else if (form.password.length < 8) errs.password = "8 caractères minimum";
      if (form.password !== form.confirmPassword) errs.confirmPassword = "Ne correspond pas";
    } else {
      if (!form.raisonSociale?.trim()) errs.raisonSociale = "Raison sociale requise";
      if (!form.matriculeFiscal?.trim()) errs.matriculeFiscal = "Matricule fiscal requis";
      if (!form.representant?.trim()) errs.representant = "Nom du représentant requis";
      if (!form.email?.trim()) errs.email = "Email requis";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Format invalide";
      if (!form.telephone?.trim()) errs.telephone = "Téléphone requis";
      if (!form.adresse?.trim()) errs.adresse = "Adresse requise";
      if (!form.password) errs.password = "Mot de passe requis";
      else if (form.password.length < 8) errs.password = "8 caractères minimum";
      if (form.password !== form.confirmPassword) errs.confirmPassword = "Ne correspond pas";
    }
    if (!acceptedCGU) errs.cgu = "Vous devez accepter les CGU";
    return errs;
  };

  const handleContinueFromType = () => {
    if (!sellerType) return;
    setCurrentStep(1);
  };

  const handleContinueFromAccount = () => {
    const errs = validateStep2();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setCurrentStep(2);
  };

  const handleSubmitKYC = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setCurrentStep(3);
    }, 1500);
  };

  const requiredDocsParticulier: { key: string; label: string; optional?: boolean }[] = [
    { key: "cinRecto", label: "Pièce d'identité (CIN recto)" },
    { key: "cinVerso", label: "Pièce d'identité (CIN verso)" },
    { key: "rib", label: "RIB / Coordonnées bancaires" },
  ];

  const requiredDocsPro: { key: string; label: string; optional?: boolean }[] = [
    { key: "cinRecto", label: "CIN du représentant légal (recto)" },
    { key: "cinVerso", label: "CIN du représentant légal (verso)" },
    { key: "patente", label: "Patente ou registre de commerce" },
    { key: "rib", label: "RIB entreprise" },
    { key: "statuts", label: "Statuts de la société", optional: true },
  ];

  const docList = sellerType === "particulier" ? requiredDocsParticulier : requiredDocsPro;
  const uploadedCount = docList.filter((d) => !d.optional && docs[d.key]).length;
  const requiredCount = docList.filter((d) => !d.optional).length;

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">
        Inscription vendeur
      </h1>
      <p className="mt-2 text-sm text-ink-secondary">
        Créez votre compte pour mettre en vente vos véhicules.
      </p>

      <div className="mt-8">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      <div className="mt-8">
        {/* STEP 1 — Type */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setSellerType("particulier")}
              className={`w-full rounded-xl border-2 p-6 text-left transition-colors ${
                sellerType === "particulier"
                  ? "border-accent bg-accent-tint"
                  : "border-line bg-paper hover:border-ink-muted/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-ink font-heading">Particulier</h3>
                    <p className="mt-0.5 text-sm text-ink-secondary">Je vends mon véhicule personnel ou familial</p>
                    <ul className="mt-2 space-y-0.5 text-xs text-ink-muted">
                      <li>· Rapide à configurer</li>
                      <li>· Commission 1.5% sur vente</li>
                    </ul>
                  </div>
                </div>
                {sellerType === "particulier" && (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSellerType("professionnel")}
              className={`w-full rounded-xl border-2 p-6 text-left transition-colors ${
                sellerType === "professionnel"
                  ? "border-accent bg-accent-tint"
                  : "border-line bg-paper hover:border-ink-muted/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-ink font-heading">Professionnel / Entreprise</h3>
                    <p className="mt-0.5 text-sm text-ink-secondary">Je gère une flotte ou une activité de revente</p>
                    <ul className="mt-2 space-y-0.5 text-xs text-ink-muted">
                      <li>· Gestion multi-véhicules</li>
                      <li>· Facturation entreprise</li>
                      <li>· Commission négociable</li>
                    </ul>
                  </div>
                </div>
                {sellerType === "professionnel" && (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={handleContinueFromType}
              disabled={!sellerType}
              className="flex w-full items-center justify-center rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
            >
              Continuer &rarr;
            </button>
          </div>
        )}

        {/* STEP 2 — Compte */}
        {currentStep === 1 && (
          <div className="space-y-5">
            {sellerType === "particulier" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink">Prénom</label>
                    <input value={form.prenom || ""} onChange={(e) => setField("prenom", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.prenom ? "border-red-300" : "border-line"}`} />
                    {errors.prenom && <p className="mt-1 text-xs text-red-600">{errors.prenom}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink">Nom</label>
                    <input value={form.nom || ""} onChange={(e) => setField("nom", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.nom ? "border-red-300" : "border-line"}`} />
                    {errors.nom && <p className="mt-1 text-xs text-red-600">{errors.nom}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink">Email</label>
                  <input type="email" value={form.email || ""} onChange={(e) => setField("email", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.email ? "border-red-300" : "border-line"}`} />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink">Téléphone</label>
                  <div className="mt-1.5 flex rounded-md border border-line bg-paper focus-within:border-accent focus-within:ring-1 focus-within:ring-accent">
                    <span className="flex items-center border-r border-line px-3 text-sm text-ink-muted">+216</span>
                    <input value={form.telephone || ""} onChange={(e) => setField("telephone", e.target.value)} className="block flex-1 bg-transparent px-3 py-2.5 text-sm outline-none" />
                  </div>
                  {errors.telephone && <p className="mt-1 text-xs text-red-600">{errors.telephone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink">Ville</label>
                  <select value={form.ville || ""} onChange={(e) => setField("ville", e.target.value)} className="mt-1.5 block w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent">
                    <option value="">Sélectionnez...</option>
                    {villes.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink">Mot de passe</label>
                    <input type="password" value={form.password || ""} onChange={(e) => setField("password", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.password ? "border-red-300" : "border-line"}`} />
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink">Confirmer</label>
                    <input type="password" value={form.confirmPassword || ""} onChange={(e) => setField("confirmPassword", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.confirmPassword ? "border-red-300" : "border-line"}`} />
                    {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-ink">Raison sociale</label>
                  <input value={form.raisonSociale || ""} onChange={(e) => setField("raisonSociale", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.raisonSociale ? "border-red-300" : "border-line"}`} />
                  {errors.raisonSociale && <p className="mt-1 text-xs text-red-600">{errors.raisonSociale}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink">Matricule fiscal (RNE)</label>
                    <input value={form.matriculeFiscal || ""} onChange={(e) => setField("matriculeFiscal", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.matriculeFiscal ? "border-red-300" : "border-line"}`} />
                    {errors.matriculeFiscal && <p className="mt-1 text-xs text-red-600">{errors.matriculeFiscal}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink">Secteur d'activité</label>
                    <select value={form.secteur || ""} onChange={(e) => setField("secteur", e.target.value)} className="mt-1.5 block w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent">
                      <option value="">Sélectionnez...</option>
                      {secteurs.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink">Nom du représentant légal</label>
                  <input value={form.representant || ""} onChange={(e) => setField("representant", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.representant ? "border-red-300" : "border-line"}`} />
                  {errors.representant && <p className="mt-1 text-xs text-red-600">{errors.representant}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink">Email professionnel</label>
                  <input type="email" value={form.email || ""} onChange={(e) => setField("email", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.email ? "border-red-300" : "border-line"}`} />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink">Téléphone</label>
                  <div className="mt-1.5 flex rounded-md border border-line bg-paper focus-within:border-accent focus-within:ring-1 focus-within:ring-accent">
                    <span className="flex items-center border-r border-line px-3 text-sm text-ink-muted">+216</span>
                    <input value={form.telephone || ""} onChange={(e) => setField("telephone", e.target.value)} className="block flex-1 bg-transparent px-3 py-2.5 text-sm outline-none" />
                  </div>
                  {errors.telephone && <p className="mt-1 text-xs text-red-600">{errors.telephone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink">Adresse du siège</label>
                  <input value={form.adresse || ""} onChange={(e) => setField("adresse", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.adresse ? "border-red-300" : "border-line"}`} />
                  {errors.adresse && <p className="mt-1 text-xs text-red-600">{errors.adresse}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink">Ville</label>
                  <select value={form.ville || ""} onChange={(e) => setField("ville", e.target.value)} className="mt-1.5 block w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent">
                    <option value="">Sélectionnez...</option>
                    {villes.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink">Mot de passe</label>
                    <input type="password" value={form.password || ""} onChange={(e) => setField("password", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.password ? "border-red-300" : "border-line"}`} />
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink">Confirmer</label>
                    <input type="password" value={form.confirmPassword || ""} onChange={(e) => setField("confirmPassword", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.confirmPassword ? "border-red-300" : "border-line"}`} />
                    {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </>
            )}

            <label className="flex cursor-pointer items-start gap-2">
              <input type="checkbox" checked={acceptedCGU} onChange={(e) => setAcceptedCGU(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-line text-accent focus:ring-accent" />
              <span className="text-sm text-ink-secondary">
                J'accepte les <Link href="/cgu" className="text-accent hover:text-accent-dark">CGU</Link> et la <Link href="/confidentialite" className="text-accent hover:text-accent-dark">politique de confidentialité</Link>
              </span>
            </label>
            {errors.cgu && <p className="text-xs text-red-600">{errors.cgu}</p>}

            <button onClick={handleContinueFromAccount} className="flex w-full items-center justify-center rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark">
              Continuer &rarr;
            </button>
          </div>
        )}

        {/* STEP 3 — KYC */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-ink font-heading">Documents requis</h2>
              <p className="mt-1 text-sm text-ink-secondary">Vérification obligatoire avant la mise en vente de véhicules.</p>
            </div>

            {docList.map((doc) => (
              <FileUploadZone
                key={doc.key}
                label={doc.label}
                required={!doc.optional}
                onFileChange={(f) => setDocs((prev) => ({ ...prev, [doc.key]: f }))}
                file={docs[doc.key] || null}
              />
            ))}

            {sellerType === "professionnel" && docs.statuts && (
              <p className="flex items-center gap-1.5 text-xs font-semibold text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Compte Premium
              </p>
            )}

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink-secondary">
                {uploadedCount}/{requiredCount} documents uploadés
              </p>
            </div>

            <button
              onClick={handleSubmitKYC}
              disabled={submitting || uploadedCount < requiredCount}
              className="flex w-full items-center justify-center rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
            >
              {submitting ? "Traitement..." : "Soumettre mon dossier \u2192"}
            </button>
          </div>
        )}

        {/* STEP 4 — Confirmation */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-tint">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 className="mt-6 text-xl font-extrabold text-ink font-heading">Dossier soumis avec succès !</h2>
            </div>

            <div className="mt-6 rounded-xl border border-line bg-surface p-5 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-ink-muted">Type de compte</span>
                <span className="text-sm font-medium text-ink capitalize">{sellerType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink-muted">Email</span>
                <span className="text-sm font-medium text-ink">{form.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-ink-muted">Statut KYC</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-bold text-yellow-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                  En cours de vérification
                </span>
              </div>
            </div>

            <p className="mt-4 text-center text-sm text-ink-secondary">
              Vous recevrez une réponse sous 24-48h par email.
            </p>
            <p className="mt-2 text-center text-sm text-ink-secondary">
              Vous serez notifié dès que votre compte vendeur est activé.
            </p>

            <Link href="/encheres" className="mt-8 flex w-full items-center justify-center rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark">
              Explorer la plateforme &rarr;
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
