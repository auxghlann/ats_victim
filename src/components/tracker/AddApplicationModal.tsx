"use client";

import { useState } from "react";
import { ApplicationStatus } from "@/types/database";
import { createApplicationAction } from "@/app/actions/applications";

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddApplicationModal({
  isOpen,
  onClose,
  onSuccess,
}: AddApplicationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    company_name: "",
    job_title: "",
    status: "applied" as ApplicationStatus,
    location: "",
    work_setup: "remote" as import("@/types/database").WorkSetup,
    salary_min: "",
    salary_max: "",
    posting_url: "",
    job_description: "",
    notes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company_name.trim() || !formData.job_title.trim()) {
      setError("Company Name and Job Title are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createApplicationAction({
        company_name: formData.company_name.trim(),
        job_title: formData.job_title.trim(),
        status: formData.status,
        location: formData.location.trim() || undefined,
        work_setup: formData.work_setup,
        salary_min: formData.salary_min ? Number(formData.salary_min) : undefined,
        salary_max: formData.salary_max ? Number(formData.salary_max) : undefined,
        posting_url: formData.posting_url.trim() || undefined,
        job_description: formData.job_description.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl bg-surface rounded-3xl border border-outline-variant/40 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">add_circle</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface">
                New Application
              </h2>
              <p className="text-xs text-on-surface-variant">
                Manually record a job application to your tracker
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-status-rejected/10 text-status-rejected text-xs font-medium border border-status-rejected/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Anthropic, Stripe, Apple"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Staff AI Engineer"
                value={formData.job_title}
                onChange={(e) =>
                  setFormData({ ...formData, job_title: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as ApplicationStatus,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all capitalize"
              >
                <option value="applied">Applied</option>
                <option value="viewed">Viewed</option>
                <option value="interview">Interview</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Work Setup
              </label>
              <select
                value={formData.work_setup}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    work_setup: e.target.value as import("@/types/database").WorkSetup,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all capitalize"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-site</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Salary Min (USD)
              </label>
              <input
                type="number"
                placeholder="e.g. 150000"
                value={formData.salary_min}
                onChange={(e) =>
                  setFormData({ ...formData, salary_min: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Salary Max (USD)
              </label>
              <input
                type="number"
                placeholder="e.g. 210000"
                value={formData.salary_max}
                onChange={(e) =>
                  setFormData({ ...formData, salary_max: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              Posting URL
            </label>
            <input
                type="url"
                placeholder="https://..."
                value={formData.posting_url}
                onChange={(e) =>
                  setFormData({ ...formData, posting_url: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all"
              />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              Recruiter / Application Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Referred by Jane, HR call next Wednesday..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              Job Description (Markdown supported)
            </label>
            <textarea
              rows={4}
              placeholder="Paste key responsibilities, requirements, and tech stack..."
              value={formData.job_description}
              onChange={(e) =>
                setFormData({ ...formData, job_description: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-sm text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all font-mono text-xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-on-surface-variant hover:bg-surface-variant transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-all shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Create Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
