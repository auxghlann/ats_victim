"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { Application, ApplicationStatus, STATUS_BADGE_CLASSES } from "@/types/database";
import {
  fetchApplicationsAction,
  updateApplicationStatusAction,
  deleteApplicationAction,
} from "@/app/actions/applications";
import { AddApplicationModal } from "./AddApplicationModal";
import { ApplicationDetailDrawer } from "./ApplicationDetailDrawer";

interface ApplicationTrackerProps {
  initialItems: Application[];
  initialCounts: Record<string, number>;
}

export function ApplicationTracker({
  initialItems,
  initialCounts,
}: ApplicationTrackerProps) {
  const [items, setItems] = useState<Application[]>(initialItems);
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"last_activity_date" | "company_name" | "status">("last_activity_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = useCallback(() => {
    startTransition(async () => {
      try {
        const result = await fetchApplicationsAction({
          search,
          status: selectedStatus === "all" ? undefined : selectedStatus,
          sortBy,
          sortOrder,
        });
        setItems(result.items);
        setCounts(result.counts);
      } catch (err) {
        console.error("Failed to load applications:", err);
      }
    });
  }, [search, selectedStatus, sortBy, sortOrder]);

  // Debounced search and filter triggers
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleQuickStatusChange = async (
    e: React.MouseEvent,
    appId: string,
    newStatus: ApplicationStatus
  ) => {
    e.stopPropagation();
    await updateApplicationStatusAction(appId, newStatus);
    loadData();
  };

  const handleDelete = async (e: React.MouseEvent, app: Application) => {
    e.stopPropagation();
    if (confirm(`Delete application for ${app.company_name}?`)) {
      await deleteApplicationAction(app.id);
      loadData();
    }
  };

  const handleToggleSort = (column: "last_activity_date" | "company_name" | "status") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleSyncClick = () => {
    setSyncToast("Gmail OAuth connector and autonomous sync pipeline will be activated in Sprint 5 & 6.");
    setTimeout(() => setSyncToast(null), 5000);
  };

  const filterChips: { id: string; label: string; countKey: string }[] = [
    { id: "all", label: "All Applications", countKey: "all" },
    { id: "applied", label: "Applied", countKey: "applied" },
    { id: "viewed", label: "Viewed", countKey: "viewed" },
    { id: "interview", label: "Interviewing", countKey: "interview" },
    { id: "accepted", label: "Offers", countKey: "accepted" },
    { id: "rejected", label: "Rejected", countKey: "rejected" },
  ];


  return (
    <div className="space-y-6">
      {/* Top Header & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            Application Tracker
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Monitor and manage your active career pipeline across all stages
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncClick}
            className="px-4 py-2.5 rounded-full border border-outline-variant/60 bg-surface hover:bg-surface-variant/60 text-xs font-semibold text-on-surface flex items-center gap-2 transition-all shadow-2xs"
          >
            <span className="material-symbols-outlined text-base text-primary">sync</span>
            Sync with Gmail
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Add Application
          </button>
        </div>
      </div>

      {/* Sync Toast Notification */}
      {syncToast && (
        <div className="p-3.5 rounded-2xl bg-surface-container border border-primary/30 text-xs text-on-surface flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">info</span>
            <span>{syncToast}</span>
          </div>
          <button
            onClick={() => setSyncToast(null)}
            className="text-on-surface-variant hover:text-on-surface text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search company, position, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-surface-container border border-outline-variant/40 text-xs text-on-surface placeholder-on-surface-variant focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {filterChips.map((chip) => {
            const isSelected = selectedStatus === chip.id;
            const count = counts[chip.countKey] || 0;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedStatus(chip.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-primary text-on-primary shadow-2xs font-semibold"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-variant/80 hover:text-on-surface border border-outline-variant/30"
                }`}
              >
                <span>{chip.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-surface text-on-surface-variant"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table View */}
      <div className="overflow-x-auto rounded-2xl border border-outline-variant/40 bg-surface shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/40 select-none">
            <tr>
              <th
                onClick={() => handleToggleSort("company_name")}
                className="py-3.5 px-5 cursor-pointer hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Company</span>
                  {sortBy === "company_name" && (
                    <span className="material-symbols-outlined text-sm">
                      {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
                    </span>
                  )}
                </div>
              </th>
              <th className="py-3.5 px-5">Role / Position</th>
              <th
                onClick={() => handleToggleSort("status")}
                className="py-3.5 px-5 cursor-pointer hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  {sortBy === "status" && (
                    <span className="material-symbols-outlined text-sm">
                      {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
                    </span>
                  )}
                </div>
              </th>
              <th className="py-3.5 px-5">Location</th>
              <th className="py-3.5 px-5">Salary</th>
              <th
                onClick={() => handleToggleSort("last_activity_date")}
                className="py-3.5 px-5 cursor-pointer hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Last Activity</span>
                  {sortBy === "last_activity_date" && (
                    <span className="material-symbols-outlined text-sm">
                      {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
                    </span>
                  )}
                </div>
              </th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/20 text-on-surface">
            {isPending && items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-on-surface-variant text-xs">
                  <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                  Loading applications...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-2xl">search_off</span>
                  </div>
                  <p className="text-sm font-semibold text-on-surface">No applications found</p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Try adjusting your filters, search term, or add a new job application.
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-4 px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all"
                  >
                    + Add Application
                  </button>
                </td>
              </tr>
            ) : (
              items.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className="hover:bg-surface-variant/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-5 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shadow-2xs group-hover:scale-105 transition-transform">
                      {app.company_name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-on-surface">{app.company_name}</div>
                    </div>
                  </td>

                  <td className="py-3.5 px-5 font-medium text-on-surface">
                    {app.job_title}
                  </td>

                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${
                        STATUS_BADGE_CLASSES[app.status] || "bg-surface-container text-on-surface-variant border-outline-variant"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-5 text-on-surface-variant text-xs">
                    {app.location || "Remote"}
                  </td>

                  <td className="py-3.5 px-5 text-xs text-on-surface">
                    {app.salary_min && app.salary_max
                      ? `$${(app.salary_min / 1000).toFixed(0)}k - $${(app.salary_max / 1000).toFixed(0)}k`
                      : "Competitive"}
                  </td>

                  <td className="py-3.5 px-5 text-xs text-on-surface-variant">
                    {app.last_activity_date || app.date_applied || "N/A"}
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Quick Status Select */}
                      <select
                        value={app.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleQuickStatusChange(
                            e as unknown as React.MouseEvent,
                            app.id,
                            e.target.value as ApplicationStatus
                          )
                        }
                        className="px-2 py-1 rounded-lg text-xs bg-surface-container border border-outline-variant/40 text-on-surface-variant hover:text-on-surface focus:outline-hidden capitalize"
                      >
                        <option value="applied">Applied</option>
                        <option value="viewed">Viewed</option>
                        <option value="interview">Interview</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      <button
                        onClick={(e) => handleDelete(e, app)}
                        className="p-1.5 rounded-full text-on-surface-variant hover:text-status-rejected hover:bg-status-rejected/10 transition-colors"
                        title="Delete application"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>

                      <button
                        onClick={() => setSelectedAppId(app.id)}
                        className="p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors"
                        title="View details"
                      >
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals & Slide-Overs */}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadData}
      />

      <ApplicationDetailDrawer
        applicationId={selectedAppId}
        onClose={() => setSelectedAppId(null)}
        onUpdated={loadData}
      />
    </div>
  );
}
