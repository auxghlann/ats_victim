"use client";

import { useState } from "react";
import { Application, TaskPriority } from "@/types/database";

export interface CreateTaskData {
  title: string;
  applicationId: string | null;
  priority: TaskPriority;
  dueDate: string | null;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: Application[];
  onSubmit: (data: CreateTaskData) => Promise<void>;
  isSubmitting: boolean;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  applications,
  onSubmit,
  isSubmitting,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    await onSubmit({
      title: title.trim(),
      applicationId: applicationId || null,
      priority,
      dueDate: dueDate || null,
    });

    setTitle("");
    setApplicationId("");
    setPriority("medium");
    setDueDate("");
  };

  const handleClose = () => {
    setTitle("");
    setApplicationId("");
    setPriority("medium");
    setDueDate("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity">
      <div className="bg-surface rounded-2xl border border-outline-variant/40 shadow-2xl max-w-md w-full p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">add_task</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">New Task</h3>
              <p className="text-xs text-on-surface-variant">Create an action item for your job search</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-container flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Task Title <span className="text-status-rejected">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Send follow-up email after technical screen"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-outline-variant/60 shadow-2xs text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Link to Application (Optional)
            </label>
            <select
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-outline-variant/60 shadow-2xs text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer"
            >
              <option value="">None (General Task)</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.company_name} - {app.job_title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-outline-variant/60 shadow-2xs text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-outline-variant/60 shadow-2xs text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm font-bold">
                {isSubmitting ? "hourglass_empty" : "add"}
              </span>
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
