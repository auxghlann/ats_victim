export default function InterviewsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Calendar Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-44 bg-outline-variant/30 rounded-lg" />
          <div className="h-8 w-24 bg-outline-variant/20 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-32 bg-outline-variant/20 rounded-full" />
          <div className="h-10 w-40 bg-outline-variant/30 rounded-full" />
        </div>
      </div>

      {/* Main Grid: Calendar Grid & Date Schedule Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid Skeleton (2 cols) */}
        <div className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-outline-variant/40 shadow-xs space-y-4">
          <div className="grid grid-cols-7 gap-2 pb-2 border-b border-outline-variant/20 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="h-4 w-8 mx-auto bg-outline-variant/20 rounded" />
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 min-h-[380px]">
            {Array.from({ length: 35 }).map((_, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl bg-surface-container/30 border border-outline-variant/15 flex flex-col justify-between min-h-[64px]"
              >
                <div className="h-3.5 w-4 bg-outline-variant/25 rounded" />
                {idx % 5 === 2 && (
                  <div className="h-3 w-full bg-outline-variant/20 rounded mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Schedule Sidebar (1 col) */}
        <div className="bg-surface p-6 rounded-2xl border border-outline-variant/40 shadow-xs space-y-4">
          <div className="space-y-1 pb-3 border-b border-outline-variant/20">
            <div className="h-5 w-32 bg-outline-variant/30 rounded" />
            <div className="h-3.5 w-44 bg-outline-variant/20 rounded" />
          </div>

          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-surface-container/40 border border-outline-variant/20 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-28 bg-outline-variant/30 rounded" />
                  <div className="h-4 w-16 bg-outline-variant/20 rounded-full" />
                </div>
                <div className="h-3.5 w-36 bg-outline-variant/20 rounded" />
                <div className="h-3 w-20 bg-outline-variant/20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
