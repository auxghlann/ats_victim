import { useState, useRef, useEffect } from "react";
import { EnrichedTask } from "@/types/database";

interface GeneralTasksSidebarProps {
  tasks: EnrichedTask[];
  onToggleTask: (taskId: string, currentCompleted: boolean | number) => void;
  onEditTask: (task: EnrichedTask) => void;
  onDeleteTask: (taskId: string) => void;
  quickTitle: string;
  onQuickTitleChange: (val: string) => void;
  onQuickAdd: (e: React.FormEvent) => void;
  isQuickAdding: boolean;
}

function GeneralTaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: EnrichedTask;
  onToggle: (taskId: string, currentCompleted: boolean | number) => void;
  onEdit: (task: EnrichedTask) => void;
  onDelete: (taskId: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isDone = Boolean(task.completed);

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
    <div className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container-low border border-transparent hover:border-outline-variant/30 transition-all relative">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onToggle(task.id, task.completed)}
          className={`w-4 h-4 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
            isDone
              ? "bg-primary text-on-primary"
              : "border border-outline-variant text-transparent hover:border-primary"
          }`}
        >
          <span className="material-symbols-outlined text-xs font-bold">check</span>
        </button>
        <span
          className={`text-xs truncate ${
            isDone ? "line-through text-on-surface-variant" : "text-on-surface"
          }`}
        >
          {task.title}
        </span>
      </div>

      <div className="relative shrink-0" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-6 h-6 rounded text-on-surface-variant hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xs">more_vert</span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-7 z-30 w-28 bg-surface rounded-xl border border-outline-variant/40 shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onEdit(task);
              }}
              className="w-full px-2.5 py-1.5 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs text-primary">edit</span>
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onDelete(task.id);
              }}
              className="w-full px-2.5 py-1.5 text-left text-xs font-semibold text-error hover:bg-error/10 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs">delete</span>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function GeneralTasksSidebar({
  tasks,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  quickTitle,
  onQuickTitleChange,
  onQuickAdd,
  isQuickAdding,
}: GeneralTasksSidebarProps) {
  const generalTasks = tasks.filter((t) => !t.application_id);

  return (
    <div className="bg-surface p-6 rounded-2xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-on-surface">General Tasks</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Personal reminders &amp; general follow-ups
            </p>
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {generalTasks.filter((t) => !t.completed).length} pending
          </span>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={onQuickAdd} className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => onQuickTitleChange(e.target.value)}
              placeholder="Quick add general task..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/60"
            />
            <button
              type="submit"
              disabled={isQuickAdding || !quickTitle.trim()}
              className="px-3 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer shrink-0"
            >
              Add
            </button>
          </div>
        </form>

        {/* General Tasks List */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {generalTasks.map((t) => (
            <GeneralTaskRow
              key={t.id}
              task={t}
              onToggle={onToggleTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}

          {generalTasks.length === 0 && (
            <div className="text-center py-6 text-xs text-on-surface-variant">
              No general tasks yet. Add one above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
