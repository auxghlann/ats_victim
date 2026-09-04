"use client";

import { useState, useEffect } from "react";
import { Application, ApplicationDetail, ApplicationStatus, TimelineEvent } from "@/types/database";
import {
  fetchApplicationDetailAction,
  updateApplicationStatusAction,
  updateApplicationNotesAction,
  deleteApplicationAction,
} from "@/app/actions/applications";

interface ApplicationDetailDrawerProps {
  applicationId: string | null;
  onClose: () => void;
  onUpdated: () => void;
}

export function ApplicationDetailDrawer({
  applicationId,
  onClose,
  onUpdated,
}: ApplicationDetailDrawerProps) {
  const [data, setData] = useState<{ application: Application; detail: ApplicationDetail | null } | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "timeline">("overview");
  const [notesText, setNotesText] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    if (!applicationId) return;

    let isMounted = true;
    fetchApplicationDetailAction(applicationId).then((res) => {
      if (!isMounted || !res) return;
      setData({ application: res.application, detail: res.detail });
      setNotesText(res.detail?.notes || "");
    });

    return () => {
      isMounted = false;
    };
  }, [applicationId]);

  const application = data?.application && data.application.id === applicationId ? data.application : null;
  const detail = data?.application && data.application.id === applicationId ? data.detail : null;
  const loading = !application;



  if (!applicationId) return null;

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!application || statusUpdating) return;
    setStatusUpdating(true);
    try {
      const updated = await updateApplicationStatusAction(application.id, newStatus);
      if (updated) {
        const refreshed = await fetchApplicationDetailAction(application.id);
        if (refreshed) {
          setData({ application: refreshed.application, detail: refreshed.detail });
        }
        onUpdated();
      }

    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!application || savingNotes) return;
    setSavingNotes(true);
    try {
      await updateApplicationNotesAction(application.id, notesText);
      onUpdated();
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async () => {
    if (!application) return;
    if (confirm(`Are you sure you want to delete application for ${application.company_name}?`)) {
      await deleteApplicationAction(application.id);
      onUpdated();
      onClose();
    }
  };

  const parsedTimeline: TimelineEvent[] = Array.isArray(detail?.timeline)
    ? detail.timeline
    : (() => { try { return JSON.parse(detail?.timeline || "[]"); } catch { return []; } })();


  const stages: { label: string; value: ApplicationStatus }[] = [
    { label: "Applied", value: "applied" },
    { label: "Viewed", value: "viewed" },
    { label: "Interview", value: "interview" },
    { label: "Accepted", value: "accepted" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-Over Drawer */}
      <div className="relative z-10 w-full max-w-xl bg-surface h-full shadow-2xl border-l border-outline-variant/40 flex flex-col transform transition-transform duration-200 ease-out">
        {/* Top App Bar inside Drawer */}
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container/40">
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-primary">work</span>
            Application Details
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 rounded-full text-status-rejected hover:bg-status-rejected/10 transition-colors"
              title="Delete application"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors"
              title="Close drawer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {loading || !application ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header Info */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary font-bold text-xl flex items-center justify-center shadow-xs">
                {application.company_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-on-surface leading-snug">
                  {application.job_title}
                </h2>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant mt-0.5">
                  <span className="font-semibold text-primary">
                    {application.company_name}
                  </span>
                  {application.location && (
                    <>
                      <span>&bull;</span>
                      <span>{application.location}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-3 text-xs text-on-surface-variant">
                  {application.date_applied && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">calendar_today</span>
                      Applied {application.date_applied}
                    </span>
                  )}
                  {application.salary_min && application.salary_max && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">payments</span>
                      ${(application.salary_min / 1000).toFixed(0)}k - ${(application.salary_max / 1000).toFixed(0)}k
                    </span>
                  )}
                  {detail?.posting_url && (
                    <a
                      href={detail.posting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 font-medium ml-auto"
                    >
                      Posting Link
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Stage Progress Stepper */}
            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Pipeline Stage
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize bg-primary/10 text-primary border border-primary/20">
                  Current: {application.status}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {stages.map((stage) => {
                  const isCurrent = application.status === stage.value;
                  return (
                    <button
                      key={stage.value}
                      disabled={statusUpdating}
                      onClick={() => handleStatusChange(stage.value)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-medium transition-all ${
                        isCurrent
                          ? "bg-primary text-on-primary font-bold shadow-xs scale-102"
                          : "bg-surface hover:bg-surface-variant/80 text-on-surface-variant border border-outline-variant/30"
                      }`}
                    >
                      {stage.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Tabs */}
            <div className="border-b border-outline-variant/30 flex gap-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === "overview"
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-base">description</span>
                Description
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`pb-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === "notes"
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-base">edit_note</span>
                Notes
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`pb-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === "timeline"
                    ? "border-primary text-primary"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-base">history</span>
                Timeline ({parsedTimeline.length})
              </button>
            </div>

            {/* Tab 1: Description */}
            {activeTab === "overview" && (
              <div className="prose prose-sm max-w-none text-on-surface leading-relaxed whitespace-pre-wrap font-sans text-sm bg-surface-container/30 p-4 rounded-2xl border border-outline-variant/20">
                {detail?.job_description || "No job description added yet for this application."}
              </div>
            )}

            {/* Tab 2: Recruiter Notes */}
            {activeTab === "notes" && (
              <div className="space-y-3">
                <textarea
                  rows={8}
                  placeholder="Keep track of interview notes, recruiter contacts, preparation questions, and next steps..."
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {savingNotes && (
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Save Notes
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Timeline */}
            {activeTab === "timeline" && (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/40">
                {parsedTimeline.length === 0 ? (
                  <p className="text-xs text-on-surface-variant">No activity timeline recorded yet.</p>
                ) : (
                  parsedTimeline.map((event, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline node */}
                      <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-primary border-2 border-surface" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-primary capitalize">
                            {event.status}
                          </span>
                          <span className="text-[11px] text-on-surface-variant font-medium">
                            {event.date}
                          </span>
                        </div>
                        {event.snippet && (
                          <p className="text-xs text-on-surface-variant mt-1 bg-surface-container/50 p-2.5 rounded-xl border border-outline-variant/30">
                            {event.snippet}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
