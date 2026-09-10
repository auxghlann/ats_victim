import { getSupabase } from "@/lib/db/supabase";
import { Task, EnrichedTask, TaskPriority } from "@/types/database";

export interface CreateTaskData {
  applicationId?: string | null;
  title: string;
  priority?: TaskPriority;
  dueDate?: string | null;
}

export async function getTasksByApplicationId(userId: string, applicationId: string): Promise<Task[]> {
  const { data, error } = await getSupabase()
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .eq("application_id", applicationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Supabase getTasksByApplicationId error:", error);
    return [];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((t: any) => ({
    ...t,
    completed: Boolean(t.completed) ? 1 : 0,
  })) as Task[];
}

export async function getAllTasksByUserId(userId: string): Promise<EnrichedTask[]> {
  const { data, error } = await getSupabase()
    .from("tasks")
    .select("*, applications(company_name, job_title)")
    .eq("user_id", userId)
    .order("completed", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase getAllTasksByUserId error:", error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((t: any) => ({
    id: t.id,
    user_id: t.user_id,
    application_id: t.application_id,
    title: t.title,
    due_date: t.due_date,
    completed: Boolean(t.completed) ? 1 : 0,
    priority: t.priority,
    created_at: t.created_at,
    company_name: t.applications?.company_name || null,
    job_title: t.applications?.job_title || null,
  })) as EnrichedTask[];
}

export async function getPendingTasksCount(userId: string): Promise<number> {
  const { count, error } = await getSupabase()
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .or("completed.eq.false,completed.eq.0");

  if (error) {
    console.error("Supabase getPendingTasksCount error:", error);
    return 0;
  }
  return count || 0;
}

export async function createTask(userId: string, data: CreateTaskData): Promise<Task> {
  const id = `task-${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const priority = data.priority || "medium";

  const payload = {
    id,
    user_id: userId,
    application_id: data.applicationId || null,
    title: data.title.trim(),
    due_date: data.dueDate || null,
    completed: false,
    priority,
    created_at: now,
  };

  const { data: created, error } = await getSupabase()
    .from("tasks")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    console.error("Supabase createTask error:", error);
    throw error;
  }

  return {
    ...created,
    completed: Boolean(created.completed) ? 1 : 0,
  } as Task;
}

export async function toggleTask(userId: string, taskId: string, completed: boolean): Promise<Task | null> {
  const { data, error } = await getSupabase()
    .from("tasks")
    .update({ completed })
    .eq("user_id", userId)
    .eq("id", taskId)
    .select("*")
    .maybeSingle();

  if (error || !data) {
    console.error("Supabase toggleTask error:", error);
    return null;
  }

  return {
    ...data,
    completed: Boolean(data.completed) ? 1 : 0,
  } as Task;
}

export interface UpdateTaskData {
  title?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
  applicationId?: string | null;
}

export async function updateTask(userId: string, taskId: string, data: UpdateTaskData): Promise<Task | null> {
  const payload: Record<string, unknown> = {};
  if (data.title !== undefined) payload.title = data.title.trim();
  if (data.priority !== undefined) payload.priority = data.priority;
  if (data.dueDate !== undefined) payload.due_date = data.dueDate || null;
  if (data.applicationId !== undefined) payload.application_id = data.applicationId || null;

  if (Object.keys(payload).length === 0) return null;

  const { data: updated, error } = await getSupabase()
    .from("tasks")
    .update(payload)
    .eq("user_id", userId)
    .eq("id", taskId)
    .select("*")
    .maybeSingle();

  if (error || !updated) {
    console.error("Supabase updateTask error:", error);
    return null;
  }

  return {
    ...updated,
    completed: Boolean(updated.completed) ? 1 : 0,
  } as Task;
}

export async function deleteTask(userId: string, taskId: string): Promise<boolean> {
  const { error } = await getSupabase()
    .from("tasks")
    .delete()
    .eq("user_id", userId)
    .eq("id", taskId);

  if (error) {
    console.error("Supabase deleteTask error:", error);
    return false;
  }
  return true;
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
