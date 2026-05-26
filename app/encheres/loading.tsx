import { VehicleGridSkeleton } from "@/components/ui/skeleton";

export default function EncheresLoading() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-6 h-10 w-64 animate-pulse rounded bg-gray-200" />
        <VehicleGridSkeleton count={12} />
      </main>
    </div>
  );
}
