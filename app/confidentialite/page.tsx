export const metadata = {
  title: "Politique de Confidentialité — MazadAuto",
};

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">Politique de Confidentialité</h1>
      <p className="mt-4 text-sm text-ink-secondary">
        MazadAuto s&apos;engage à protéger vos données personnelles.
      </p>
      <div className="mt-8 space-y-6 text-sm text-ink-secondary">
        <section>
          <h2 className="text-lg font-bold text-ink font-heading">1. Données collectées</h2>
          <p className="mt-2">Nous collectons vos informations d&apos;identité, de contact et bancaires dans le cadre de la vérification KYC et des transactions.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-ink font-heading">2. Utilisation</h2>
          <p className="mt-2">Vos données sont utilisées pour la gestion de votre compte, la sécurité des transactions et les notifications liées aux enchères.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-ink font-heading">3. Conservation</h2>
          <p className="mt-2">Les données sont conservées pendant la durée de votre inscription puis archivées conformément à la législation tunisienne.</p>
        </section>
      </div>
    </div>
  );
}
