"use client";

import { useState } from "react";
import { Application, EnrichedTask } from "@/types/database";
import {
  toggleTaskAction,
  createTaskAction,
  updateTaskAction,
  deleteTaskAction,
} from "@/app/actions/tasksAction";
import { TaskFilterTabs } from "./TaskFilterTabs";
import { TaskItem } from "./TaskItem";
import { GeneralTasksSidebar } from "./GeneralTasksSidebar";
import { CreateTaskModal, CreateTaskData } from "./CreateTaskModal";
import { DeleteModal } from "@/components/common/DeleteModal";

interface TaskManagerProps {
  initialTasks: EnrichedTask[];
  applications: Application[];
}

export function TaskManager({ initialTasks, applications }: TaskManagerProps) {
  const [tasks, setTasks] = useState<EnrichedTask[]>(initialTasks);
  const [filterTab, setFilterTab] = useState<"all" | "pending" | "completed">("all");

  // Quick Add General Task
  const [quickTitle, setQuickTitle] = useState("");
  const [isQuickAdding, setIsQuickAdding] = useState(false);

  // Create / Edit Task Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<EnrichedTask | null>(null);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<EnrichedTask | null>(null);

  const handleToggleTask = async (taskId: string, currentCompleted: boolean | number) => {
    const nextCompleted = !Boolean(currentCompleted);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: nextCompleted ? 1 : 0 } : t))
    );

    try {
      await toggleTaskAction(taskId, nextCompleted);
    } catch {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: currentCompleted ? 1 : 0 } : t))
      );
    }
  };

  const handleModalSubmit = async (data: CreateTaskData) => {
    if (isSubmittingTask) return;

    setIsSubmittingTask(true);
    try {
      const matchedApp = applications.find((a) => a.id === data.applicationId);
      if (editingTask) {
        const updated = await updateTaskAction(editingTask.id, {
          title: data.title,
          applicationId: data.applicationId,
          priority: data.priority,
          dueDate: data.dueDate,
        });

        if (updated) {
          const enriched: EnrichedTask = {
            ...updated,
            company_name: matchedApp?.company_name || null,
            job_title: matchedApp?.job_title || null,
          };
          setTasks((prev) => prev.map((t) => (t.id === updated.id ? enriched : t)));
          setEditingTask(null);
        }
      } else {
        const created = await createTaskAction(
          data.applicationId,
          data.title,
          data.priority,
          data.dueDate
        );
        if (created) {
          const enriched: EnrichedTask = {
            ...created,
            company_name: matchedApp?.company_name || null,
            job_title: matchedApp?.job_title || null,
          };
          setTasks((prev) => [enriched, ...prev]);
          setShowTaskModal(false);
        }
      }
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId) || null;
    setTaskToDelete(task);
  };

  const handleConfirmDeleteTask = async () => {
    if (!taskToDelete) return;
    const taskId = taskToDelete.id;
    const originalTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      await deleteTaskAction(taskId);
    } catch {
      setTasks(originalTasks);
    }
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || isQuickAdding) return;

    setIsQuickAdding(true);
    try {
      const created = await createTaskAction(null, quickTitle.trim(), "medium", null);
      if (created) {
        setTasks((prev) => [created, ...prev]);
        setQuickTitle("");
      }
    } finally {
      setIsQuickAdding(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterTab === "pending") return !Boolean(t.completed);
    if (filterTab === "completed") return Boolean(t.completed);
    return true;
  });

  const appLinkedTasks = filteredTasks.filter((t) => t.application_id);

  const tabCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
            Tasks &amp; Action Items
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Stay organized with technical screens, interview preparation, and follow-ups
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingTask(null);
            setShowTaskModal(true);
          }}
          className="w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          New Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GeneralTasksSidebar
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onEditTask={(task) => setEditingTask(task)}
          onDeleteTask={handleDeleteTask}
          quickTitle={quickTitle}
          onQuickTitleChange={setQuickTitle}
          onQuickAdd={handleQuickAdd}
          isQuickAdding={isQuickAdding}
        />

        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-on-surface">Application Action Items</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Tasks associated with specific applications
              </p>
            </div>
            <TaskFilterTabs
              currentTab={filterTab}
              onTabChange={setFilterTab}
              counts={tabCounts}
            />
          </div>

          <div className="space-y-3">
            {appLinkedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onEdit={(target) => setEditingTask(target)}
                onDelete={handleDeleteTask}
              />
            ))}

            {appLinkedTasks.length === 0 && (
              <div className="p-8 rounded-2xl bg-surface border border-outline-variant/30 text-center">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant/40 mb-2">
                  task_alt
                </span>
                <p className="text-xs font-bold text-on-surface">No application tasks</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  {filterTab === "all"
                    ? "Create tasks linked to companies from the tracker or using 'New Task'."
                    : `No ${filterTab} tasks found in this view.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateTaskModal
        isOpen={showTaskModal || Boolean(editingTask)}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSubmit={handleModalSubmit}
        applications={applications}
        isSubmitting={isSubmittingTask}
      />

      <DeleteModal
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDeleteTask}
        title="Delete Task"
        itemName={taskToDelete?.title}
      />
    </div>
  );
}
