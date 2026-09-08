import Link from "next/link";
import { EnrichedInterview, STATUS_BADGE_CLASSES } from "@/types/database";

export interface CalendarCell {
  dayNum: number;
  dateStr: string;
  isCurrentMonth: boolean;
  events: EnrichedInterview[];
}

interface CalendarGridProps {
  viewMode: "month" | "week" | "day";
  monthName: string;
  totalMonthEvents: number;
  cells: CalendarCell[];
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  interviewsByDate: Record<string, EnrichedInterview[]>;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({
  viewMode,
  monthName,
  totalMonthEvents,
  cells,
  selectedDateStr,
  onSelectDate,
  interviewsByDate,
}: CalendarGridProps) {
  const todayStr = new Date().toISOString().split("T")[0];

  // Compute 7 days for the Week view based on selectedDateStr
  const weekDays = (() => {
    const selected = new Date(`${selectedDateStr}T00:00:00`);
    const dayOfWeek = isNaN(selected.getTime()) ? new Date().getDay() : selected.getDay();
    const startOfWeek = new Date(selected);
    startOfWeek.setDate(selected.getDate() - dayOfWeek);

    const days: { dateStr: string; dayNum: number; dayLabel: string; events: EnrichedInterview[] }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const dStr = `${y}-${m}-${day}`;
      days.push({
        dateStr: dStr,
        dayNum: d.getDate(),
        dayLabel: WEEKDAYS[i],
        events: interviewsByDate[dStr] || [],
      });
    }
    return days;
  })();

  const dayEvents = interviewsByDate[selectedDateStr] || [];
  const formattedDayDate = new Date(`${selectedDateStr}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-surface rounded-2xl border border-outline-variant/40 shadow-xs overflow-hidden">
      {/* Header bar with Subtitle & Active Rounds counter */}
      <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
        <h2 className="text-base font-bold text-on-surface">
          {viewMode === "month" && monthName}
          {viewMode === "week" && `Week of ${weekDays[0].dateStr} - ${weekDays[6].dateStr}`}
          {viewMode === "day" && formattedDayDate}
        </h2>
        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
          {viewMode === "day"
            ? `${dayEvents.length} ${dayEvents.length === 1 ? "round" : "rounds"} on this day`
            : `${totalMonthEvents} ${totalMonthEvents === 1 ? "round" : "rounds"} scheduled`}
        </span>
      </div>

      {/* 1. MONTH VIEW */}
      {viewMode === "month" && (
        <>
          {/* Weekday Labels Header */}
          <div className="grid grid-cols-7 border-b border-outline-variant/30 bg-surface-container-low text-center">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="py-2.5 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 42-Cell Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-outline-variant/20">
            {cells.map((cell, idx) => {
              const isToday = cell.dateStr === todayStr;
              const isSelected = cell.dateStr === selectedDateStr;
              const hasEvents = cell.events.length > 0;

              return (
                <div
                  key={`${cell.dateStr}-${idx}`}
                  onClick={() => onSelectDate(cell.dateStr)}
                  className={`min-h-[100px] p-2 transition-colors cursor-pointer flex flex-col justify-between ${
                    !cell.isCurrentMonth
                      ? "bg-surface-container-lowest text-on-surface-variant/40"
                      : isSelected
                      ? "bg-primary/5 ring-1 ring-primary/40 inset-0"
                      : "bg-surface hover:bg-surface-container-low"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? "bg-primary text-on-primary"
                          : isSelected
                          ? "bg-primary/20 text-primary font-extrabold"
                          : cell.isCurrentMonth
                          ? "text-on-surface"
                          : "text-on-surface-variant/40"
                      }`}
                    >
                      {cell.dayNum}
                    </span>

                    {hasEvents && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5 mr-0.5" />
                    )}
                  </div>

                  {/* Event Pills */}
                  <div className="space-y-1 mt-1.5">
                    {cell.events.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className="px-1.5 py-0.5 rounded text-[10px] font-semibold truncate bg-secondary-container text-on-secondary-container border border-secondary/20"
                        title={`${ev.company_name || "Interview"}: ${ev.round_name}`}
                      >
                        {ev.company_name || ev.round_name}
                      </div>
                    ))}
                    {cell.events.length > 2 && (
                      <p className="text-[9px] font-bold text-primary pl-1">
                        +{cell.events.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* 2. WEEK VIEW */}
      {viewMode === "week" && (
        <div className="grid grid-cols-7 divide-x divide-outline-variant/20 min-h-[380px]">
          {weekDays.map((col) => {
            const isToday = col.dateStr === todayStr;
            const isSelected = col.dateStr === selectedDateStr;

            return (
              <div
                key={col.dateStr}
                onClick={() => onSelectDate(col.dateStr)}
                className={`p-2.5 flex flex-col justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-primary/5 ring-1 ring-primary/40 inset-0"
                    : "bg-surface hover:bg-surface-container-low"
                }`}
              >
                {/* Column Day Header */}
                <div className="text-center pb-3 border-b border-outline-variant/20">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                    {col.dayLabel}
                  </span>
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mt-1 ${
                      isToday
                        ? "bg-primary text-on-primary"
                        : isSelected
                        ? "bg-primary/20 text-primary font-extrabold"
                        : "text-on-surface"
                    }`}
                  >
                    {col.dayNum}
                  </span>
                </div>

                {/* Event Cards for this Day */}
                <div className="flex-1 space-y-2 py-3 overflow-y-auto">
                  {col.events.map((ev) => {
                    const time = new Date(ev.scheduled_at).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    });
                    return (
                      <div
                        key={ev.id}
                        className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/40 space-y-1 shadow-2xs"
                      >
                        <p className="text-[10px] font-bold text-primary">{time}</p>
                        <p className="text-xs font-bold text-on-surface leading-tight truncate">
                          {ev.company_name || "Interview"}
                        </p>
                        <p className="text-[10px] text-on-surface-variant truncate">
                          {ev.round_name}
                        </p>
                      </div>
                    );
                  })}
                  {col.events.length === 0 && (
                    <p className="text-[10px] italic text-on-surface-variant/40 text-center pt-6">
                      No rounds
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. DAY VIEW */}
      {viewMode === "day" && (
        <div className="p-6 min-h-[380px] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Schedule on {formattedDayDate}</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Full agenda and interview slots
                </p>
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                {dayEvents.length} {dayEvents.length === 1 ? "round" : "rounds"}
              </span>
            </div>

            <div className="space-y-3">
              {dayEvents.map((ev) => {
                const time = new Date(ev.scheduled_at).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });

                return (
                  <div
                    key={ev.id}
                    className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                        {ev.company_name?.charAt(0) || "I"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-on-surface">
                            {ev.company_name || "Application"}
                          </h4>
                          {ev.status && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full capitalize border ${
                                STATUS_BADGE_CLASSES[ev.status] || "bg-surface text-on-surface-variant"
                              }`}
                            >
                              {ev.status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-on-surface-variant">{ev.job_title}</p>
                        <p className="text-xs font-semibold text-primary mt-1 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {time} &mdash; {ev.round_name}
                        </p>
                        {ev.notes && (
                          <p className="text-xs italic text-on-surface-variant mt-1.5 leading-relaxed">
                            {ev.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {ev.meeting_link && (
                        <a
                          href={ev.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-xs">videocam</span>
                          Join Call
                        </a>
                      )}
                      {ev.application_id && (
                        <Link
                          href={`/tracker/${ev.application_id}`}
                          className="px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">visibility</span>
                          Details
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}

              {dayEvents.length === 0 && (
                <div className="text-center py-12 px-4 rounded-xl border border-dashed border-outline-variant/40">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">
                    event_available
                  </span>
                  <p className="text-sm font-bold text-on-surface">No interviews on this date</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Click another day or schedule a round for this date.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
