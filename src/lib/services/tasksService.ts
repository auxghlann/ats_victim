import { tasksRepository } from "@/lib/repositories/tasksRepository";
import { Task, EnrichedTask, TaskPriority } from "@/types/database";

export async function getApplicationTasks(userId: string, applicationId: string): Promise<Task[]> {
  if (!userId || !applicationId) throw new Error("User ID and Application ID are required");
  return tasksRepository.getTasksByApplicationId(userId, applicationId);
}

export async function getAllUserTasks(userId: string): Promise<EnrichedTask[]> {
  if (!userId) throw new Error("User ID is required");
  return tasksRepository.getAllTasksByUserId(userId);
}

export async function toggleTask(userId: string, taskId: string, completed: boolean): Promise<Task> {
  if (!userId || !taskId) throw new Error("User ID and Task ID are required");
  const updated = tasksRepository.toggleTask(userId, taskId, completed);
  if (!updated) throw new Error("Task not found or failed to update");
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

  return tasksRepository.createTask(userId, {
    applicationId: applicationId || null,
    title: trimmedTitle,
    priority,
    dueDate: dueDate || null,
  });
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
  const updated = tasksRepository.updateTask(userId, taskId, updates);
  if (!updated) throw new Error("Task not found or failed to update");
  return updated;
}

export async function deleteTask(userId: string, taskId: string): Promise<boolean> {
  if (!userId || !taskId) throw new Error("User ID and Task ID are required");
  const deleted = tasksRepository.deleteTask(userId, taskId);
  if (!deleted) throw new Error("Task not found or already deleted");
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
