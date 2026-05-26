export default function VehicleDetailLoading() {
  return (
    <div className="min-h-full bg-paper">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          <div>
            <div className="aspect-video w-full animate-pulse rounded-xl bg-gray-200" />
            <div className="mt-8 h-8 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="mt-8 grid grid-cols-2 gap-px sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse bg-gray-200" />
              ))}
            </div>
          </div>
          <aside>
            <div className="h-72 animate-pulse rounded-xl bg-gray-200" />
          </aside>
        </div>
      </main>
    </div>
  );
}
