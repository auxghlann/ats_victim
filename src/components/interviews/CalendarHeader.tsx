interface CalendarHeaderProps {
  viewMode: "month" | "week" | "day";
  onViewModeChange: (mode: "month" | "week" | "day") => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onOpenScheduleModal: () => void;
}

export function CalendarHeader({
  viewMode,
  onViewModeChange,
  onPrevMonth,
  onNextMonth,
  onToday,
  onOpenScheduleModal,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
          Interviews &amp; Calendar
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Track upcoming rounds, technical screens, and interview meetings
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Navigation & Today */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/40">
          <button
            type="button"
            onClick={onPrevMonth}
            className="w-7 h-7 rounded-lg text-on-surface hover:bg-surface flex items-center justify-center cursor-pointer"
            title="Previous Month"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={onToday}
            className="px-2.5 py-1 rounded-lg text-xs font-bold text-on-surface hover:bg-surface cursor-pointer"
          >
            Today
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="w-7 h-7 rounded-lg text-on-surface hover:bg-surface flex items-center justify-center cursor-pointer"
            title="Next Month"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="hidden sm:flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/40">
          {(["month", "week", "day"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onViewModeChange(mode)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                viewMode === mode
                  ? "bg-surface text-primary shadow-xs font-bold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Schedule Interview Trigger */}
        <button
          type="button"
          onClick={onOpenScheduleModal}
          className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Schedule Interview
        </button>
      </div>
    </div>
  );
}
