"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { tasksService } from "@/lib/services/tasksService";
import { TaskPriority } from "@/types/database";

export async function toggleTaskAction(taskId: string, completed: boolean, applicationId?: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const updated = await tasksService.toggleTask(user.id, taskId, completed);
  if (applicationId) {
    revalidatePath(`/tracker/${applicationId}`);
  }
  revalidatePath("/tracker");
  revalidatePath("/tasks");
  revalidatePath("/");
  return updated;
}

export async function createTaskAction(
  applicationId: string | null,
  title: string,
  priority: TaskPriority = "medium",
  dueDate: string | null = null
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const task = await tasksService.createTask(user.id, applicationId, title, priority, dueDate);
  if (applicationId) {
    revalidatePath(`/tracker/${applicationId}`);
  }
  revalidatePath("/tasks");
  revalidatePath("/tracker");
  revalidatePath("/");
  return task;
}

export interface UpdateTaskActionInput {
  title?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
  applicationId?: string | null;
}

export async function updateTaskAction(
  taskId: string,
  updates: UpdateTaskActionInput,
  applicationId?: string
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const task = await tasksService.updateTask(user.id, taskId, updates);
  if (applicationId || task.application_id) {
    revalidatePath(`/tracker/${applicationId || task.application_id}`);
  }
  revalidatePath("/tasks");
  revalidatePath("/tracker");
  revalidatePath("/");
  return task;
}

export async function deleteTaskAction(taskId: string, applicationId?: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const success = await tasksService.deleteTask(user.id, taskId);
  if (applicationId) {
    revalidatePath(`/tracker/${applicationId}`);
  }
  revalidatePath("/tasks");
  revalidatePath("/tracker");
  revalidatePath("/");
  return success;
}
