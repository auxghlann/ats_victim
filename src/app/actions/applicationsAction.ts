"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { applicationsService, CreateApplicationInput } from "@/lib/services/applicationsService";
import { applicationDetailsRepository } from "@/lib/repositories/applicationDetailsRepository";
import { ListApplicationsOptions } from "@/lib/repositories/applicationsRepository";
import { ApplicationStatus, Application } from "@/types/database";

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
  revalidatePath(`/tracker/${applicationId}`);
  revalidatePath("/");
  return updated;
}

export async function getApplicationDetailAction(applicationId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  return applicationsService.getApplicationDetail(user.id, applicationId);
}

export async function updateApplicationAction(
  applicationId: string,
  updates: Partial<Application> & { posting_url?: string | null }
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const { posting_url, ...appUpdates } = updates;
  const updated = await applicationsService.updateApplication(user.id, applicationId, appUpdates);

  if (posting_url !== undefined) {
    await applicationDetailsRepository.upsertApplicationDetails(applicationId, {
      posting_url: posting_url?.trim() || null,
    });
  }

  revalidatePath("/tracker");
  revalidatePath(`/tracker/${applicationId}`);
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
