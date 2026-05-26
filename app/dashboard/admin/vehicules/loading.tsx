export default function TableSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-8 w-full animate-pulse rounded bg-surface" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          {Array.from({ length: 5 }).map((__, j) => (
            <div key={j} className="h-10 flex-1 animate-pulse rounded bg-surface" />
          ))}
        </div>
      ))}
    </div>
  );
}
