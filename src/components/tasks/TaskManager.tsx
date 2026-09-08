"use client";

import { useState } from "react";
import { Application, EnrichedTask, TaskPriority } from "@/types/database";
import {
  toggleTaskAction,
  createTaskAction,
  updateTaskAction,
  deleteTaskAction,
} from "@/app/actions/tasksAction";
import { TaskFilterTabs } from "./TaskFilterTabs";
import { TaskItem } from "./TaskItem";
import { GeneralTasksSidebar } from "./GeneralTasksSidebar";
import { CreateTaskModal } from "./CreateTaskModal";
import { EditTaskModal } from "./EditTaskModal";

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

  // New Task Modal State
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalAppId, setModalAppId] = useState<string>("");
  const [modalPriority, setModalPriority] = useState<TaskPriority>("medium");
  const [modalDueDate, setModalDueDate] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  // Edit Task Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<EnrichedTask | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAppId, setEditAppId] = useState<string>("");
  const [editPriority, setEditPriority] = useState<TaskPriority>("medium");
  const [editDueDate, setEditDueDate] = useState("");
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);

  // Toggle Database Task
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

  // Open Edit Modal
  const handleOpenEdit = (task: EnrichedTask) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditAppId(task.application_id || "");
    setEditPriority((task.priority as TaskPriority) || "medium");
    setEditDueDate(task.due_date || "");
    setShowEditModal(true);
  };

  // Save Edit Task
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim() || isUpdatingTask) return;

    setIsUpdatingTask(true);
    try {
      const updated = await updateTaskAction(editingTask.id, {
        title: editTitle.trim(),
        applicationId: editAppId || null,
        priority: editPriority,
        dueDate: editDueDate || null,
      });

      if (updated) {
        const matchedApp = applications.find((a) => a.id === editAppId);
        const enriched: EnrichedTask = {
          ...updated,
          company_name: matchedApp?.company_name || null,
          job_title: matchedApp?.job_title || null,
        };
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? enriched : t)));
        setShowEditModal(false);
        setEditingTask(null);
      }
    } finally {
      setIsUpdatingTask(false);
    }
  };

  // Delete Database Task
  const handleDeleteTask = async (taskId: string) => {
    const originalTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      await deleteTaskAction(taskId);
    } catch {
      setTasks(originalTasks);
    }
  };

  // Quick Add General Task
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

  // Create Task via Modal
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim() || isCreatingTask) return;

    setIsCreatingTask(true);
    try {
      const created = await createTaskAction(
        modalAppId || null,
        modalTitle.trim(),
        modalPriority,
        modalDueDate || null
      );
      if (created) {
        const matchedApp = applications.find((a) => a.id === modalAppId);
        const enriched: EnrichedTask = {
          ...created,
          company_name: matchedApp?.company_name || null,
          job_title: matchedApp?.job_title || null,
        };
        setTasks((prev) => [enriched, ...prev]);
        setShowNewTaskModal(false);
        setModalTitle("");
        setModalAppId("");
        setModalPriority("medium");
        setModalDueDate("");
      }
    } finally {
      setIsCreatingTask(false);
    }
  };

  // Filter tasks
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
      {/* Header & New Task Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
            Tasks &amp; Action Items
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Stay organized with technical screens, interview preparation, and follow-ups
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewTaskModal(true)}
          className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add</span>
          New Task
        </button>
      </div>

      {/* Main Grid: Application Tasks (2 cols) & General Tasks (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Linked Tasks */}
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
                onEdit={handleOpenEdit}
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

        {/* General Standalone Tasks Sidebar */}
        <GeneralTasksSidebar
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onEditTask={handleOpenEdit}
          onDeleteTask={handleDeleteTask}
          quickTitle={quickTitle}
          onQuickTitleChange={setQuickTitle}
          onQuickAdd={handleQuickAdd}
          isQuickAdding={isQuickAdding}
        />
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        onSubmit={handleCreateTask}
        applications={applications}
        title={modalTitle}
        onTitleChange={setModalTitle}
        applicationId={modalAppId}
        onApplicationIdChange={setModalAppId}
        priority={modalPriority}
        onPriorityChange={setModalPriority}
        dueDate={modalDueDate}
        onDueDateChange={setModalDueDate}
        isSubmitting={isCreatingTask}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTask(null);
        }}
        onSubmit={handleSaveEdit}
        applications={applications}
        title={editTitle}
        onTitleChange={setEditTitle}
        applicationId={editAppId}
        onApplicationIdChange={setEditAppId}
        priority={editPriority}
        onPriorityChange={setEditPriority}
        dueDate={editDueDate}
        onDueDateChange={setEditDueDate}
        isSubmitting={isUpdatingTask}
      />
    </div>
  );
}
