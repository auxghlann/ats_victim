import { interviewsRepository, CreateInterviewData } from "@/lib/repositories/interviewsRepository";
import { applicationsRepository } from "@/lib/repositories/applicationsRepository";
import { Interview, EnrichedInterview } from "@/types/database";
import { getCachedData, setCachedData, invalidateCache } from "./cache";

export type CreateInterviewInput = CreateInterviewData;

export async function listInterviews(userId: string): Promise<EnrichedInterview[]> {
  if (!userId) throw new Error("User ID is required");

  const cacheKey = `interviews:${userId}`;
  const cached = getCachedData<EnrichedInterview[]>(cacheKey);
  if (cached) return cached;

  const interviews = await interviewsRepository.listInterviewsByUserId(userId);
  setCachedData(cacheKey, interviews, 15);
  return interviews;
}

export async function createInterview(userId: string, data: CreateInterviewInput): Promise<Interview> {
  if (!userId) throw new Error("User ID is required");
  if (!data.applicationId) throw new Error("Application ID is required");
  if (!data.roundName?.trim()) throw new Error("Interview round name cannot be empty");
  if (!data.scheduledAt) throw new Error("Scheduled date and time is required");

  const app = await applicationsRepository.getApplicationById(userId, data.applicationId);
  if (!app) throw new Error("Application not found or unauthorized");

  const interview = await interviewsRepository.createInterview(userId, {
    applicationId: data.applicationId,
    roundName: data.roundName.trim(),
    scheduledAt: data.scheduledAt,
    meetingLink: data.meetingLink?.trim() || null,
    notes: data.notes?.trim() || null,
  });

  invalidateCache(`interviews:${userId}`);
  invalidateCache(`dash:${userId}`);
  return interview;
}

export type UpdateInterviewInput = {
  roundName?: string;
  scheduledAt?: string;
  meetingLink?: string | null;
  notes?: string | null;
  applicationId?: string;
};

export async function updateInterview(
  userId: string,
  interviewId: string,
  updates: UpdateInterviewInput
): Promise<Interview> {
  if (!userId || !interviewId) throw new Error("User ID and Interview ID are required");
  if (updates.roundName !== undefined && !updates.roundName.trim()) {
    throw new Error("Interview round name cannot be empty");
  }

  if (updates.applicationId) {
    const app = await applicationsRepository.getApplicationById(userId, updates.applicationId);
    if (!app) throw new Error("Application not found or unauthorized");
  }

  const updated = await interviewsRepository.updateInterview(userId, interviewId, updates);
  if (!updated) throw new Error("Interview not found or failed to update");

  invalidateCache(`interviews:${userId}`);
  invalidateCache(`dash:${userId}`);
  return updated;
}

export async function deleteInterview(userId: string, interviewId: string): Promise<boolean> {
  if (!userId || !interviewId) throw new Error("User ID and Interview ID are required");
  const deleted = await interviewsRepository.deleteInterview(userId, interviewId);
  if (!deleted) throw new Error("Interview not found or already deleted");

  invalidateCache(`interviews:${userId}`);
  invalidateCache(`dash:${userId}`);
  return true;
}

export const interviewsService = {
  listInterviews,
  createInterview,
  updateInterview,
  deleteInterview,
};
