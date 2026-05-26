export default function FormSkeleton() {
  return (
    <div className="max-w-xl space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-surface" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-surface" />
          <div className="h-10 w-full animate-pulse rounded bg-surface" />
        </div>
      ))}
      <div className="h-10 w-32 animate-pulse rounded bg-surface" />
    </div>
  );
}
