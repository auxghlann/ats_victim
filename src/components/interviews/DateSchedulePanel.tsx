import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { EnrichedInterview, STATUS_BADGE_CLASSES } from "@/types/database";

interface DateSchedulePanelProps {
  selectedDateStr: string;
  events: EnrichedInterview[];
  onEditInterview: (interview: EnrichedInterview) => void;
  onDeleteInterview: (interviewId: string) => void;
  onOpenScheduleModal: () => void;
}

function InterviewScheduleCard({
  ev,
  onEdit,
  onDelete,
}: {
  ev: EnrichedInterview;
  onEdit: (interview: EnrichedInterview) => void;
  onDelete: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const timeStr = new Date(ev.scheduled_at).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:border-primary/40 transition-all space-y-3 relative">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-surface-container border border-outline-variant/40 flex items-center justify-center font-bold text-xs text-primary shrink-0">
            {ev.company_name?.charAt(0) || "I"}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-on-surface truncate">
              {ev.company_name || "Application"}
            </h4>
            <p className="text-[11px] text-on-surface-variant truncate">
              {ev.job_title || "Candidate Position"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {ev.status && (
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full capitalize border ${
                STATUS_BADGE_CLASSES[ev.status] || "bg-surface text-on-surface-variant"
              }`}
            >
              {ev.status}
            </span>
          )}

          {/* More Vert Menu Button & Popover */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-6 h-6 rounded text-on-surface-variant hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer"
              title="Interview actions"
            >
              <span className="material-symbols-outlined text-xs">more_vert</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-7 z-30 w-28 bg-surface rounded-xl border border-outline-variant/40 shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(ev);
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs text-primary">edit</span>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(ev.id);
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-xs font-semibold text-error hover:bg-error/10 flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">delete</span>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Round name & time */}
      <div className="flex items-center justify-between text-xs font-semibold text-on-surface pt-1 border-t border-outline-variant/20">
        <span className="flex items-center gap-1.5 text-primary">
          <span className="material-symbols-outlined text-sm">schedule</span>
          {timeStr}
        </span>
        <span className="text-on-surface font-bold">{ev.round_name}</span>
      </div>

      {/* Notes if present */}
      {ev.notes && (
        <p className="text-[11px] text-on-surface-variant bg-surface p-2 rounded-lg border border-outline-variant/30 leading-relaxed italic">
          {ev.notes}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        {ev.meeting_link && (
          <a
            href={ev.meeting_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-1.5 px-3 rounded-lg bg-primary text-on-primary text-[11px] font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-xs">videocam</span>
            Join Call
          </a>
        )}

        {ev.application_id && (
          <Link
            href={`/tracker/${ev.application_id}`}
            className="py-1.5 px-3 rounded-lg border border-outline-variant text-[11px] font-semibold text-on-surface hover:bg-surface transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-xs">visibility</span>
            Details
          </Link>
        )}
      </div>
    </div>
  );
}

export function DateSchedulePanel({
  selectedDateStr,
  events,
  onEditInterview,
  onDeleteInterview,
  onOpenScheduleModal,
}: DateSchedulePanelProps) {
  const formattedSelectedDate = new Date(`${selectedDateStr}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-surface p-6 rounded-2xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-on-surface">Daily Schedule</h2>
            <p className="text-xs text-primary font-semibold mt-0.5">{formattedSelectedDate}</p>
          </div>
          <span className="text-xs font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
            {events.length} {events.length === 1 ? "round" : "rounds"}
          </span>
        </div>

        {/* List of interviews for selected day */}
        <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
          {events.map((ev) => (
            <InterviewScheduleCard
              key={ev.id}
              ev={ev}
              onEdit={onEditInterview}
              onDelete={onDeleteInterview}
            />
          ))}

          {events.length === 0 && (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-outline-variant/40">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant/40 mb-2">
                event_available
              </span>
              <p className="text-xs font-bold text-on-surface">No interviews on this date</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Select another day or click below to schedule an interview.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-outline-variant/20">
        <button
          type="button"
          onClick={onOpenScheduleModal}
          className="w-full py-2.5 text-center text-xs font-semibold text-primary border border-outline-variant/50 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Schedule Round on this Date
        </button>
      </div>
    </div>
  );
}
