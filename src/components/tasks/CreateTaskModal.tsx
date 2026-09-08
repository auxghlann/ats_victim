import { Application, TaskPriority } from "@/types/database";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  applications: Application[];
  title: string;
  onTitleChange: (val: string) => void;
  applicationId: string;
  onApplicationIdChange: (val: string) => void;
  priority: TaskPriority;
  onPriorityChange: (val: TaskPriority) => void;
  dueDate: string;
  onDueDateChange: (val: string) => void;
  isSubmitting: boolean;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  applications,
  title,
  onTitleChange,
  applicationId,
  onApplicationIdChange,
  priority,
  onPriorityChange,
  dueDate,
  onDueDateChange,
  isSubmitting,
}: CreateTaskModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-surface rounded-2xl border border-outline-variant/40 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
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
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-container flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Task Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. Send follow-up email after technical screen"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Link to Application (Optional)
            </label>
            <select
              value={applicationId}
              onChange={(e) => onApplicationIdChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
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
                onChange={(e) => onPriorityChange(e.target.value as TaskPriority)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
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
                onChange={(e) => onDueDateChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:border-primary"
              >
              </input>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
