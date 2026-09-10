export default function JobDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 1. Hero Job Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-outline-variant/30 shrink-0" />
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-52 bg-outline-variant/30 rounded-lg" />
              <div className="h-5 w-20 bg-outline-variant/20 rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-28 bg-outline-variant/25 rounded" />
              <div className="h-4 w-24 bg-outline-variant/20 rounded" />
              <div className="h-4 w-20 bg-outline-variant/20 rounded" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          <div className="h-9 w-20 bg-outline-variant/25 rounded-xl" />
          <div className="h-9 w-20 bg-outline-variant/20 rounded-xl" />
        </div>
      </div>

      {/* 2. Visual Status Stepper Skeleton */}
      <div className="p-6 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 bg-outline-variant/30 rounded" />
          <div className="h-3.5 w-24 bg-outline-variant/20 rounded" />
        </div>

        <div className="flex items-center justify-between px-4 relative">
          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-outline-variant/20 -z-0" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 z-10">
              <div className="w-10 h-10 rounded-full bg-outline-variant/30" />
              <div className="h-3 w-14 bg-outline-variant/20 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Main Details Bento Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Description & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description Card Skeleton */}
          <div className="p-6 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
              <div className="h-5 w-36 bg-outline-variant/30 rounded" />
              <div className="h-4 w-24 bg-outline-variant/20 rounded" />
            </div>
            <div className="space-y-2.5 pt-1">
              <div className="h-4 w-full bg-outline-variant/20 rounded" />
              <div className="h-4 w-11/12 bg-outline-variant/20 rounded" />
              <div className="h-4 w-4/5 bg-outline-variant/20 rounded" />
              <div className="h-4 w-3/4 bg-outline-variant/20 rounded" />
            </div>
          </div>

          {/* Job Notes Card Skeleton */}
          <div className="p-6 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
              <div className="h-5 w-28 bg-outline-variant/30 rounded" />
              <div className="h-4 w-16 bg-outline-variant/20 rounded" />
            </div>
            <div className="h-20 w-full bg-outline-variant/15 rounded-xl" />
            <div className="space-y-2 pt-2">
              <div className="h-12 w-full bg-outline-variant/20 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Right 1 Column: Timeline Skeleton */}
        <div className="space-y-6">
          <div className="p-6 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
              <div className="h-5 w-32 bg-outline-variant/30 rounded" />
              <div className="h-4 w-12 bg-outline-variant/20 rounded" />
            </div>
            <div className="space-y-4 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-outline-variant/30 shrink-0 mt-0.5" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-28 bg-outline-variant/30 rounded" />
                    <div className="h-3 w-full bg-outline-variant/20 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
