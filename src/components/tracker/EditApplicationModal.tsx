"use client";

import { useState } from "react";
import { Application, ApplicationStatus, WorkSetup } from "@/types/database";
import { updateApplicationAction } from "@/app/actions/applicationsAction";

interface EditApplicationModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditApplicationModal({
  application,
  isOpen,
  onClose,
  onSuccess,
}: EditApplicationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState(() => ({
    company_name: application?.company_name || "",
    job_title: application?.job_title || "",
    status: (application?.status || "applied") as ApplicationStatus,
    location: application?.location || "",
    work_setup: ((application?.work_setup as WorkSetup) || "remote") as WorkSetup,
    salary_min: application?.salary_min ? String(application?.salary_min) : "",
    salary_max: application?.salary_max ? String(application?.salary_max) : "",
  }));

  if (!isOpen || !application) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company_name.trim() || !formData.job_title.trim()) {
      setError("Company Name and Job Title are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateApplicationAction(application.id, {
        company_name: formData.company_name.trim(),
        job_title: formData.job_title.trim(),
        status: formData.status,
        location: formData.location.trim() || null,
        work_setup: formData.work_setup,
        salary_min: formData.salary_min ? Number(formData.salary_min) : null,
        salary_max: formData.salary_max ? Number(formData.salary_max) : null,
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update application.");
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
      <div className="relative z-10 w-full max-w-2xl bg-surface rounded-3xl border border-outline-variant/40 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">edit</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface">
                Edit Application
              </h2>
              <p className="text-xs text-on-surface-variant">
                Update job details and status for {application.company_name}
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3.5 bg-status-rejected/10 border border-status-rejected/20 rounded-xl text-status-rejected text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Row 1: Company & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all"
              />
            </div>
          </div>

          {/* Row 2: Status & Work Setup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as ApplicationStatus })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all capitalize"
              >
                <option value="applied">Applied</option>
                <option value="viewed">Viewed</option>
                <option value="interview">Interview</option>
                <option value="accepted">Offer Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Work Setup
              </label>
              <select
                value={formData.work_setup}
                onChange={(e) =>
                  setFormData({ ...formData, work_setup: e.target.value as WorkSetup })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all capitalize"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-site</option>
              </select>
            </div>
          </div>

          {/* Row 3: Location */}
          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. San Francisco, CA or Remote"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all"
            />
          </div>

          {/* Row 4: Salary Min & Max */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Salary Min ($/year)
              </label>
              <input
                type="number"
                placeholder="120000"
                value={formData.salary_min}
                onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Salary Max ($/year)
              </label>
              <input
                type="number"
                placeholder="160000"
                value={formData.salary_max}
                onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-on-surface-variant hover:bg-surface-variant transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
