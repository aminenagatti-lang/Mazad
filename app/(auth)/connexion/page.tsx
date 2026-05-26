"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

function GoogleIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function ConnexionPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Format d'email invalide";
    if (!password) errs.password = "Le mot de passe est requis";
    else if (password.length < 8) errs.password = "Le mot de passe doit contenir au moins 8 caractères";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    toast.success("Connecté avec succès !");
    // Redirect based on role could be done here; for now go to dashboard root
    router.push("/dashboard");
    setSubmitting(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">Connexion</h1>
      <p className="mt-2 text-sm text-ink-secondary">Bienvenue sur MazadAuto. Connectez-vous pour continuer.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" data-testid="login-form">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`mt-1.5 block w-full rounded-md border bg-paper px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent ${errors.email ? "border-red-300" : "border-line"}`} placeholder="votre@email.com" />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-ink">Mot de passe</label>
            <a href="#" className="text-xs text-accent hover:text-accent-dark">Mot de passe oublié ?</a>
          </div>
          <div className="relative mt-1.5">
            <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`block w-full rounded-md border bg-paper px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent ${errors.password ? "border-red-300" : "border-line"}`} placeholder="••••••••" />
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink" aria-label={showPassword ? "Masquer" : "Afficher"}>
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-line text-accent focus:ring-accent" />
          <span className="text-sm text-ink-secondary">Se souvenir de moi</span>
        </label>

        <button type="submit" disabled={submitting} data-testid="login-submit" className="flex w-full items-center justify-center rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60">
          {submitting ? "Connexion..." : "Se connecter"}
        </button>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-line" />
          <span className="text-xs font-medium text-ink-muted">ou</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <button type="button" className="flex w-full items-center justify-center gap-2 rounded-md border border-line bg-paper px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface">
          <GoogleIcon />
          Continuer avec Google
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-secondary">
        Pas encore de compte ?{" "}
        <Link href="/inscription/nouveau" className="font-semibold text-accent hover:text-accent-dark">Créer un compte &rarr;</Link>
      </p>
    </div>
  );
}
