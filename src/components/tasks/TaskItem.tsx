import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { EnrichedTask, TaskPriority } from "@/types/database";

const PRIORITY_BADGES: Record<TaskPriority, { bg: string; text: string; border: string }> = {
  high: { bg: "bg-error/10", text: "text-error", border: "border-error/20" },
  medium: { bg: "bg-status-interviewing/15", text: "text-status-interviewing", border: "border-status-interviewing/30" },
  low: { bg: "bg-surface-variant", text: "text-on-surface-variant", border: "border-outline-variant/40" },
};

interface TaskItemProps {
  task: EnrichedTask;
  onToggle: (taskId: string, currentCompleted: boolean | number) => void;
  onEdit: (task: EnrichedTask) => void;
  onDelete: (taskId: string) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isDone = Boolean(task.completed);
  const badge = PRIORITY_BADGES[task.priority as TaskPriority] || PRIORITY_BADGES.medium;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div
      className={`group flex items-center justify-between p-4 rounded-xl border transition-all relative ${
        isDone
          ? "bg-surface/50 border-outline-variant/20 opacity-60"
          : "bg-surface border-outline-variant/40 hover:border-primary/30 shadow-2xs"
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onToggle(task.id, task.completed)}
          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
            isDone
              ? "bg-primary text-on-primary"
              : "border border-outline-variant hover:border-primary text-transparent"
          }`}
          aria-label={isDone ? "Mark incomplete" : "Mark complete"}
        >
          <span className="material-symbols-outlined text-sm font-bold">check</span>
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={`text-xs font-semibold truncate ${
              isDone
                ? "line-through text-on-surface-variant"
                : "text-on-surface"
            }`}
          >
            {task.title}
          </p>

          <div className="flex items-center gap-2 mt-1">
            {task.application_id && task.company_name && (
              <Link
                href={`/tracker/${task.application_id}`}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md hover:underline"
              >
                <span className="material-symbols-outlined text-[12px]">business</span>
                {task.company_name}
              </Link>
            )}

            {task.due_date && (
              <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">event</span>
                {task.due_date}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-3">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize border ${badge.bg} ${badge.text} ${badge.border}`}
        >
          {task.priority}
        </span>

        {/* More Vert Menu Button & Popover */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 rounded-lg text-on-surface-variant hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer"
            title="Task actions"
          >
            <span className="material-symbols-outlined text-base">more_vert</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 z-30 w-32 bg-surface rounded-xl border border-outline-variant/40 shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(task);
                }}
                className="w-full px-3 py-1.5 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-primary">edit</span>
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(task.id);
                }}
                className="w-full px-3 py-1.5 text-left text-xs font-semibold text-error hover:bg-error/10 flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
