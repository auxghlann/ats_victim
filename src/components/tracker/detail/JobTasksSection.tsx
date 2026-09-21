"use client";

import { useState, useRef } from "react";
import { Application, EnrichedTask, Task, TaskPriority } from "@/types/database";
import {
  toggleTaskAction,
  createTaskAction,
  updateTaskAction,
  deleteTaskAction,
} from "@/app/actions/tasksAction";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { EditTaskModal } from "@/components/tasks/EditTaskModal";
import { FloatingDropdown } from "@/components/common/FloatingDropdown";

const PRIORITY_BADGES: Record<TaskPriority, { bg: string; text: string; border: string }> = {
  high: { bg: "bg-error/10", text: "text-error", border: "border-error/20" },
  medium: { bg: "bg-status-interviewing/15", text: "text-status-interviewing", border: "border-status-interviewing/30" },
  low: { bg: "bg-surface-variant", text: "text-on-surface-variant", border: "border-outline-variant/40" },
};

interface JobTasksSectionProps {
  application: Application;
  initialTasks: Task[];
  applications: Application[];
}

interface JobTaskRowProps {
  task: Task;
  onToggle: (taskId: string, currentCompleted: boolean | number) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

function JobTaskRow({ task, onToggle, onEdit, onDelete }: JobTaskRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDone = Boolean(task.completed);
  const badge = PRIORITY_BADGES[task.priority as TaskPriority] || PRIORITY_BADGES.medium;

  return (
    <div
      className={`group flex items-center justify-between p-3 rounded-xl border transition-all relative ${
        isDone
          ? "bg-surface/50 border-outline-variant/20 opacity-60"
          : "bg-surface-container-low border-outline-variant/30 hover:border-primary/30 shadow-2xs"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(task.id, task.completed)}
          className={`w-4.5 h-4.5 rounded-md flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
            isDone
              ? "bg-primary text-on-primary"
              : "border border-outline-variant hover:border-primary text-transparent"
          }`}
          aria-label={isDone ? "Mark incomplete" : "Mark complete"}
        >
          <span className="material-symbols-outlined text-xs font-bold">check</span>
        </button>

        {/* Title and metadata */}
        <div className="min-w-0 flex-1">
          <p
            className={`text-xs font-medium truncate ${
              isDone ? "line-through text-on-surface-variant" : "text-on-surface"
            }`}
          >
            {task.title}
          </p>

          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span
              className={`text-[9px] font-bold px-1.5 py-0.2 rounded capitalize border ${badge.bg} ${badge.text} ${badge.border}`}
            >
              {task.priority}
            </span>

            {task.due_date && (
              <span className="text-[10px] text-on-surface-variant flex items-center gap-0.5">
                <span className="material-symbols-outlined text-xs">calendar_today</span>
                {new Date(task.due_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Menu Button & Floating Dropdown */}
      <div className="relative shrink-0 ml-2">
        <button
          ref={buttonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="w-6 h-6 rounded-md text-on-surface-variant hover:bg-surface-container flex items-center justify-center cursor-pointer transition-colors"
          title="Task actions"
        >
          <span className="material-symbols-outlined text-base">more_vert</span>
        </button>

        <FloatingDropdown
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          anchorRef={buttonRef}
          className="w-32 bg-surface rounded-xl border border-outline-variant/40 shadow-lg py-1 text-left"
        >
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onEdit(task);
            }}
            className="w-full px-3 py-1.5 text-left text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-primary">edit</span>
            Edit Task
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onDelete(task.id);
            }}
            className="w-full px-3 py-1.5 text-left text-xs font-semibold text-red-600 hover:bg-red-600 hover:text-white active:bg-red-700 flex items-center gap-2 cursor-pointer transition-colors rounded-lg group/del"
          >
            <span className="material-symbols-outlined text-sm shrink-0 group-hover/del:text-white">
              delete
            </span>
            Delete Task
          </button>
        </FloatingDropdown>
      </div>
    </div>
  );
}

export function JobTasksSection({
  application,
  initialTasks,
  applications,
}: JobTasksSectionProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<EnrichedTask | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingCount = tasks.filter((t) => !Boolean(t.completed)).length;

  const handleToggle = async (taskId: string, currentCompleted: boolean | number) => {
    const nextCompleted = !Boolean(currentCompleted);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: nextCompleted ? 1 : 0 } : t))
    );
    try {
      await toggleTaskAction(taskId, nextCompleted, application.id);
    } catch (err) {
      console.error("Failed to toggle task:", err);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: currentCompleted ? 1 : 0 } : t))
      );
    }
  };

  const handleDelete = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      const prevTasks = [...tasks];
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      try {
        await deleteTaskAction(taskId, application.id);
      } catch (err) {
        console.error("Failed to delete task:", err);
        setTasks(prevTasks);
      }
    }
  };

  const handleEditClick = (task: Task) => {
    const enriched: EnrichedTask = {
      ...task,
      company_name: application.company_name,
      job_title: application.job_title,
    };
    setEditingTask(enriched);
  };

  return (
    <div className="p-6 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-on-surface">Linked Tasks</h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {pendingCount} pending
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="px-3 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm font-bold">add</span>
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {tasks.map((task) => (
          <JobTaskRow
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        ))}

        {tasks.length === 0 && (
          <p className="text-xs italic text-on-surface-variant/60 py-2">
            No tasks linked to this application yet. Add interview follow-ups or checklist items here.
          </p>
        )}
      </div>

      {/* Reused Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        applications={applications}
        disableApplicationSelect={true}
        defaultApplicationId={application.id}
        isSubmitting={isSubmitting}
        onSubmit={async (data) => {
          setIsSubmitting(true);
          try {
            const newTask = await createTaskAction(
              application.id,
              data.title,
              data.priority,
              data.dueDate
            );
            if (newTask) {
              setTasks((prev) => [...prev, newTask]);
              setIsCreateOpen(false);
            }
          } catch (err) {
            console.error("Failed to create task:", err);
          } finally {
            setIsSubmitting(false);
          }
        }}
      />

      {/* Reused Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          isOpen={Boolean(editingTask)}
          onClose={() => setEditingTask(null)}
          task={editingTask}
          applications={applications}
          disableApplicationSelect={true}
          isSubmitting={isSubmitting}
          onSubmit={async (data) => {
            setIsSubmitting(true);
            try {
              const updated = await updateTaskAction(editingTask.id, data, application.id);
              if (updated) {
                setTasks((prev) =>
                  prev.map((t) => (t.id === updated.id ? updated : t))
                );
                setEditingTask(null);
              }
            } catch (err) {
              console.error("Failed to update task:", err);
            } finally {
              setIsSubmitting(false);
            }
          }}
        />
      )}
    </div>
  );
}
