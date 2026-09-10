import { applicationDetailsRepository } from "@/lib/repositories/applicationDetailsRepository";
import { applicationsRepository } from "@/lib/repositories/applicationsRepository";
import { ApplicationDetail, TimelineEvent } from "@/types/database";

export async function getApplicationDetails(applicationId: string): Promise<ApplicationDetail | null> {
  if (!applicationId) throw new Error("Application ID is required");
  return await applicationDetailsRepository.getApplicationDetails(applicationId);
}

export async function addNote(
  userId: string,
  applicationId: string,
  content: string
): Promise<ApplicationDetail> {
  if (!userId || !applicationId) throw new Error("User ID and Application ID are required");
  const trimmed = content?.trim();
  if (!trimmed) throw new Error("Note content cannot be empty");

  const app = await applicationsRepository.getApplicationById(userId, applicationId);
  if (!app) throw new Error("Application not found or unauthorized");

  const detail = await applicationDetailsRepository.getApplicationDetails(applicationId);

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
    content: trimmed,
  };

  notesList.unshift(newNote);
  return await applicationDetailsRepository.upsertApplicationDetails(applicationId, {
    notes: JSON.stringify(notesList),
  });
}

export async function updateJobDescription(
  userId: string,
  applicationId: string,
  description: string
): Promise<ApplicationDetail> {
  if (!userId || !applicationId) throw new Error("User ID and Application ID are required");

  const app = await applicationsRepository.getApplicationById(userId, applicationId);
  if (!app) throw new Error("Application not found or unauthorized");

  return await applicationDetailsRepository.upsertApplicationDetails(applicationId, {
    job_description: description,
  });
}

export async function appendTimelineEvent(
  applicationId: string,
  event: TimelineEvent
): Promise<ApplicationDetail> {
  if (!applicationId) throw new Error("Application ID is required");
  return await applicationDetailsRepository.appendTimelineEvent(applicationId, event);
}

export const applicationDetailsService = {
  getApplicationDetails,
  addNote,
  updateJobDescription,
  appendTimelineEvent,
};
