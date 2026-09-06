import { applicationsRepository, ListApplicationsOptions } from "@/lib/repositories/applicationsRepository";
import { applicationDetailsRepository } from "@/lib/repositories/applicationDetailsRepository";
import { getDatabase } from "@/lib/db";
import { Application, ApplicationDetail, ApplicationStatus, WorkSetup } from "@/types/database";

export interface CreateApplicationInput {
  company_name: string;
  job_title: string;
  status?: ApplicationStatus;
  location?: string;
  work_setup?: WorkSetup;
  salary_min?: number;
  salary_max?: number;
  posting_url?: string;
  job_description?: string;
  notes?: string;
}


export async function listApplications(
  userId: string,
  options: ListApplicationsOptions = {}
): Promise<{ items: Application[]; total: number; counts: Record<string, number> }> {
  if (!userId) throw new Error("User ID is required");

  const result = applicationsRepository.listApplications(userId, options);
  const counts = applicationsRepository.getStatusCounts(userId);

  return { ...result, counts };
}

export async function getApplicationDetail(
  userId: string,
  applicationId: string
): Promise<{ application: Application; detail: ApplicationDetail | null } | null> {
  if (!userId || !applicationId) throw new Error("User ID and Application ID are required");

  const application = applicationsRepository.getApplicationById(userId, applicationId);
  if (!application) return null;

  const detail = applicationDetailsRepository.getApplicationDetails(applicationId);
  return { application, detail };
}

export async function createApplication(
  userId: string,
  input: CreateApplicationInput
): Promise<Application> {
  if (!userId) throw new Error("User ID is required");

  const companyName = input.company_name?.trim();
  const jobTitle = input.job_title?.trim();

  if (!companyName) throw new Error("Company name cannot be empty");
  if (!jobTitle) throw new Error("Job title cannot be empty");

  const application = applicationsRepository.createApplication(userId, {
    company_name: companyName,
    job_title: jobTitle,
    status: input.status || "applied",
    location: input.location?.trim() || null,
    work_setup: input.work_setup || null,
    salary_min: input.salary_min ?? null,
    salary_max: input.salary_max ?? null,
  });

  const today = new Date().toISOString().split("T")[0];
  applicationDetailsRepository.upsertApplicationDetails(application.id, {
    posting_url: input.posting_url?.trim() || null,
    job_description: input.job_description?.trim() || null,
    notes: input.notes?.trim() || null,
    timeline: [
      {
        status: application.status,
        date: today,
        snippet: `Application for ${application.job_title} at ${application.company_name} created manually.`,
      },
    ],
  });

  return application;
}

export async function updateStatus(
  userId: string,
  applicationId: string,
  newStatus: ApplicationStatus
): Promise<Application> {
  if (!userId || !applicationId) throw new Error("User ID and Application ID are required");

  const existing = applicationsRepository.getApplicationById(userId, applicationId);
  if (!existing) throw new Error("Application not found");
  if (existing.status === newStatus) return existing;

  const today = new Date().toISOString().split("T")[0];
  const updated = applicationsRepository.updateApplication(userId, applicationId, {
    status: newStatus,
    last_activity_date: today,
  });

  if (!updated) throw new Error("Failed to update application status");

  applicationDetailsRepository.appendTimelineEvent(applicationId, {
    status: newStatus,
    date: today,
    snippet: `Status moved from ${existing.status} to ${newStatus}.`,
  });

  return updated;
}

export async function deleteApplication(userId: string, applicationId: string): Promise<boolean> {
  if (!userId || !applicationId) throw new Error("User ID and Application ID are required");

  const deleted = applicationsRepository.deleteApplication(userId, applicationId);
  if (!deleted) throw new Error("Application not found or already deleted");
  return true;
}

export async function getDashboardMetrics(userId: string) {
  if (!userId) throw new Error("User ID is required");

  const counts = applicationsRepository.getStatusCounts(userId);
  const recent = applicationsRepository.listApplications(userId, {
    pageSize: 5,
    sortBy: "last_activity_date",
    sortOrder: "desc",
  });

  return {
    counts,
    recentApplications: recent.items,
  };
}

export async function getApplicationTasks(userId: string, applicationId: string) {
  if (!userId || !applicationId) throw new Error("User ID and Application ID are required");
  const sql = `SELECT * FROM tasks WHERE user_id = ? AND application_id = ? ORDER BY created_at ASC`;
  return getDatabase().prepare(sql).all(userId, applicationId);
}

export async function toggleTask(userId: string, taskId: string, completed: boolean) {
  if (!userId || !taskId) throw new Error("User ID and Task ID are required");
  const sql = `UPDATE tasks SET completed = ? WHERE user_id = ? AND id = ? RETURNING *`;
  return getDatabase().prepare(sql).get(completed ? 1 : 0, userId, taskId);
}

export async function createTask(userId: string, applicationId: string, title: string) {
  if (!userId || !applicationId || !title.trim()) throw new Error("Missing task requirements");
  const id = `task-${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const sql = `
    INSERT INTO tasks (id, user_id, application_id, title, completed, priority, created_at)
    VALUES (?, ?, ?, ?, 0, 'medium', ?)
    RETURNING *
  `;
  return getDatabase().prepare(sql).get(id, userId, applicationId, title.trim(), now);
}

export async function addNote(userId: string, applicationId: string, content: string) {
  if (!userId || !applicationId || !content.trim()) throw new Error("Missing note parameters");
  const detail = applicationDetailsRepository.getApplicationDetails(applicationId);

  let notesList: { id: string; date: string; content: string }[] = [];
  if (detail?.notes) {
    try {
      const parsed = JSON.parse(detail.notes);
      notesList = Array.isArray(parsed) ? parsed : [{ id: "note-1", date: "Initial Note", content: detail.notes }];
    } catch {
      notesList = [{ id: "note-1", date: "Initial Note", content: detail.notes }];
    }
  }

  const newNote = {
    id: `note-${Date.now()}`,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    content: content.trim(),
  };

  notesList.unshift(newNote);
  return applicationDetailsRepository.upsertApplicationDetails(applicationId, {
    notes: JSON.stringify(notesList),
  });
}

export async function updateApplication(
  userId: string,
  applicationId: string,
  updates: Partial<Application>
): Promise<Application> {
  if (!userId || !applicationId) throw new Error("User ID and Application ID are required");
  const updated = applicationsRepository.updateApplication(userId, applicationId, updates);
  if (!updated) throw new Error("Application not found or failed to update");
  return updated;
}

export async function updateJobDescription(
  userId: string,
  applicationId: string,
  description: string
) {
  if (!userId || !applicationId) throw new Error("User ID and Application ID are required");
  return applicationDetailsRepository.upsertApplicationDetails(applicationId, {
    job_description: description,
  });
}

export const applicationsService = {
  listApplications,
  getApplicationDetail,
  createApplication,
  updateApplication,
  updateStatus,
  updateJobDescription,
  deleteApplication,
  getDashboardMetrics,
  getApplicationTasks,
  toggleTask,
  createTask,
  addNote,
};

