"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StepIndicator } from "@/components/ui/step-indicator";
import { FileUploadZone } from "@/components/ui/file-upload-zone";
import Link from "next/link";

const steps = ["Compte", "Identité", "Confirmation"];

export default function InscriptionAcheteurPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Step 1 fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedCGU, setAcceptedCGU] = useState(false);

  // Step 2 fields
  const [cinRecto, setCinRecto] = useState<File | null>(null);
  const [cinVerso, setCinVerso] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "Prénom requis";
    if (!lastName.trim()) errs.lastName = "Nom requis";
    if (!email.trim()) errs.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Format invalide";
    if (!phone.trim()) errs.phone = "Téléphone requis";
    if (!password) errs.password = "Mot de passe requis";
    else if (password.length < 8) errs.password = "8 caractères minimum";
    if (password !== confirmPassword) errs.confirmPassword = "Les mots de passe ne correspondent pas";
    if (!acceptedCGU) errs.cgu = "Vous devez accepter les CGU";
    return errs;
  };

  const handleContinueStep1 = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setCurrentStep(1);
  };

  const handleFinalise = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setCurrentStep(2);
    }, 1500);
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">
        Inscription acheteur
      </h1>
      <p className="mt-2 text-sm text-ink-secondary">
        Créez votre compte pour participer aux enchères.
      </p>

      <div className="mt-8">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      <div className="mt-8">
        {currentStep === 0 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink">Prénom</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.firstName ? "border-red-300" : "border-line"}`}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">Nom</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.lastName ? "border-red-300" : "border-line"}`}
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.email ? "border-red-300" : "border-line"}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">Téléphone</label>
              <div className="mt-1.5 flex rounded-md border border-line bg-paper focus-within:border-accent focus-within:ring-1 focus-within:ring-accent">
                <span className="flex items-center border-r border-line px-3 text-sm text-ink-muted">
                  +216
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="XX XXX XXX"
                  className="block flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.password ? "border-red-300" : "border-line"}`}
                />
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">Confirmer</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent ${errors.confirmPassword ? "border-red-300" : "border-line"}`}
                />
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={acceptedCGU}
                onChange={(e) => setAcceptedCGU(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-line text-accent focus:ring-accent"
              />
              <span className="text-sm text-ink-secondary">
                J'accepte les{" "}
                <Link href="/cgu" className="text-accent hover:text-accent-dark">CGU</Link>
                {" "}et la{" "}
                <Link href="/confidentialite" className="text-accent hover:text-accent-dark">politique de confidentialité</Link>
              </span>
            </label>
            {errors.cgu && <p className="text-xs text-red-600">{errors.cgu}</p>}

            <button
              onClick={handleContinueStep1}
              className="flex w-full items-center justify-center rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
            >
              Continuer &rarr;
            </button>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-ink font-heading">Vérification d'identité</h2>
              <p className="mt-1 text-sm text-ink-secondary">
                Requis pour enchérir. Vos données sont sécurisées et ne seront pas partagées.
              </p>
            </div>

            <FileUploadZone
              label="Pièce d'identité (CIN recto)"
              required
              onFileChange={setCinRecto}
              file={cinRecto}
            />
            <FileUploadZone
              label="Pièce d'identité (CIN verso)"
              required
              onFileChange={setCinVerso}
              file={cinVerso}
            />
            <FileUploadZone
              label="Selfie avec CIN"
              onFileChange={setSelfie}
              file={selfie}
            />
            {selfie && (
              <p className="flex items-center gap-1.5 text-xs font-semibold text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Compte certifié
              </p>
            )}

            <button
              onClick={handleFinalise}
              disabled={submitting || !cinRecto || !cinVerso}
              className="flex w-full items-center justify-center rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
            >
              {submitting ? "Traitement..." : "Finaliser mon compte \u2192"}
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-tint">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 className="mt-6 text-xl font-extrabold text-ink font-heading">
              Votre compte acheteur est créé !
            </h2>
            <p className="mt-2 text-sm text-ink-secondary">
              Votre KYC est en cours de vérification (24-48h).
            </p>
            <p className="mt-4 text-sm text-ink-secondary">
              Vous pouvez consulter les enchères dès maintenant. Pour enchérir, attendez la validation de votre identité.
            </p>
            <Link
              href="/encheres"
              className="mt-8 inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
            >
              Voir les enchères &rarr;
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
