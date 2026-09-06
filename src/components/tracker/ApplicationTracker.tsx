"use client";

import React, { useState, useEffect, useTransition, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Application, STATUS_BADGE_CLASSES } from "@/types/database";
import { ApplicationSortColumn } from "@/lib/repositories/applicationsRepository";
import {
  fetchApplicationsAction,
  deleteApplicationAction,
} from "@/app/actions/applications";
import { AddApplicationModal } from "./AddApplicationModal";
import { EditApplicationModal } from "./EditApplicationModal";
import { exportApplicationsToCsv } from "@/lib/utils/export";
import { formatRelativeDate } from "@/lib/utils/date";

const PAGE_SIZE = 10;

interface ApplicationTrackerProps {
  initialItems: Application[];
  initialCounts: Record<string, number>;
  initialTotal?: number;
}

interface ColumnConstraint {
  min: number;
  max: number;
  default: number;
}

const COLUMN_CONSTRAINTS: Record<string, ColumnConstraint> = {
  company: { min: 100, max: 300, default: 100 },
  role: { min: 140, max: 400, default: 140 },
  status: { min: 75, max: 150, default: 75 },
  location: { min: 110, max: 240, default: 110 },
  salary: { min: 95, max: 180, default: 95 },
  activity: { min: 130, max: 200, default: 130 },
  actions: { min: 50, max: 65, default: 50 },
};

export function ApplicationTracker({
  initialItems,
  initialCounts,
  initialTotal,
}: ApplicationTrackerProps) {
  const router = useRouter();
  const [items, setItems] = useState<Application[]>(initialItems);
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);
  const [total, setTotal] = useState<number>(initialTotal ?? initialItems.length);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedWorkSetup, setSelectedWorkSetup] = useState<string>("all");
  const [sortBy, setSortBy] = useState<ApplicationSortColumn>("last_activity_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modals & Menu State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Column Width Resizing State & Drag-Sort Decoupling
  const isResizingRef = useRef(false);
  const [colWidths, setColWidths] = useState<Record<string, number>>({
    company: COLUMN_CONSTRAINTS.company.default,
    role: COLUMN_CONSTRAINTS.role.default,
    status: COLUMN_CONSTRAINTS.status.default,
    location: COLUMN_CONSTRAINTS.location.default,
    salary: COLUMN_CONSTRAINTS.salary.default,
    activity: COLUMN_CONSTRAINTS.activity.default,
    actions: COLUMN_CONSTRAINTS.actions.default,
  });

  const handleResizeCol = (colKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isResizingRef.current = true;
    const startX = e.clientX;
    const startW = colWidths[colKey] || 150;
    const constraint = COLUMN_CONSTRAINTS[colKey] || { min: 60, max: 400, default: 150 };

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.min(constraint.max, Math.max(constraint.min, startW + delta));
      setColWidths((prev) => ({ ...prev, [colKey]: newWidth }));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      // Debounce resetting isResizingRef so trailing click event does not trigger sort
      setTimeout(() => {
        isResizingRef.current = false;
      }, 150);
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const loadData = useCallback(() => {
    startTransition(async () => {
      try {
        const result = await fetchApplicationsAction({
          search,
          status: selectedStatus === "all" ? undefined : selectedStatus,
          workSetup: selectedWorkSetup === "all" ? undefined : selectedWorkSetup,
          sortBy,
          sortOrder,
          page,
          pageSize: PAGE_SIZE,
        });
        setItems(result.items);
        setCounts(result.counts);
        setTotal(result.total);
      } catch (err) {
        console.error("Failed to load applications:", err);
      }
    });
  }, [search, selectedStatus, selectedWorkSetup, sortBy, sortOrder, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleDelete = async (e: React.MouseEvent, app: Application) => {
    e.stopPropagation();
    if (confirm(`Delete application for ${app.company_name}?`)) {
      await deleteApplicationAction(app.id);
      loadData();
    }
  };

  const handleToggleSort = (column: ApplicationSortColumn) => {
    if (isResizingRef.current) return;
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    setPage(1);
  };

  const handleWorkSetupChange = (newSetup: string) => {
    setSelectedWorkSetup(newSetup);
    setPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleSyncClick = () => {
    setSyncToast("Gmail OAuth connector and autonomous sync pipeline will be activated in Sprint 5 & 6.");
    setTimeout(() => setSyncToast(null), 5000);
  };

  const handleExportCsv = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const result = await fetchApplicationsAction({
        search,
        status: selectedStatus === "all" ? undefined : selectedStatus,
        workSetup: selectedWorkSetup === "all" ? undefined : selectedWorkSetup,
        sortBy,
        sortOrder,
        page: 1,
        pageSize: 10000,
      });
      exportApplicationsToCsv(result.items);
    } catch (err) {
      console.error("Failed to export applications:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const startItem = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(total, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Top Header & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            Application Tracker
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage your active pipeline, interview rounds, and statuses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-outline-variant/40 bg-surface hover:bg-surface-variant text-on-surface text-xs font-semibold shadow-2xs transition-all"
            title="Sync Gmail inbox for updates"
          >
            <span className="material-symbols-outlined text-base text-primary">sync</span>
            <span>Sync Inbox</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Sync Toast Feedback */}
      {syncToast && (
        <div className="p-3 bg-primary-light border border-primary/20 rounded-xl text-primary text-xs flex items-center justify-between">
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

      {/* Stitch Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface p-4 rounded-2xl shadow-xs border border-outline-variant/40">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Status Filter with filter_list icon */}
          <div className="flex items-center bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/40 focus-within:ring-2 focus-within:ring-primary focus-within:bg-surface transition-all">
            <span className="material-symbols-outlined text-on-surface-variant mr-2 text-lg">filter_list</span>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-transparent border-none focus:outline-hidden text-xs font-medium text-on-surface cursor-pointer"
            >
              <option value="all">All Statuses ({counts.all || 0})</option>
              <option value="applied">Applied ({counts.applied || 0})</option>
              <option value="viewed">Viewed ({counts.viewed || 0})</option>
              <option value="interview">Interviewing ({counts.interview || 0})</option>
              <option value="accepted">Offers ({counts.accepted || 0})</option>
              <option value="rejected">Rejected ({counts.rejected || 0})</option>
            </select>
          </div>

          {/* Work Setup Filter with location_on icon */}
          <div className="flex items-center bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/40 focus-within:ring-2 focus-within:ring-primary focus-within:bg-surface transition-all">
            <span className="material-symbols-outlined text-on-surface-variant mr-2 text-lg">location_on</span>
            <select
              value={selectedWorkSetup}
              onChange={(e) => handleWorkSetupChange(e.target.value)}
              className="bg-transparent border-none focus:outline-hidden text-xs font-medium text-on-surface cursor-pointer capitalize"
            >
              <option value="all">All Work Setups</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-site</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Search company, position, location..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface placeholder-on-surface-variant focus:outline-hidden focus:ring-2 focus:ring-primary focus:bg-surface transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-xl border border-outline-variant/30 transition-colors disabled:opacity-50"
            title="Export CSV"
          >
            {isExporting ? (
              <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-base">download</span>
            )}
            <span>{isExporting ? "Exporting..." : "Export"}</span>
          </button>
        </div>
      </div>

      {/* Main Table View with Resizable Columns and Slightly Visible Borders */}
      <div className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface shadow-xs flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse table-fixed">
            <colgroup>
              <col style={{ width: `${colWidths.company}px` }} />
              <col style={{ width: `${colWidths.role}px` }} />
              <col style={{ width: `${colWidths.status}px` }} />
              <col style={{ width: `${colWidths.location}px` }} />
              <col style={{ width: `${colWidths.salary}px` }} />
              <col style={{ width: `${colWidths.activity}px` }} />
              <col style={{ width: `${colWidths.actions}px` }} />
            </colgroup>
            <thead className="bg-surface-container text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/40 select-none">
              <tr>
                {/* 1. Company */}
                <th
                  style={{
                    width: `${colWidths.company}px`,
                    minWidth: `${COLUMN_CONSTRAINTS.company.min}px`,
                    maxWidth: `${COLUMN_CONSTRAINTS.company.max}px`,
                  }}
                  onClick={() => handleToggleSort("company_name")}
                  className="py-3.5 px-4 cursor-pointer hover:text-primary transition-colors border-r border-outline-variant/30 relative"
                >
                  <div className="flex items-center justify-between pr-2">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="truncate">Company</span>
                      {sortBy === "company_name" && (
                        <span className="material-symbols-outlined text-sm shrink-0">
                          {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    onMouseDown={(e) => handleResizeCol("company", e)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-primary/50 transition-colors z-10"
                    title="Drag to resize column"
                  />
                </th>

                {/* 2. Role / Position */}
                <th
                  style={{
                    width: `${colWidths.role}px`,
                    minWidth: `${COLUMN_CONSTRAINTS.role.min}px`,
                    maxWidth: `${COLUMN_CONSTRAINTS.role.max}px`,
                  }}
                  onClick={() => handleToggleSort("job_title")}
                  className="py-3.5 px-4 cursor-pointer hover:text-primary transition-colors border-r border-outline-variant/30 relative"
                >
                  <div className="flex items-center justify-between pr-2">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="truncate">Role</span>
                      {sortBy === "job_title" && (
                        <span className="material-symbols-outlined text-sm shrink-0">
                          {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    onMouseDown={(e) => handleResizeCol("role", e)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-primary/50 transition-colors z-10"
                    title="Drag to resize column"
                  />
                </th>

                {/* 3. Status */}
                <th
                  style={{
                    width: `${colWidths.status}px`,
                    minWidth: `${COLUMN_CONSTRAINTS.status.min}px`,
                    maxWidth: `${COLUMN_CONSTRAINTS.status.max}px`,
                  }}
                  onClick={() => handleToggleSort("status")}
                  className="py-3.5 px-4 cursor-pointer hover:text-primary transition-colors border-r border-outline-variant/30 relative"
                >
                  <div className="flex items-center justify-between pr-2">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="truncate">Status</span>
                      {sortBy === "status" && (
                        <span className="material-symbols-outlined text-sm shrink-0">
                          {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    onMouseDown={(e) => handleResizeCol("status", e)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-primary/50 transition-colors z-10"
                    title="Drag to resize column"
                  />
                </th>

                {/* 4. Location */}
                <th
                  style={{
                    width: `${colWidths.location}px`,
                    minWidth: `${COLUMN_CONSTRAINTS.location.min}px`,
                    maxWidth: `${COLUMN_CONSTRAINTS.location.max}px`,
                  }}
                  onClick={() => handleToggleSort("location")}
                  className="py-3.5 px-4 cursor-pointer hover:text-primary transition-colors border-r border-outline-variant/30 relative"
                >
                  <div className="flex items-center justify-between pr-2">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="truncate">Location</span>
                      {sortBy === "location" && (
                        <span className="material-symbols-outlined text-sm shrink-0">
                          {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    onMouseDown={(e) => handleResizeCol("location", e)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-primary/50 transition-colors z-10"
                    title="Drag to resize column"
                  />
                </th>

                {/* 5. Salary */}
                <th
                  style={{
                    width: `${colWidths.salary}px`,
                    minWidth: `${COLUMN_CONSTRAINTS.salary.min}px`,
                    maxWidth: `${COLUMN_CONSTRAINTS.salary.max}px`,
                  }}
                  onClick={() => handleToggleSort("salary_min")}
                  className="py-3.5 px-4 cursor-pointer hover:text-primary transition-colors border-r border-outline-variant/30 relative"
                >
                  <div className="flex items-center justify-between pr-2">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="truncate">Salary</span>
                      {sortBy === "salary_min" && (
                        <span className="material-symbols-outlined text-sm shrink-0">
                          {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    onMouseDown={(e) => handleResizeCol("salary", e)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-primary/50 transition-colors z-10"
                    title="Drag to resize column"
                  />
                </th>

                {/* 6. Last Activity */}
                <th
                  style={{
                    width: `${colWidths.activity}px`,
                    minWidth: `${COLUMN_CONSTRAINTS.activity.min}px`,
                    maxWidth: `${COLUMN_CONSTRAINTS.activity.max}px`,
                  }}
                  onClick={() => handleToggleSort("last_activity_date")}
                  className="py-3.5 px-4 cursor-pointer hover:text-primary transition-colors border-r border-outline-variant/30 relative"
                >
                  <div className="flex items-center justify-between pr-2">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <span className="font-semibold uppercase tracking-wider">Last Activity</span>
                      {sortBy === "last_activity_date" && (
                        <span className="material-symbols-outlined text-sm shrink-0">
                          {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    onMouseDown={(e) => handleResizeCol("activity", e)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-primary/50 transition-colors z-10"
                    title="Drag to resize column"
                  />
                </th>

                {/* 7. Actions */}
                <th
                  style={{
                    width: `${colWidths.actions}px`,
                    minWidth: `${COLUMN_CONSTRAINTS.actions.min}px`,
                    maxWidth: `${COLUMN_CONSTRAINTS.actions.max}px`,
                  }}
                  className="py-3.5 px-2 text-center select-none"
                >
                  <span className="font-semibold uppercase tracking-wider">Actions</span>
                </th>
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
                      Try adjusting your search query, status, or work setup filters
                    </p>
                  </td>
                </tr>
              ) : (
                items.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => router.push(`/tracker/${app.id}`)}
                    className="hover:bg-surface-variant/80 cursor-pointer transition-colors duration-150 group"
                  >
                    {/* 1. Company */}
                    <td className="py-3.5 px-4 border-r border-outline-variant/20 min-w-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center border border-outline-variant/40 text-primary font-bold text-xs shrink-0">
                          {app.company_name.charAt(0)}
                        </div>
                        <span className="text-on-surface font-semibold group-hover:text-primary transition-colors truncate">
                          {app.company_name}
                        </span>
                      </div>
                    </td>

                    {/* 2. Role */}
                    <td className="py-3.5 px-4 text-on-surface font-medium border-r border-outline-variant/20 min-w-0">
                      <span className="truncate block">{app.job_title}</span>
                    </td>

                    {/* 3. Status */}
                    <td className="py-3.5 px-4 border-r border-outline-variant/20 min-w-0">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border truncate ${STATUS_BADGE_CLASSES[app.status] || "bg-surface-container text-on-surface-variant border-outline-variant"
                          }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    {/* 4. Location */}
                    <td className="py-3.5 px-4 text-on-surface-variant text-xs border-r border-outline-variant/20 min-w-0">
                      <div className="flex flex-col items-start gap-1 min-w-0">
                        <span className="truncate w-full">{app.location || "Remote"}</span>
                        {app.work_setup && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-surface-container text-on-surface-variant border border-outline-variant/30 shrink-0">
                            {app.work_setup}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 5. Salary */}
                    <td className="py-3.5 px-4 text-xs text-on-surface border-r border-outline-variant/20 min-w-0 truncate">
                      {app.salary_min && app.salary_max
                        ? `$${(app.salary_min / 1000).toFixed(0)}k - $${(app.salary_max / 1000).toFixed(0)}k`
                        : "Competitive"}
                    </td>

                    {/* 6. Last Activity in Readable Date */}
                    <td className="py-3.5 px-4 text-xs text-on-surface-variant border-r border-outline-variant/20 min-w-0 truncate">
                      <span
                        suppressHydrationWarning
                        title={app.last_activity_date || app.date_applied || "No activity"}
                      >
                        {formatRelativeDate(app.last_activity_date || app.date_applied)}
                      </span>
                    </td>

                    {/* 7. Actions: Vertical Three Dots Menu */}
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="py-3.5 px-2 text-center relative select-none"
                    >
                      <div className="flex items-center justify-center">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() =>
                              setOpenActionMenuId(openActionMenuId === app.id ? null : app.id)
                            }
                            className="p-1.5 rounded-full hover:bg-surface-variant text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center"
                            title="Application actions"
                          >
                            <span className="material-symbols-outlined text-lg leading-none">
                              more_vert
                            </span>
                          </button>

                          {/* Dropdown Menu */}
                          {openActionMenuId === app.id && (
                            <>
                              <div
                                className="fixed inset-0 z-30"
                                onClick={() => setOpenActionMenuId(null)}
                              />
                              <div className="absolute right-0 top-8 z-40 w-44 rounded-2xl bg-surface border border-outline-variant/40 shadow-xl py-1.5 text-xs text-on-surface animate-fade-in">
                                <button
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    router.push(`/tracker/${app.id}`);
                                  }}
                                  className="w-full px-3.5 py-2 text-left hover:bg-surface-variant/80 flex items-center gap-2.5 transition-colors font-medium text-on-surface"
                                >
                                  <span className="material-symbols-outlined text-base text-primary">
                                    visibility
                                  </span>
                                  <span>View Details</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    setEditingApp(app);
                                  }}
                                  className="w-full px-3.5 py-2 text-left hover:bg-surface-variant/80 flex items-center gap-2.5 transition-colors font-medium text-on-surface"
                                >
                                  <span className="material-symbols-outlined text-base text-primary">
                                    edit
                                  </span>
                                  <span>Edit</span>
                                </button>

                                <div className="my-1 border-t border-outline-variant/20" />

                                <button
                                  onClick={(e) => {
                                    setOpenActionMenuId(null);
                                    handleDelete(e, app);
                                  }}
                                  className="w-full px-3.5 py-2 text-left hover:bg-status-rejected/10 text-status-rejected flex items-center gap-2.5 transition-colors font-medium"
                                >
                                  <span className="material-symbols-outlined text-base">
                                    delete
                                  </span>
                                  <span>Delete</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stitch Pagination Footer */}
        <div className="mt-auto border-t border-outline-variant/40 p-4 flex items-center justify-between bg-surface-container-low select-none">
          <span className="text-xs font-medium text-on-surface-variant">
            {total === 0
              ? "No applications"
              : `Showing ${startItem}-${endItem} of ${total} applications`}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isPending}
              className="p-1.5 rounded-lg hover:bg-surface-variant text-on-surface-variant disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center justify-center"
              title="Previous Page"
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  disabled={isPending}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${pageNum === page
                    ? "bg-primary text-on-primary shadow-2xs"
                    : "hover:bg-surface-variant text-on-surface-variant"
                    }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isPending}
              className="p-1.5 rounded-lg hover:bg-surface-variant text-on-surface-variant disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center justify-center"
              title="Next Page"
            >
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadData}
      />

      {editingApp && (
        <EditApplicationModal
          key={editingApp.id}
          application={editingApp}
          isOpen={true}
          onClose={() => setEditingApp(null)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
