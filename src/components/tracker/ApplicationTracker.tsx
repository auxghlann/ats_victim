"use client";

import React, { useState, useEffect, useTransition, useCallback, useRef } from "react";
import { Application } from "@/types/database";
import { ApplicationSortColumn } from "@/lib/repositories/applicationsRepository";
import {
  fetchApplicationsAction,
  deleteApplicationAction,
} from "@/app/actions/applicationsAction";
import { AddApplicationModal } from "./AddApplicationModal";
import { EditApplicationModal } from "./EditApplicationModal";
import { exportApplicationsToCsv } from "@/lib/utils/export";
import { TrackerToolbar } from "./TrackerToolbar";
import { TrackerTableHeader } from "./TrackerTableHeader";
import { TrackerTableRow } from "./TrackerTableRow";
import { TrackerPagination } from "./TrackerPagination";
import { useColumnResize } from "./useColumnResize";
import { TRACKER_COLUMNS } from "./trackerColumns";

const PAGE_SIZE = 10;

interface ApplicationTrackerProps {
  initialItems: Application[];
  initialTotal?: number;
}

export function ApplicationTracker({
  initialItems = [],
  initialTotal,
}: ApplicationTrackerProps) {
  const [items, setItems] = useState<Application[]>(initialItems);
  const [total, setTotal] = useState<number>(initialTotal ?? initialItems.length);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
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

  // Column Resizing Hook
  const { colWidths, handleResizeStart, resetWidth, isResizingRef } = useColumnResize(TRACKER_COLUMNS);
  const isFirstRender = useRef(true);

  // Debounce search input by 300ms to avoid firing server queries on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadData = useCallback(() => {
    startTransition(async () => {
      try {
        const result = await fetchApplicationsAction({
          search: debouncedSearch,
          status: selectedStatus === "all" ? undefined : selectedStatus,
          workSetup: selectedWorkSetup === "all" ? undefined : selectedWorkSetup,
          sortBy,
          sortOrder,
          page,
          pageSize: PAGE_SIZE,
        });
        setItems(result.items);
        setTotal(result.total);
      } catch (err) {
        console.error("Failed to load applications:", err);
      }
    });
  }, [debouncedSearch, selectedStatus, selectedWorkSetup, sortBy, sortOrder, page]);

  // Only load on user interactions; skip redundant fetch on initial mount
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    loadData();
  }, [loadData]);

  const handleToggleSort = (column: ApplicationSortColumn) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const handleDelete = async (app: Application) => {
    if (confirm(`Are you sure you want to delete ${app.company_name}?`)) {
      await deleteApplicationAction(app.id);
      loadData();
    }
  };

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const fullDataset = await fetchApplicationsAction({
        search,
        status: selectedStatus === "all" ? undefined : selectedStatus,
        workSetup: selectedWorkSetup === "all" ? undefined : selectedWorkSetup,
        sortBy,
        sortOrder,
        page: 1,
        pageSize: 10000,
      });
      exportApplicationsToCsv(fullDataset.items);
    } catch (err) {
      console.error("Failed to export CSV:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSync = async () => {
    startTransition(async () => {
      try {
        const fullDataset = await fetchApplicationsAction({
          sortBy,
          sortOrder,
          page: 1,
          pageSize: PAGE_SIZE,
        });
        setItems(fullDataset.items);
        setTotal(fullDataset.total);
        setSyncToast("Sync completed! Applications up to date.");
        setTimeout(() => setSyncToast(null), 4000);
      } catch (err) {
        console.error("Sync failed:", err);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {syncToast && (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary flex items-center justify-between animate-in fade-in">
          <span>{syncToast}</span>
          <button
            type="button"
            onClick={() => setSyncToast(null)}
            className="text-primary hover:text-primary/80 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Toolbar */}
      <TrackerToolbar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(val) => {
          setSelectedStatus(val);
          setPage(1);
        }}
        selectedWorkSetup={selectedWorkSetup}
        onWorkSetupChange={(val) => {
          setSelectedWorkSetup(val);
          setPage(1);
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onExportCsv={handleExportCsv}
        isExporting={isExporting}
        onSyncGmail={handleSync}
        isPending={isPending}
      />

      {/* Table Container */}
      <div className="bg-surface rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden min-h-[300px] flex flex-col justify-between">
        <div className="w-full overflow-x-auto min-h-[240px]">
          <table className="table-fixed w-full border-collapse min-w-[750px]">
            <TrackerTableHeader
              colWidths={colWidths}
              onResizeStart={handleResizeStart}
              onResetWidth={resetWidth}
              isResizingRef={isResizingRef}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onToggleSort={handleToggleSort}
            />

            <tbody className="divide-y divide-outline-variant/20 bg-surface">
              {items.map((app) => (
                <TrackerTableRow
                  key={app.id}
                  app={app}
                  openActionMenuId={openActionMenuId}
                  onToggleActionMenu={(id) =>
                    setOpenActionMenuId(openActionMenuId === id ? null : id)
                  }
                  onEdit={(target) => setEditingApp(target)}
                  onDelete={handleDelete}
                />
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-xs text-on-surface-variant">
                    No applications match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <TrackerPagination
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPage}
        />
      </div>

      {/* Modals */}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          loadData();
        }}
      />

      {editingApp && (
        <EditApplicationModal
          key={editingApp.id}
          isOpen={Boolean(editingApp)}
          application={editingApp}
          onClose={() => setEditingApp(null)}
          onSuccess={() => {
            setEditingApp(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}
