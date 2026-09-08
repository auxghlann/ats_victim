interface DashboardStatsProps {
  counts: {
    all: number;
    interview: number;
    pending_tasks: number;
    accepted: number;
    [key: string]: number;
  };
}

export function DashboardStats({ counts }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat Card 1: Total Applied */}
      <div className="bg-surface p-5 rounded-2xl border border-outline-variant/40 shadow-xs flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              send
            </span>
          </div>
          <span className="text-status-applied bg-status-applied/10 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border border-status-applied/20">
            <span className="material-symbols-outlined text-[13px]">trending_up</span> +12%
          </span>
        </div>
        <div>
          <p className="text-3xl font-bold text-on-surface leading-none mb-1">
            {counts.all || 0}
          </p>
          <p className="text-xs font-medium text-on-surface-variant">Total Applied</p>
        </div>
      </div>

      {/* Stat Card 2: Active Interviews */}
      <div className="bg-surface p-5 rounded-2xl border border-outline-variant/40 shadow-xs flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#FFF3E0] text-[#b06000] flex items-center justify-center">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              forum
            </span>
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold text-[#b06000] leading-none mb-1">
            {counts.interview || 0}
          </p>
          <p className="text-xs font-medium text-on-surface-variant">Active Interviews</p>
        </div>
      </div>

      {/* Stat Card 3: Pending Tasks */}
      <div className="bg-surface p-5 rounded-2xl border border-outline-variant/40 shadow-xs flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-secondary-container text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              rule
            </span>
          </div>
          {counts.pending_tasks > 0 && (
            <span className="text-error bg-error/10 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border border-error/20">
              Action Required
            </span>
          )}
        </div>
        <div>
          <p className="text-3xl font-bold text-on-surface leading-none mb-1">
            {counts.pending_tasks || 0}
          </p>
          <p className="text-xs font-medium text-on-surface-variant">Pending Tasks</p>
        </div>
      </div>

      {/* Stat Card 4: Offers Received */}
      <div className="bg-surface p-5 rounded-2xl border border-outline-variant/40 shadow-xs flex flex-col justify-between hover:-translate-y-0.5 transition-transform duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#E6F4EA] text-[#137333] flex items-center justify-center">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              stars
            </span>
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold text-[#137333] leading-none mb-1">
            {counts.accepted || 0}
          </p>
          <p className="text-xs font-medium text-on-surface-variant">Offers Received</p>
        </div>
      </div>
    </div>
  );
}
