"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StepIndicator } from "@/components/ui/step-indicator";
import { FileUploadZone } from "@/components/ui/file-upload-zone";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

const steps = ["Rôle", "Profil", "Compte", "KYC", "Confirmation"];

const villes = ["Tunis", "Sfax", "Sousse", "Bizerte", "Nabeul", "Monastir", "Gabès", "Autre"];
const secteurs = ["Location de véhicules", "Concessionnaire", "Leasing", "Autre"];

const DOC_TYPE_MAP: Record<string, string> = {
  cinRecto: "cin_recto",
  cinVerso: "cin_verso",
  selfie: "selfie",
  rib: "rib",
  patente: "patente",
  statuts: "statuts",
};

export default function InscriptionNouveauPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [role, setRole] = useState<"buyer" | "seller" | null>(null);
  const [accountType, setAccountType] = useState<"particulier" | "professionnel" | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [acceptedCGU, setAcceptedCGU] = useState(false);
  const [docs, setDocs] = useState<Record<string, File | null>>({});
  const [depositPaid, setDepositPaid] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  };

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (!form.email?.trim()) errs.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Format invalide";
    if (!form.password) errs.password = "Mot de passe requis";
    else if (form.password.length < 8) errs.password = "8 caractères minimum";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Ne correspond pas";

    if (accountType === "particulier") {
      if (!form.prenom?.trim()) errs.prenom = "Prénom requis";
      if (!form.nom?.trim()) errs.nom = "Nom requis";
    } else {
      if (!form.raisonSociale?.trim()) errs.raisonSociale = "Raison sociale requise";
      if (!form.matriculeFiscal?.trim()) errs.matriculeFiscal = "Matricule fiscal requis";
      if (!form.representant?.trim()) errs.representant = "Représentant requis";
    }
    if (!form.telephone?.trim()) errs.telephone = "Téléphone requis";
    if (!acceptedCGU) errs.cgu = "Vous devez accepter les CGU";
    return errs;
  };

  const handleNext = () => {
    if (currentStep === 2) {
      const errs = validateStep3();
      if (Object.keys(errs).length > 0) { setErrors(errs); return; }
      setErrors({});
    }
    if (currentStep === 3) {
      const requiredDocs = getRequiredDocs();
      const missing = requiredDocs.filter((d) => !d.optional && !docs[d.key]);
      if (missing.length > 0) { toast.error(`${missing.length} document(s) requis manquant(s)`); return; }
    }
    if (currentStep === 4 && role === "buyer" && !depositPaid) {
      toast.error("Veuillez verser l'empreinte bancaire de 600 DT");
      return;
    }
    setCurrentStep((s) => s + 1);
  };

  const getRequiredDocs = () => {
    const base: { key: string; label: string; optional?: boolean }[] = [
      { key: "cinRecto", label: "Pièce d'identité (CIN recto)" },
      { key: "cinVerso", label: "Pièce d'identité (CIN verso)" },
    ];
    if (role === "seller") {
      base.push({ key: "rib", label: "RIB / Coordonnées bancaires" });
      if (accountType === "professionnel") {
        base.push({ key: "patente", label: "Patente ou registre de commerce" });
        base.push({ key: "statuts", label: "Statuts de la société", optional: true });
      }
    } else {
      base.push({ key: "selfie", label: "Selfie avec CIN", optional: true });
    }
    return base;
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (authError || !authData.user) {
        toast.error(authError?.message ?? "Erreur lors de l'inscription");
        setSubmitting(false);
        return;
      }

      const profilePayload: Record<string, unknown> = {
        id: authData.user.id,
        role,
        seller_type: accountType === "professionnel" ? "entreprise" : "particulier",
        first_name: form.prenom ?? null,
        last_name: form.nom ?? null,
        phone: form.telephone ?? null,
        city: form.ville ?? null,
        company_name: accountType === "professionnel" ? (form.raisonSociale ?? null) : null,
        matricule_fiscal: accountType === "professionnel" ? (form.matriculeFiscal ?? null) : null,
        secteur: accountType === "professionnel" ? (form.secteur ?? null) : null,
        representant_legal: accountType === "professionnel" ? (form.representant ?? null) : null,
        adresse_siege: accountType === "professionnel" ? (form.adresse ?? null) : null,
        kyc_status: "pending",
        kyc_submitted_at: new Date().toISOString(),
        deposit_paid: depositPaid,
        deposit_amount: depositPaid ? 600000 : null,
        deposit_paid_at: depositPaid ? new Date().toISOString() : null,
      };

      const { error: profileError } = await supabase.from("profiles").insert(profilePayload);
      if (profileError) {
        toast.error("Erreur lors de la création du profil");
        setSubmitting(false);
        return;
      }

      const docList = getRequiredDocs();
      const docRecords = docList
        .filter((d) => docs[d.key])
        .map((d) => ({
          user_id: authData.user!.id,
          document_type: DOC_TYPE_MAP[d.key] || d.key,
          storage_path: `kyc/${authData.user!.id}/${d.key}`,
          file_name: docs[d.key]!.name,
          file_size: docs[d.key]!.size,
        }));

      if (docRecords.length > 0) {
        await supabase.from("kyc_documents").insert(docRecords);
      }

      toast.success("Compte créé avec succès !");
      setCurrentStep(5);
    } catch {
      toast.error("Une erreur est survenue");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 py-12">
      <div className="mx-auto w-full max-w-xl">
        <Link href="/" className="inline-flex items-center gap-0 text-xl font-bold tracking-tight">
          <span className="text-ink">Mazad</span>
          <span className="text-accent">Auto</span>
        </Link>

        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-ink font-heading">Créer un compte</h1>
        <p className="mt-2 text-sm text-ink-secondary">Suivez les étapes pour rejoindre MazadAuto.</p>

        <div className="mt-8">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        <div className="mt-8">
          {currentStep === 0 && (
            <div className="space-y-4">
              <button onClick={() => setRole("buyer")} className={`w-full rounded-xl border-2 p-6 text-left transition-colors ${role === "buyer" ? "border-accent bg-accent-tint" : "border-line bg-paper hover:border-ink-muted/30"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-ink font-heading">Je veux acheter</h3>
                    <p className="mt-1 text-sm text-ink-secondary">Participez aux enchères et achetez des véhicules au meilleur prix.</p>
                  </div>
                  {role === "buyer" && <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>}
                </div>
              </button>
              <button onClick={() => setRole("seller")} className={`w-full rounded-xl border-2 p-6 text-left transition-colors ${role === "seller" ? "border-accent bg-accent-tint" : "border-line bg-paper hover:border-ink-muted/30"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-ink font-heading">Je veux vendre</h3>
                    <p className="mt-1 text-sm text-ink-secondary">Mettez vos véhicules aux enchères et touchez des acheteurs qualifiés.</p>
                  </div>
                  {role === "seller" && <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>}
                </div>
              </button>
              <button onClick={handleNext} disabled={!role} className="flex w-full items-center justify-center rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60">Continuer &rarr;</button>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <button onClick={() => setAccountType("particulier")} className={`w-full rounded-xl border-2 p-6 text-left transition-colors ${accountType === "particulier" ? "border-accent bg-accent-tint" : "border-line bg-paper hover:border-ink-muted/30"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                    <div>
                      <h3 className="font-bold text-ink font-heading">Particulier</h3>
                      <p className="mt-0.5 text-sm text-ink-secondary">Je suis un particulier</p>
                    </div>
                  </div>
                  {accountType === "particulier" && <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>}
                </div>
              </button>
              <button onClick={() => setAccountType("professionnel")} className={`w-full rounded-xl border-2 p-6 text-left transition-colors ${accountType === "professionnel" ? "border-accent bg-accent-tint" : "border-line bg-paper hover:border-ink-muted/30"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></div>
                    <div>
                      <h3 className="font-bold text-ink font-heading">Professionnel / Entreprise</h3>
                      <p className="mt-0.5 text-sm text-ink-secondary">Je représente une entreprise</p>
                    </div>
                  </div>
                  {accountType === "professionnel" && <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>}
                </div>
              </button>
              <div className="flex gap-3">
                <button onClick={() => setCurrentStep((s) => s - 1)} className="rounded-md border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface">Retour</button>
                <button onClick={handleNext} disabled={!accountType} className="ml-auto rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60">Continuer &rarr;</button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              {accountType === "particulier" ? (
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
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-ink">Raison sociale</label>
                    <input value={form.raisonSociale || ""} onChange={(e) => setField("raisonSociale", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.raisonSociale ? "border-red-300" : "border-line"}`} />
                    {errors.raisonSociale && <p className="mt-1 text-xs text-red-600">{errors.raisonSociale}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink">Matricule fiscal</label>
                      <input value={form.matriculeFiscal || ""} onChange={(e) => setField("matriculeFiscal", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.matriculeFiscal ? "border-red-300" : "border-line"}`} />
                      {errors.matriculeFiscal && <p className="mt-1 text-xs text-red-600">{errors.matriculeFiscal}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink">Secteur</label>
                      <select value={form.secteur || ""} onChange={(e) => setField("secteur", e.target.value)} className="mt-1.5 block w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent">
                        <option value="">Sélectionnez...</option>
                        {secteurs.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink">Représentant légal</label>
                    <input value={form.representant || ""} onChange={(e) => setField("representant", e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.representant ? "border-red-300" : "border-line"}`} />
                    {errors.representant && <p className="mt-1 text-xs text-red-600">{errors.representant}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink">Adresse du siège</label>
                    <input value={form.adresse || ""} onChange={(e) => setField("adresse", e.target.value)} className="mt-1.5 block w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                  </div>
                </>
              )}

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

              <label className="flex cursor-pointer items-start gap-2">
                <input type="checkbox" checked={acceptedCGU} onChange={(e) => setAcceptedCGU(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-line text-accent focus:ring-accent" />
                <span className="text-sm text-ink-secondary">
                  J&apos;accepte les <Link href="/cgu" className="text-accent hover:text-accent-dark">CGU</Link> et la <Link href="/confidentialite" className="text-accent hover:text-accent-dark">politique de confidentialité</Link>
                </span>
              </label>
              {errors.cgu && <p className="text-xs text-red-600">{errors.cgu}</p>}

              <div className="flex gap-3">
                <button onClick={() => setCurrentStep((s) => s - 1)} className="rounded-md border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface">Retour</button>
                <button onClick={handleNext} className="ml-auto rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark">Continuer &rarr;</button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-ink font-heading">Vérification d&apos;identité</h2>
                <p className="mt-1 text-sm text-ink-secondary">Requis pour {role === "seller" ? "mettre en vente" : "enchérir"}. Vos données sont sécurisées.</p>
              </div>
              {getRequiredDocs().map((doc) => (
                <FileUploadZone key={doc.key} label={doc.label} required={!doc.optional} onFileChange={(f) => setDocs((prev) => ({ ...prev, [doc.key]: f }))} file={docs[doc.key] || null} />
              ))}
              <div className="flex gap-3">
                <button onClick={() => setCurrentStep((s) => s - 1)} className="rounded-md border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface">Retour</button>
                <button onClick={handleNext} className="ml-auto rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark">Continuer &rarr;</button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              {role === "buyer" ? (
                <>
                  <div className="rounded-xl border border-line bg-paper p-6">
                    <h2 className="text-lg font-bold text-ink font-heading">Empreinte bancaire</h2>
                    <p className="mt-2 text-sm text-ink-secondary">
                      Pour garantir la sérieux des enchères, nous demandons une empreinte bancaire de <strong>600 DT</strong>.
                      Cette somme est bloquée sur votre compte et restituée intégralement après la fin de l&apos;enchère (gagnée ou non).
                    </p>
                    <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-paper p-4 transition-colors hover:bg-surface">
                      <input type="checkbox" checked={depositPaid} onChange={(e) => setDepositPaid(e.target.checked)} className="mt-0.5 h-5 w-5 rounded border-line text-accent focus:ring-accent" />
                      <div>
                        <p className="text-sm font-semibold text-ink">J&apos;autorise le blocage de 600 DT</p>
                        <p className="text-xs text-ink-secondary">En cochant, vous confirmez disposer des fonds nécessaires.</p>
                      </div>
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setCurrentStep((s) => s - 1)} className="rounded-md border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface">Retour</button>
                    <button onClick={handleFinalSubmit} disabled={submitting || !depositPaid} className="ml-auto rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60">
                      {submitting ? "Traitement..." : "Finaliser mon inscription"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl border border-line bg-paper p-6 text-center">
                    <h2 className="text-lg font-bold text-ink font-heading">Dernière étape</h2>
                    <p className="mt-2 text-sm text-ink-secondary">Votre dossier sera examiné sous 24-48h.</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setCurrentStep((s) => s - 1)} className="rounded-md border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface">Retour</button>
                    <button onClick={handleFinalSubmit} disabled={submitting} className="ml-auto rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60">
                      {submitting ? "Traitement..." : "Soumettre mon dossier"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-tint">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 className="mt-6 text-xl font-extrabold text-ink font-heading">Inscription terminée !</h2>
              <p className="mt-2 text-sm text-ink-secondary">
                {role === "buyer" ? "Votre compte acheteur est créé. Votre KYC est en cours de vérification (24-48h)." : "Votre dossier vendeur est soumis. Vous recevrez une réponse sous 24-48h."}
              </p>
              <Link href="/encheres" className="mt-8 inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark">
                Explorer les enchères &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
