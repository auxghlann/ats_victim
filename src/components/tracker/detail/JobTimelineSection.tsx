import { ApplicationDetail, TimelineEvent, STATUS_BADGE_CLASSES } from "@/types/database";

interface JobTimelineSectionProps {
  detail: ApplicationDetail | null;
}

export function JobTimelineSection({ detail }: JobTimelineSectionProps) {
  const timelineEvents: TimelineEvent[] = (() => {
    try {
      return Array.isArray(detail?.timeline)
        ? detail.timeline
        : JSON.parse(detail?.timeline || "[]");
    } catch {
      return [];
    }
  })();

  return (
    <div className="p-6 bg-surface rounded-2xl border border-outline-variant/40 shadow-xs space-y-4">
      <h2 className="text-sm font-bold text-on-surface">Activity Timeline</h2>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/30">
        {timelineEvents.map((event, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-surface bg-primary shadow-xs ring-2 ring-primary/20" />

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize border ${
                    STATUS_BADGE_CLASSES[event.status] || "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {event.status}
                </span>
                <span className="text-[11px] text-on-surface-variant font-medium">
                  {event.date}
                </span>
              </div>
              {event.snippet && (
                <p className="text-xs text-on-surface mt-1.5 leading-relaxed bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20">
                  {event.snippet}
                </p>
              )}
            </div>
          </div>
        ))}

        {timelineEvents.length === 0 && (
          <p className="text-xs italic text-on-surface-variant/60">
            No timeline events recorded.
          </p>
        )}
      </div>
    </div>
  );
}
