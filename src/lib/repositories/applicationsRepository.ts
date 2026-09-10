import { getSupabase } from "@/lib/db/supabase";
import { Application, ApplicationStatus, WorkSetup } from "@/types/database";

export type ApplicationSortColumn =
  | "company_name"
  | "job_title"
  | "status"
  | "location"
  | "salary_min"
  | "last_activity_date"
  | "date_applied";

export interface ListApplicationsOptions {
  search?: string;
  status?: string;
  workSetup?: string;
  sortBy?: ApplicationSortColumn;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export async function listApplications(
  userId: string,
  options: ListApplicationsOptions = {}
): Promise<{ items: Application[]; total: number }> {
  const {
    search,
    status,
    workSetup,
    sortBy = "last_activity_date",
    sortOrder = "desc",
    page = 1,
    pageSize = 10,
  } = options;

  let query = getSupabase()
    .from("applications")
    .select("*", { count: "exact" })
    .eq("user_id", userId);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (workSetup && workSetup !== "all") {
    query = query.eq("work_setup", workSetup);
  }

  if (search && search.trim() !== "") {
    const term = search.trim();
    query = query.or(`company_name.ilike.%${term}%,job_title.ilike.%${term}%,location.ilike.%${term}%`);
  }

  const sortAsc = sortOrder.toLowerCase() === "asc";
  const sortField = sortBy === "company_name" || sortBy === "job_title" || sortBy === "location"
    ? sortBy
    : sortBy || "last_activity_date";

  query = query.order(sortField, { ascending: sortAsc });

  const offset = (page - 1) * pageSize;
  query = query.range(offset, offset + pageSize - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error("Supabase listApplications error:", error);
    return { items: [], total: 0 };
  }

  return {
    items: (data as Application[]) || [],
    total: count || 0,
  };
}

export async function getApplicationById(userId: string, id: string): Promise<Application | null> {
  const { data, error } = await getSupabase()
    .from("applications")
    .select("*")
    .eq("user_id", userId)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase getApplicationById error:", error);
    return null;
  }
  return (data as Application) || null;
}

export async function createApplication(
  userId: string,
  data: {
    company_name: string;
    job_title: string;
    status?: ApplicationStatus;
    location?: string | null;
    work_setup?: WorkSetup | null;
    salary_min?: number | null;
    salary_max?: number | null;
    salary_currency?: string;
    date_applied?: string | null;
  }
): Promise<Application> {
  const id = `app-${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const dateApplied = data.date_applied || now.split("T")[0];
  const status = data.status || "applied";

  const payload = {
    id,
    user_id: userId,
    company_name: data.company_name,
    job_title: data.job_title,
    status,
    location: data.location || null,
    work_setup: data.work_setup || null,
    salary_min: data.salary_min ?? null,
    salary_max: data.salary_max ?? null,
    salary_currency: data.salary_currency || "USD",
    date_applied: dateApplied,
    last_activity_date: dateApplied,
    created_at: now,
    updated_at: now,
  };

  const { data: created, error } = await getSupabase()
    .from("applications")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    console.error("Supabase createApplication error:", error);
    throw error;
  }
  return created as Application;
}

export async function updateApplication(
  userId: string,
  id: string,
  updates: Partial<Application>
): Promise<Application | null> {
  const now = new Date().toISOString();
  const payload = { ...updates, updated_at: now };

  const { data: updated, error } = await getSupabase()
    .from("applications")
    .update(payload)
    .eq("user_id", userId)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Supabase updateApplication error:", error);
    return null;
  }
  return (updated as Application) || null;
}

export async function deleteApplication(userId: string, id: string): Promise<boolean> {
  const { error } = await getSupabase()
    .from("applications")
    .delete()
    .eq("user_id", userId)
    .eq("id", id);

  if (error) {
    console.error("Supabase deleteApplication error:", error);
    return false;
  }
  return true;
}

export async function getStatusCounts(userId: string): Promise<Record<string, number>> {
  const counts: Record<string, number> = {
    all: 0,
    applied: 0,
    viewed: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
  };

  const { data, error } = await getSupabase()
    .from("applications")
    .select("status")
    .eq("user_id", userId);

  if (error) {
    console.error("Supabase getStatusCounts error:", error);
    return counts;
  }

  if (data) {
    for (const row of data as { status: string }[]) {
      counts[row.status] = (counts[row.status] || 0) + 1;
      counts.all++;
    }
  }
  return counts;
}

export async function getActivityCountByDate(userId: string, dateStr: string): Promise<number> {
  const { count, error } = await getSupabase()
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .or(`date_applied.eq.${dateStr},last_activity_date.eq.${dateStr}`);

  if (error) {
    console.error("Supabase getActivityCountByDate error:", error);
    return 0;
  }
  return count || 0;
}

export async function getWeeklyActivityDates(
  userId: string,
  fromDateStr: string
): Promise<{ date_applied: string | null; last_activity_date: string | null }[]> {
  const { data, error } = await getSupabase()
    .from("applications")
    .select("date_applied, last_activity_date")
    .eq("user_id", userId)
    .or(`date_applied.gte.${fromDateStr},last_activity_date.gte.${fromDateStr}`);

  if (error) {
    console.error("Supabase getWeeklyActivityDates error:", error);
    return [];
  }
  return (data || []) as { date_applied: string | null; last_activity_date: string | null }[];
}

export const applicationsRepository = {
  listApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getStatusCounts,
  getActivityCountByDate,
  getWeeklyActivityDates,
};
