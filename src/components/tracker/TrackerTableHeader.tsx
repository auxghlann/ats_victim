import React from "react";
import { ApplicationSortColumn } from "@/lib/repositories/applicationsRepository";
import { TRACKER_COLUMNS } from "./trackerColumns";

interface TrackerTableHeaderProps {
  colWidths: Record<string, number>;
  onResizeStart: (colKey: string, e: React.MouseEvent) => void;
  onResetWidth: (colKey: string) => void;
  isResizingRef: React.RefObject<boolean>;
  sortBy: ApplicationSortColumn;
  sortOrder: "asc" | "desc";
  onToggleSort: (column: ApplicationSortColumn) => void;
}

export function TrackerTableHeader({
  colWidths,
  onResizeStart,
  onResetWidth,
  isResizingRef,
  sortBy,
  sortOrder,
  onToggleSort,
}: TrackerTableHeaderProps) {
  return (
    <>
      <colgroup>
        {TRACKER_COLUMNS.map((col) => (
          <col
            key={col.key}
            style={{ width: `${colWidths[col.key] || col.defaultWidth}px` }}
          />
        ))}
      </colgroup>

      <thead className="bg-surface-container-low border-b border-outline-variant/30 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider select-none">
        <tr>
          {TRACKER_COLUMNS.map((col) => {
            const isSorted = col.sortKey && sortBy === col.sortKey;

            return (
              <th
                key={col.key}
                scope="col"
                className={`relative px-4 py-3 border-r border-outline-variant/20 last:border-r-0 ${
                  col.align === "center" ? "text-center" : "text-left"
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 ${
                    col.sortKey ? "cursor-pointer group hover:text-on-surface" : ""
                  } ${col.align === "center" ? "justify-center" : "justify-start"}`}
                  onClick={() => {
                    if (isResizingRef.current) return;
                    col.sortKey && onToggleSort(col.sortKey);
                  }}
                >
                  <span className="truncate">{col.label}</span>
                  {col.sortKey && (
                    <span
                      className={`material-symbols-outlined text-[13px] transition-colors shrink-0 ${
                        isSorted
                          ? "text-primary font-bold"
                          : "text-on-surface-variant/40 group-hover:text-on-surface-variant"
                      }`}
                    >
                      {isSorted
                        ? sortOrder === "asc"
                          ? "arrow_upward"
                          : "arrow_downward"
                        : "unfold_more"}
                    </span>
                  )}
                </div>

                {/* Drag Resize Handle with Double-Click Reset */}
                {col.resizable !== false && (
                  <div
                    onMouseDown={(e) => onResizeStart(col.key, e)}
                    onDoubleClick={() => onResetWidth(col.key)}
                    className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-primary/50 transition-colors z-10 select-none"
                    title="Drag to resize column (double-click to reset)"
                  />
                )}
              </th>
            );
          })}
        </tr>
      </thead>
    </>
  );
}


