"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Application,
  ApplicationDetail,
  ApplicationStatus,
  STATUS_BADGE_CLASSES,
  TimelineEvent,
  Task,
} from "@/types/database";
import {
  deleteApplicationAction,
  toggleTaskAction,
  createTaskAction,
  addNoteAction,
  updateJobDescriptionAction,
} from "@/app/actions/applications";
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer";

interface NoteItem {
  id: string;
  date: string;
  content: string;
}

interface JobDetailViewProps {
  application: Application;
  detail: ApplicationDetail | null;
  initialTasks: Task[];
}

export function JobDetailView({
  application: initialApp,
  detail: initialDetail,
  initialTasks,
}: JobDetailViewProps) {
  const router = useRouter();
  const [app] = useState<Application>(initialApp);
  const [detail, setDetail] = useState<ApplicationDetail | null>(initialDetail);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);


  // Job Description Edit State
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(initialDetail?.job_description || "");
  const [isSavingDescription, setIsSavingDescription] = useState(false);

  // New Note State
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // New Task State
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSavingTask, setIsSavingTask] = useState(false);

  // Parse Notes list
  const notesList: NoteItem[] = (() => {
    if (!detail?.notes) return [];
    try {
      const parsed = JSON.parse(detail.notes);
      return Array.isArray(parsed) ? parsed : [{ id: "n-1", date: "Initial Note", content: detail.notes }];
    } catch {
      return [{ id: "n-1", date: "Initial Note", content: detail.notes }];
    }
  })();

  // Parse Timeline events
  const timelineEvents: TimelineEvent[] = (() => {
    try {
      return Array.isArray(detail?.timeline) ? detail.timeline : JSON.parse(detail?.timeline || "[]");
    } catch {
      return [];
    }
  })();

  // Status Stepper configuration
  const steps: { label: string; value: ApplicationStatus; icon: string }[] = [
    { label: "Applied", value: "applied", icon: "check" },
    { label: "Screening", value: "viewed", icon: "record_voice_over" },
    { label: "Technical", value: "interview", icon: "code" },
    { label: "Offer", value: "accepted", icon: "handshake" },
  ];

  const STATUS_STEP_INDEX: Record<ApplicationStatus, number> = {
    applied: 0,
    viewed: 1,
    interview: 2,
    accepted: 3,
    rejected: 3,
  };
  const currentStepIndex = STATUS_STEP_INDEX[app.status] ?? 0;


  const handleSaveDescription = async () => {
    setIsSavingDescription(true);
    try {
      const updated = await updateJobDescriptionAction(app.id, descriptionDraft);
      if (updated) {
        setDetail(updated);
        setIsEditingDescription(false);
      }
    } catch (err) {
      console.error("Failed to update job description:", err);
    } finally {
      setIsSavingDescription(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete application for ${app.company_name}?`)) {
      await deleteApplicationAction(app.id);
      router.push("/tracker");
    }
  };

  const handleToggleTask = async (taskId: string, currentCompleted: number | boolean) => {
    const nextCompleted = !currentCompleted;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: nextCompleted ? 1 : 0 } : t))
    );
    await toggleTaskAction(taskId, nextCompleted, app.id);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || isSavingTask) return;
    setIsSavingTask(true);
    try {
      const created = (await createTaskAction(app.id, newTaskTitle.trim())) as Task;
      if (created) {
        setTasks((prev) => [...prev, created]);
        setNewTaskTitle("");
        setShowAddTask(false);
      }
    } finally {
      setIsSavingTask(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || isSavingNote) return;
    setIsSavingNote(true);
    try {
      const updated = await addNoteAction(app.id, newNoteContent.trim());
      if (updated) {
        setDetail(updated);
        setNewNoteContent("");
        setShowAddNote(false);
      }
    } finally {
      setIsSavingNote(false);
    }
  };

  const completedTasksCount = tasks.filter((t) => Boolean(t.completed)).length;

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/tracker"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Applications Tracker
        </Link>

        <button
          onClick={handleDelete}
          className="text-xs font-medium text-status-rejected hover:bg-status-rejected/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-base">delete</span>
          Delete Application
        </button>
      </div>

      {/* Top Hero Card (Stitch: Job Header Card) */}
      <div className="bg-surface rounded-2xl border border-outline-variant/40 shadow-xs p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            {/* Big Initial Company Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center border border-outline-variant/40 text-primary font-bold text-2xl shadow-xs shrink-0">
              {app.company_name.charAt(0)}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
                  {app.job_title}
                </h1>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold capitalize border ${
                    STATUS_BADGE_CLASSES[app.status] || "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {app.status}
                </span>
                {app.work_setup && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-surface-container text-on-surface-variant border border-outline-variant/30">
                    {app.work_setup}
                  </span>
                )}
              </div>

              <p className="text-sm font-medium text-on-surface-variant flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-on-surface font-semibold">
                  <span className="material-symbols-outlined text-base text-primary">domain</span>
                  {app.company_name}
                </span>
                <span className="text-outline-variant">•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  {app.location || "Remote"}
                </span>
                {app.salary_min && app.salary_max && (
                  <>
                    <span className="text-outline-variant">•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">payments</span>
                      ${(app.salary_min / 1000).toFixed(0)}k - ${(app.salary_max / 1000).toFixed(0)}k
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {detail?.posting_url && (
              <a
                href={detail.posting_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                View Posting
              </a>
            )}
          </div>
        </div>

        {/* Status Stepper (Read-only visual pipeline) */}
        <div className="mt-8 pt-8 border-t border-outline-variant/30">
          <div className="max-w-2xl mx-auto px-4 mb-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Application Pipeline
            </span>
          </div>

          <div className="flex items-center justify-between relative max-w-2xl mx-auto px-4">
            {/* Background Line */}
            <div className="absolute left-8 right-8 top-4 h-1 bg-surface-variant -z-10 rounded-full" />
            {/* Active Progress Line */}
            <div
              className="absolute left-8 top-4 h-1 bg-primary -z-10 rounded-full transition-all duration-300"
              style={{
                width: `${(currentStepIndex / (steps.length - 1)) * 85}%`,
              }}
            />

            {steps.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={step.value}
                  className="flex flex-col items-center gap-2 bg-surface px-2 select-none"
                  title={`${step.label} (${isCurrent ? "Current Stage" : isPast ? "Completed" : "Upcoming"})`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? "bg-primary text-on-primary shadow-sm ring-4 ring-primary/20 scale-110 font-bold"
                        : isPast
                        ? "bg-primary text-on-primary shadow-2xs"
                        : "bg-surface-variant text-on-surface-variant border-2 border-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isPast ? "check" : step.icon}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] transition-colors ${
                      isCurrent
                        ? "text-primary font-bold"
                        : isPast
                        ? "text-on-surface font-medium"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bento Grid Content Area (Stitch: 2 Column Left, 1 Column Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Wider: 2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* 1. Job Description Highlights Panel */}
          <section className="bg-surface rounded-2xl border border-outline-variant/40 shadow-xs p-6 md:p-8 relative overflow-hidden group hover:shadow-sm transition-shadow">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">description</span>
                Job Description Highlights
              </h2>

              {!isEditingDescription ? (
                <button
                  onClick={() => {
                    setDescriptionDraft(detail?.job_description || "");
                    setIsEditingDescription(true);
                  }}
                  className="px-3 py-1 rounded-full text-xs font-semibold text-primary hover:bg-primary/10 border border-primary/20 flex items-center gap-1.5 transition-colors"
                  title="Edit job description"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span>Edit Description</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingDescription(false)}
                    disabled={isSavingDescription}
                    className="px-3 py-1 rounded-full text-xs font-medium text-on-surface-variant hover:bg-surface-variant transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDescription}
                    disabled={isSavingDescription}
                    className="px-3.5 py-1 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSavingDescription && (
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    <span>Save</span>
                  </button>
                </div>
              )}
            </div>

            {isEditingDescription ? (
              <div className="space-y-3">
                <textarea
                  rows={10}
                  value={descriptionDraft}
                  onChange={(e) => setDescriptionDraft(e.target.value)}
                  placeholder="Paste or write the job description in Markdown (supports # headings, - lists, **bold**, etc.)..."
                  className="w-full p-4 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface font-mono leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface resize-y"
                />
                <p className="text-[11px] text-on-surface-variant">
                  Tip: Supports Markdown syntax like ## Headings, - Bullet items, and **bold**.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-on-surface leading-relaxed">
                  <MarkdownRenderer content={detail?.job_description} />
                </div>

                {/* Requirement Tags */}
                <div className="pt-3 border-t border-outline-variant/20">
                  <h3 className="text-xs font-semibold text-on-surface mb-2">Tracked Requirements &amp; Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-surface-container text-on-surface rounded-lg text-xs font-medium border border-outline-variant/30">
                      System Architecture
                    </span>
                    <span className="px-3 py-1 bg-surface-container text-on-surface rounded-lg text-xs font-medium border border-outline-variant/30">
                      TypeScript
                    </span>
                    <span className="px-3 py-1 bg-surface-container text-on-surface rounded-lg text-xs font-medium border border-outline-variant/30">
                      Distributed Systems
                    </span>
                    <span className="px-3 py-1 bg-surface-container text-on-surface rounded-lg text-xs font-medium border border-outline-variant/30">
                      API Design
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 2. My Notes Panel */}
          <section className="bg-surface-container/40 rounded-2xl border border-outline-variant/40 p-6 md:p-8 shadow-xs">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit_note</span>
                My Notes
              </h2>
              <button
                onClick={() => setShowAddNote(!showAddNote)}
                className="p-1.5 rounded-full text-primary hover:bg-primary/10 transition-colors"
                title="Add new note"
              >
                <span className="material-symbols-outlined text-xl">
                  {showAddNote ? "close" : "add"}
                </span>
              </button>
            </div>

            {/* Add Note Form */}
            {showAddNote && (
              <form onSubmit={handleAddNote} className="mb-5 p-4 rounded-xl bg-surface border border-outline-variant/40 shadow-xs space-y-3 animate-fade-in">
                <textarea
                  rows={3}
                  required
                  placeholder="Record an interview tip, recruiter detail, question, or follow-up note..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full p-3 rounded-lg bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddNote(false)}
                    className="px-3 py-1.5 rounded-full text-xs text-on-surface-variant hover:bg-surface-variant"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingNote}
                    className="px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isSavingNote && (
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Save Note
                  </button>
                </div>
              </form>
            )}

            {/* Notes Cards Grid */}
            {notesList.length === 0 ? (
              <p className="text-xs text-on-surface-variant text-center py-6">
                No preparation notes recorded yet. Click &quot;+&quot; to write your first note.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notesList.map((note) => (
                  <div
                    key={note.id}
                    className="bg-surface p-4 rounded-xl border border-outline-variant/30 shadow-2xs hover:-translate-y-0.5 transition-transform flex flex-col justify-between"
                  >
                    <p className="text-xs text-on-surface leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <div className="mt-3 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
                      <span>{note.date}</span>
                      <span className="material-symbols-outlined text-sm text-primary/60">sticky_note_2</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column (Narrower: 1/3 width) */}
        <div className="flex flex-col gap-6">
          {/* 1. Timeline Panel (Stitch: Activity Timeline) */}
          <section className="bg-surface rounded-2xl border border-outline-variant/40 shadow-xs p-6">
            <h2 className="text-base font-bold text-on-surface mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">history</span>
              Timeline
            </h2>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-variant">
              {timelineEvents.length === 0 ? (
                <p className="text-xs text-on-surface-variant">No activity timeline recorded yet.</p>
              ) : (
                timelineEvents.map((ev, i) => (
                  <div key={i} className="relative group">
                    <div className="absolute -left-[30px] top-1 w-3.5 h-3.5 rounded-full bg-surface border-2 border-primary z-10" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary capitalize">
                          {ev.status}
                        </span>
                        <span className="text-[11px] text-on-surface-variant">
                          {ev.date}
                        </span>
                      </div>
                      {ev.snippet && (
                        <p className="text-xs text-on-surface-variant mt-1.5 bg-surface-container/50 p-2.5 rounded-xl border border-outline-variant/30 leading-relaxed">
                          {ev.snippet}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* 2. Prep Checklist Panel (Stitch: Prep Checklist) */}
          <section className="bg-surface rounded-2xl border border-outline-variant/40 shadow-xs p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">checklist</span>
                Prep Checklist
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {completedTasksCount}/{tasks.length}
                </span>
                <button
                  onClick={() => setShowAddTask(!showAddTask)}
                  className="p-1 rounded-full text-primary hover:bg-primary/10 transition-colors"
                  title="Add prep task"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showAddTask ? "close" : "add"}
                  </span>
                </button>
              </div>
            </div>

            {/* Add Task Input */}
            {showAddTask && (
              <form onSubmit={handleAddTask} className="mb-4 flex gap-2 animate-fade-in">
                <input
                  type="text"
                  required
                  placeholder="e.g. Prepare system design doc..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={isSavingTask}
                  className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container disabled:opacity-50"
                >
                  Add
                </button>
              </form>
            )}

            {/* Checklist Items */}
            {tasks.length === 0 ? (
              <p className="text-xs text-on-surface-variant text-center py-4">
                No preparation tasks yet for this role.
              </p>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task) => {
                  const isDone = Boolean(task.completed);
                  return (
                    <li
                      key={task.id}
                      onClick={() => handleToggleTask(task.id, task.completed)}
                      className="flex items-start gap-3 cursor-pointer group select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        readOnly
                        className="mt-0.5 rounded-sm text-primary focus:ring-primary border-outline-variant w-4 h-4 cursor-pointer"
                      />
                      <span
                        className={`text-xs leading-snug transition-colors ${
                          isDone
                            ? "text-on-surface-variant line-through"
                            : "text-on-surface group-hover:text-primary font-medium"
                        }`}
                      >
                        {task.title}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
