export default function TasksLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-56 bg-outline-variant/30 rounded-lg" />
          <div className="h-4 w-96 bg-outline-variant/20 rounded-md" />
        </div>
        <div className="h-10 w-32 bg-outline-variant/30 rounded-full" />
      </div>

      {/* Main Grid: Application Tasks & General Tasks Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Linked Tasks Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-48 bg-outline-variant/30 rounded" />
            <div className="h-8 w-44 bg-outline-variant/20 rounded-lg" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-surface border border-outline-variant/30 shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 flex-1">
                  <div className="w-5 h-5 rounded-md bg-outline-variant/25 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-48 bg-outline-variant/30 rounded" />
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-24 bg-outline-variant/20 rounded" />
                      <div className="h-4 w-20 bg-outline-variant/20 rounded" />
                    </div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-outline-variant/25 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* General Tasks Sidebar Column */}
        <div className="bg-surface p-5 rounded-2xl border border-outline-variant/40 shadow-xs space-y-4">
          <div className="space-y-1">
            <div className="h-5 w-32 bg-outline-variant/30 rounded" />
            <div className="h-3.5 w-48 bg-outline-variant/20 rounded" />
          </div>
          <div className="h-10 w-full bg-outline-variant/20 rounded-xl" />
          <div className="space-y-2.5 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-xl bg-surface-container/40 flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-outline-variant/25 shrink-0" />
                <div className="h-3.5 w-40 bg-outline-variant/25 rounded flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
