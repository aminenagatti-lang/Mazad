import Link from "next/link";

export default function AuctionNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">
        Enchère introuvable
      </h1>
      <p className="mt-2 text-ink-secondary">
        Cette enchère est terminée ou n&apos;existe pas.
      </p>
      <Link
        href="/encheres"
        className="mt-6 rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
      >
        Voir les enchères en cours
      </Link>
    </div>
  );
}
