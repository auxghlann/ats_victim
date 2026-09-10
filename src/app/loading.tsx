export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-outline-variant/30 rounded-lg" />
          <div className="h-4 w-96 bg-outline-variant/20 rounded-md" />
        </div>
        <div className="h-10 w-36 bg-outline-variant/30 rounded-full" />
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-surface border border-outline-variant/40 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-outline-variant/25 rounded-md" />
              <div className="w-9 h-9 rounded-xl bg-outline-variant/20" />
            </div>
            <div className="h-8 w-16 bg-outline-variant/30 rounded-lg" />
            <div className="h-3 w-28 bg-outline-variant/20 rounded-md" />
          </div>
        ))}
      </div>

      {/* Main Grid: Chart & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-outline-variant/40 shadow-xs space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-5 w-36 bg-outline-variant/30 rounded-md" />
              <div className="h-3.5 w-60 bg-outline-variant/20 rounded-md" />
            </div>
            <div className="h-8 w-32 bg-outline-variant/25 rounded-full" />
          </div>
          <div className="h-52 flex items-end justify-between gap-3 pt-6">
            {[40, 70, 25, 90, 55, 30, 80].map((h, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full max-w-[40px] bg-outline-variant/25 rounded-t-lg"
                  style={{ height: `${h}%` }}
                />
                <div className="h-3 w-8 bg-outline-variant/20 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-outline-variant/40 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
            <div className="h-5 w-40 bg-outline-variant/30 rounded-md" />
            <div className="h-4 w-12 bg-outline-variant/20 rounded" />
          </div>
          <div className="space-y-3 pt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl">
                <div className="w-9 h-9 rounded-xl bg-outline-variant/25 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-28 bg-outline-variant/30 rounded" />
                  <div className="h-3 w-36 bg-outline-variant/20 rounded" />
                </div>
                <div className="h-5 w-16 bg-outline-variant/25 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
