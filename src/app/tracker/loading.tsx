export default function TrackerLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Toolbar Skeleton */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="h-10 flex-1 max-w-sm bg-outline-variant/25 rounded-xl border border-outline-variant/30" />
          <div className="h-10 w-32 bg-outline-variant/25 rounded-xl border border-outline-variant/30" />
          <div className="h-10 w-32 bg-outline-variant/25 rounded-xl border border-outline-variant/30" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-28 bg-outline-variant/20 rounded-full" />
          <div className="h-10 w-36 bg-outline-variant/30 rounded-full" />
        </div>
      </div>

      {/* Table Container Skeleton */}
      <div className="bg-surface rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden flex flex-col justify-between min-h-[420px]">
        <div>
          {/* Table Header Placeholder */}
          <div className="grid grid-cols-7 gap-4 px-6 py-3.5 bg-surface-container/60 border-b border-outline-variant/30">
            <div className="h-4 w-20 bg-outline-variant/30 rounded" />
            <div className="h-4 w-16 bg-outline-variant/30 rounded" />
            <div className="h-4 w-20 bg-outline-variant/30 rounded" />
            <div className="h-4 w-16 bg-outline-variant/30 rounded" />
            <div className="h-4 w-20 bg-outline-variant/30 rounded" />
            <div className="h-4 w-14 bg-outline-variant/30 rounded" />
            <div className="h-4 w-12 bg-outline-variant/30 rounded justify-self-end" />
          </div>

          {/* Table Rows Placeholder */}
          <div className="divide-y divide-outline-variant/20">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="grid grid-cols-7 gap-4 items-center px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-outline-variant/25 shrink-0" />
                  <div className="h-4 w-24 bg-outline-variant/30 rounded" />
                </div>
                <div className="h-4 w-28 bg-outline-variant/25 rounded" />
                <div className="h-5 w-16 bg-outline-variant/20 rounded-full" />
                <div className="h-4 w-20 bg-outline-variant/20 rounded" />
                <div className="h-4 w-20 bg-outline-variant/20 rounded" />
                <div className="h-6 w-20 bg-outline-variant/25 rounded-full" />
                <div className="h-5 w-6 bg-outline-variant/20 rounded justify-self-end" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer Pagination Placeholder */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-outline-variant/20 bg-surface-container/30">
          <div className="h-4 w-32 bg-outline-variant/25 rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-outline-variant/25 rounded-lg" />
            <div className="h-8 w-20 bg-outline-variant/25 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
