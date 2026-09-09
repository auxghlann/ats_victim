"use client";

import { useState } from "react";
import { Application, EnrichedInterview } from "@/types/database";

export interface EditInterviewData {
  applicationId: string;
  roundName: string;
  scheduledAt: string;
  meetingLink: string | null;
  notes: string | null;
}

interface EditInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: EnrichedInterview;
  applications: Application[];
  onSubmit: (data: EditInterviewData) => Promise<void>;
  isSubmitting: boolean;
}

export function EditInterviewModal({
  isOpen,
  onClose,
  interview,
  applications,
  onSubmit,
  isSubmitting,
}: EditInterviewModalProps) {
  const [applicationId, setApplicationId] = useState(
    interview.application_id || applications[0]?.id || ""
  );
  const [roundName, setRoundName] = useState(interview.round_name || "");
  const [dateTime, setDateTime] = useState(
    interview.scheduled_at ? interview.scheduled_at.slice(0, 16) : ""
  );
  const [meetingLink, setMeetingLink] = useState(interview.meeting_link || "");
  const [notes, setNotes] = useState(interview.notes || "");

  const [prevInterview, setPrevInterview] = useState(interview);
  if (interview && interview !== prevInterview) {
    setPrevInterview(interview);
    setApplicationId(interview.application_id || applications[0]?.id || "");
    setRoundName(interview.round_name || "");
    setDateTime(interview.scheduled_at ? interview.scheduled_at.slice(0, 16) : "");
    setMeetingLink(interview.meeting_link || "");
    setNotes(interview.notes || "");
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationId || !roundName.trim() || !dateTime || isSubmitting) return;

    await onSubmit({
      applicationId,
      roundName: roundName.trim(),
      scheduledAt: dateTime,
      meetingLink: meetingLink.trim() || null,
      notes: notes.trim() || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity">
      <div className="bg-surface rounded-2xl border border-outline-variant/40 shadow-2xl max-w-md w-full p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">edit_calendar</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">Edit Interview</h3>
              <p className="text-xs text-on-surface-variant">Update interview round details</p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Application <span className="text-status-rejected">*</span>
            </label>
            <select
              required
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-outline-variant/60 shadow-2xs text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer"
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
              Round Name <span className="text-status-rejected">*</span>
            </label>
            <input
              type="text"
              required
              value={roundName}
              onChange={(e) => setRoundName(e.target.value)}
              placeholder="e.g. Technical Screen, System Design"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-outline-variant/60 shadow-2xs text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Date &amp; Time <span className="text-status-rejected">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-outline-variant/60 shadow-2xs text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Meeting URL (Optional)
            </label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/xyz or Zoom link"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-outline-variant/60 shadow-2xs text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Notes &amp; Prep Reminders (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Interviewer names, topics to review, questions to prepare..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-outline-variant/60 shadow-2xs text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !roundName.trim() || !dateTime}
              className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">{isSubmitting ? "hourglass_empty" : "check"}</span>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
