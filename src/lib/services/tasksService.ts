import { tasksRepository } from "@/lib/repositories/tasksRepository";
import { applicationsRepository } from "@/lib/repositories/applicationsRepository";
import { Task, EnrichedTask, TaskPriority } from "@/types/database";
import { getCachedData, setCachedData, invalidateCache } from "./cache";

export async function getApplicationTasks(userId: string, applicationId: string): Promise<Task[]> {
  if (!userId || !applicationId) throw new Error("User ID and Application ID are required");
  return await tasksRepository.getTasksByApplicationId(userId, applicationId);
}

export async function getAllUserTasks(userId: string): Promise<EnrichedTask[]> {
  if (!userId) throw new Error("User ID is required");

  const cacheKey = `tasks:${userId}`;
  const cached = getCachedData<EnrichedTask[]>(cacheKey);
  if (cached) return cached;

  const tasks = await tasksRepository.getAllTasksByUserId(userId);
  setCachedData(cacheKey, tasks, 15);
  return tasks;
}

export async function toggleTask(userId: string, taskId: string, completed: boolean): Promise<Task> {
  if (!userId || !taskId) throw new Error("User ID and Task ID are required");
  const updated = await tasksRepository.toggleTask(userId, taskId, completed);
  if (!updated) throw new Error("Task not found or failed to update");

  invalidateCache(`tasks:${userId}`);
  invalidateCache(`dash:${userId}`);
  return updated;
}

export async function createTask(
  userId: string,
  applicationId: string | null,
  title: string,
  priority: TaskPriority = "medium",
  dueDate: string | null = null
): Promise<Task> {
  if (!userId) throw new Error("User ID is required");
  const trimmedTitle = title?.trim();
  if (!trimmedTitle) throw new Error("Task title cannot be empty");

  if (applicationId) {
    const app = await applicationsRepository.getApplicationById(userId, applicationId);
    if (!app) throw new Error("Application not found or unauthorized");
  }

  const task = await tasksRepository.createTask(userId, {
    applicationId: applicationId || null,
    title: trimmedTitle,
    priority,
    dueDate: dueDate || null,
  });

  invalidateCache(`tasks:${userId}`);
  invalidateCache(`dash:${userId}`);
  return task;
}

export interface UpdateTaskInput {
  title?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
  applicationId?: string | null;
}

export async function updateTask(
  userId: string,
  taskId: string,
  updates: UpdateTaskInput
): Promise<Task> {
  if (!userId || !taskId) throw new Error("User ID and Task ID are required");

  if (updates.applicationId) {
    const app = await applicationsRepository.getApplicationById(userId, updates.applicationId);
    if (!app) throw new Error("Application not found or unauthorized");
  }

  const updated = await tasksRepository.updateTask(userId, taskId, updates);
  if (!updated) throw new Error("Task not found or failed to update");

  invalidateCache(`tasks:${userId}`);
  invalidateCache(`dash:${userId}`);
  return updated;
}

export async function deleteTask(userId: string, taskId: string): Promise<boolean> {
  if (!userId || !taskId) throw new Error("User ID and Task ID are required");
  const deleted = await tasksRepository.deleteTask(userId, taskId);
  if (!deleted) throw new Error("Task not found or already deleted");

  invalidateCache(`tasks:${userId}`);
  invalidateCache(`dash:${userId}`);
  return true;
}

export const tasksService = {
  getApplicationTasks,
  getAllUserTasks,
  toggleTask,
  createTask,
  updateTask,
  deleteTask,
};
