import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4">
      <p className="text-8xl font-black text-gray-100 font-heading">404</p>
      <h1 className="-mt-4 text-2xl font-extrabold tracking-tight text-ink font-heading">
        Page introuvable
      </h1>
      <p className="mt-2 text-ink-secondary">
        Cette page n&apos;existe pas ou a été supprimée.
      </p>
      <Link
        href="/encheres"
        className="mt-6 rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
      >
        Voir les enchères
      </Link>
    </div>
  );
}
