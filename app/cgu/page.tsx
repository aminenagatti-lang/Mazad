export const metadata = {
  title: "Conditions Générales d'Utilisation — MazadAuto",
};

export default function CguPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">Conditions Générales d&apos;Utilisation</h1>
      <p className="mt-4 text-sm text-ink-secondary">
        Les présentes Conditions Générales d&apos;Utilisation régissent l&apos;accès et l&apos;utilisation de la plateforme MazadAuto.
      </p>
      <div className="mt-8 space-y-6 text-sm text-ink-secondary">
        <section>
          <h2 className="text-lg font-bold text-ink font-heading">1. Objet</h2>
          <p className="mt-2">MazadAuto est une plateforme de vente aux enchères de véhicules en Tunisie.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-ink font-heading">2. Inscription</h2>
          <p className="mt-2">L&apos;inscription est obligatoire pour enchérir ou mettre en vente. Un processus de vérification KYC est requis.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-ink font-heading">3. Enchères</h2>
          <p className="mt-2">Les enchères sont contractuelles. L&apos;enchérisseur le plus élevé au terme du temps imparti remporte le véhicule.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-ink font-heading">4. Commission</h2>
          <p className="mt-2">Une commission de 1.5% est prélevée sur le prix d&apos;adjudication pour les vendeurs.</p>
        </section>
      </div>
    </div>
  );
}
