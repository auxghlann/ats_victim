"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { applicationsService, CreateApplicationInput } from "@/lib/services/applicationsService";
import { ListApplicationsOptions } from "@/lib/repositories/applicationsRepository";
import { ApplicationStatus } from "@/types/database";

export async function fetchApplicationsAction(options: ListApplicationsOptions = {}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  return applicationsService.listApplications(user.id, options);
}

export async function createApplicationAction(formData: CreateApplicationInput) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const app = await applicationsService.createApplication(user.id, formData);

  revalidatePath("/tracker");
  revalidatePath("/");
  return app;
}

export async function updateApplicationStatusAction(
  applicationId: string,
  newStatus: ApplicationStatus
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const updated = await applicationsService.updateStatus(user.id, applicationId, newStatus);

  revalidatePath("/tracker");
  revalidatePath("/");
  return updated;
}

export async function deleteApplicationAction(applicationId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const success = await applicationsService.deleteApplication(user.id, applicationId);

  revalidatePath("/tracker");
  revalidatePath("/");
  return success;
}


export async function toggleTaskAction(taskId: string, completed: boolean, applicationId?: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const updated = await applicationsService.toggleTask(user.id, taskId, completed);
  if (applicationId) {
    revalidatePath(`/tracker/${applicationId}`);
  }
  revalidatePath("/tracker");
  return updated;
}

export async function createTaskAction(applicationId: string, title: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const task = await applicationsService.createTask(user.id, applicationId, title);
  revalidatePath(`/tracker/${applicationId}`);
  return task;
}

export async function addNoteAction(applicationId: string, content: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const detail = await applicationsService.addNote(user.id, applicationId, content);
  revalidatePath(`/tracker/${applicationId}`);
  return detail;
}

export async function updateApplicationAction(
  applicationId: string,
  updates: Partial<import("@/types/database").Application>
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const updated = await applicationsService.updateApplication(user.id, applicationId, updates);
  revalidatePath("/tracker");
  revalidatePath(`/tracker/${applicationId}`);
  revalidatePath("/");
  return updated;
}

export async function updateJobDescriptionAction(
  applicationId: string,
  description: string
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const detail = await applicationsService.updateJobDescription(user.id, applicationId, description);
  revalidatePath(`/tracker/${applicationId}`);
  return detail;
}

