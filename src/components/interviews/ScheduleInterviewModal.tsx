import { Application } from "@/types/database";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  applications: Application[];
  applicationId: string;
  onApplicationIdChange: (val: string) => void;
  roundName: string;
  onRoundNameChange: (val: string) => void;
  dateTime: string;
  onDateTimeChange: (val: string) => void;
  meetingLink: string;
  onMeetingLinkChange: (val: string) => void;
  notes: string;
  onNotesChange: (val: string) => void;
  isSubmitting: boolean;
}

export function ScheduleInterviewModal({
  isOpen,
  onClose,
  onSubmit,
  applications,
  applicationId,
  onApplicationIdChange,
  roundName,
  onRoundNameChange,
  dateTime,
  onDateTimeChange,
  meetingLink,
  onMeetingLinkChange,
  notes,
  onNotesChange,
  isSubmitting,
}: ScheduleInterviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-surface rounded-2xl border border-outline-variant/40 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">calendar_add_on</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">Schedule Interview</h3>
              <p className="text-xs text-on-surface-variant">Log an upcoming interview round or call</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-container flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Application <span className="text-error">*</span>
            </label>
            <select
              required
              value={applicationId}
              onChange={(e) => onApplicationIdChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.company_name} - {app.job_title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Round Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              value={roundName}
              onChange={(e) => onRoundNameChange(e.target.value)}
              placeholder="e.g. Technical Screen, System Design, HR Recruiter Call"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Date &amp; Time <span className="text-error">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={dateTime}
              onChange={(e) => onDateTimeChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Meeting URL (Optional)
            </label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => onMeetingLinkChange(e.target.value)}
              placeholder="https://meet.google.com/xyz or Zoom link"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Notes &amp; Prep Reminders (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Interviewer names, topics to review, questions to prepare..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !roundName.trim() || !dateTime}
              className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? "Scheduling..." : "Schedule Interview"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
