import { useState, useRef, useCallback, useEffect } from "react";
import { TrackerColumnDef } from "./trackerColumns";

export function useColumnResize(columns: TrackerColumnDef[]) {
  const [colWidths, setColWidths] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const col of columns) {
      initial[col.key] = col.defaultWidth;
    }
    return initial;
  });

  const isResizingRef = useRef(false);
  const activeListenersRef = useRef<{ onMouseMove: (e: MouseEvent) => void; onMouseUp: () => void } | null>(null);

  // Clean up any active drag listeners if component unmounts
  useEffect(() => {
    return () => {
      if (activeListenersRef.current) {
        document.removeEventListener("mousemove", activeListenersRef.current.onMouseMove);
        document.removeEventListener("mouseup", activeListenersRef.current.onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };
  }, []);

  const handleResizeStart = useCallback(
    (colKey: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isResizingRef.current = true;

      const colDef = columns.find((c) => c.key === colKey);
      const minW = colDef?.minWidth ?? 50;
      const maxW = colDef?.maxWidth ?? 500;
      const startX = e.clientX;
      const startWidth = colWidths[colKey] ?? colDef?.defaultWidth ?? 120;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        const newWidth = Math.min(maxW, Math.max(minW, startWidth + delta));
        setColWidths((prev) => ({ ...prev, [colKey]: newWidth }));
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        activeListenersRef.current = null;

        // Brief delay before resetting ref so click handler doesn't trigger column sort
        setTimeout(() => {
          isResizingRef.current = false;
        }, 120);
      };

      activeListenersRef.current = { onMouseMove, onMouseUp };
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [columns, colWidths]
  );

  const resetWidth = useCallback(
    (colKey: string) => {
      const colDef = columns.find((c) => c.key === colKey);
      if (colDef) {
        setColWidths((prev) => ({ ...prev, [colKey]: colDef.defaultWidth }));
      }
    },
    [columns]
  );

  return {
    colWidths,
    handleResizeStart,
    resetWidth,
    isResizingRef,
  };
}
