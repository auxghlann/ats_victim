import { getDatabase } from "@/lib/db";
import { Task, EnrichedTask, TaskPriority } from "@/types/database";

export interface CreateTaskData {
  applicationId?: string | null;
  title: string;
  priority?: TaskPriority;
  dueDate?: string | null;
}

export function getTasksByApplicationId(userId: string, applicationId: string): Task[] {
  const sql = `SELECT * FROM tasks WHERE user_id = ? AND application_id = ? ORDER BY created_at ASC`;
  return getDatabase().prepare(sql).all(userId, applicationId) as Task[];
}

export function getAllTasksByUserId(userId: string): EnrichedTask[] {
  const sql = `
    SELECT t.*, a.company_name, a.job_title 
    FROM tasks t
    LEFT JOIN applications a ON t.application_id = a.id
    WHERE t.user_id = ?
    ORDER BY t.completed ASC, t.created_at DESC
  `;
  return getDatabase().prepare(sql).all(userId) as EnrichedTask[];
}

export function getPendingTasksCount(userId: string): number {
  const sql = `SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND completed = 0`;
  const row = getDatabase().prepare(sql).get(userId) as { count: number } | undefined;
  return row ? row.count : 0;
}

export function createTask(userId: string, data: CreateTaskData): Task {
  const id = `task-${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const priority = data.priority || "medium";
  const sql = `
    INSERT INTO tasks (id, user_id, application_id, title, due_date, completed, priority, created_at)
    VALUES (?, ?, ?, ?, ?, 0, ?, ?)
    RETURNING *
  `;
  return getDatabase().prepare(sql).get(
    id,
    userId,
    data.applicationId || null,
    data.title.trim(),
    data.dueDate || null,
    priority,
    now
  ) as Task;
}

export function toggleTask(userId: string, taskId: string, completed: boolean): Task | null {
  const sql = `UPDATE tasks SET completed = ? WHERE user_id = ? AND id = ? RETURNING *`;
  return (getDatabase().prepare(sql).get(completed ? 1 : 0, userId, taskId) as Task) || null;
}

export interface UpdateTaskData {
  title?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
  applicationId?: string | null;
}

export function updateTask(userId: string, taskId: string, data: UpdateTaskData): Task | null {
  const fields: string[] = [];
  const params: unknown[] = [];

  if (data.title !== undefined) {
    fields.push("title = ?");
    params.push(data.title.trim());
  }
  if (data.priority !== undefined) {
    fields.push("priority = ?");
    params.push(data.priority);
  }
  if (data.dueDate !== undefined) {
    fields.push("due_date = ?");
    params.push(data.dueDate || null);
  }
  if (data.applicationId !== undefined) {
    fields.push("application_id = ?");
    params.push(data.applicationId || null);
  }

  if (fields.length === 0) return null;

  params.push(userId, taskId);
  const sql = `UPDATE tasks SET ${fields.join(", ")} WHERE user_id = ? AND id = ? RETURNING *`;
  return (getDatabase().prepare(sql).get(...params) as Task) || null;
}

export function deleteTask(userId: string, taskId: string): boolean {
  const sql = `DELETE FROM tasks WHERE user_id = ? AND id = ?`;
  const result = getDatabase().prepare(sql).run(userId, taskId);
  return result.changes > 0;
}

export const tasksRepository = {
  getTasksByApplicationId,
  getAllTasksByUserId,
  getPendingTasksCount,
  createTask,
  toggleTask,
  updateTask,
  deleteTask,
};
