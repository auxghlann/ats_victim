import { applicationDetailsRepository } from "@/lib/repositories/applicationDetailsRepository";
import { applicationsRepository } from "@/lib/repositories/applicationsRepository";
import { ApplicationDetail, NoteItem, TimelineEvent } from "@/types/database";

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
  const notesList: NoteItem[] = detail?.notes ? [...detail.notes] : [];

  const newNote: NoteItem = {
    id: `note-${Date.now()}`,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    content: trimmed,
  };

  notesList.unshift(newNote);
  return await applicationDetailsRepository.upsertApplicationDetails(applicationId, {
    notes: notesList,
  });
}

export async function updateNote(
  userId: string,
  applicationId: string,
  noteId: string,
  content: string
): Promise<ApplicationDetail> {
  if (!userId || !applicationId) throw new Error("User ID and Application ID are required");
  const trimmed = content?.trim();
  if (!trimmed) throw new Error("Note content cannot be empty");

  const app = await applicationsRepository.getApplicationById(userId, applicationId);
  if (!app) throw new Error("Application not found or unauthorized");

  const detail = await applicationDetailsRepository.getApplicationDetails(applicationId);
  const notesList: NoteItem[] = detail?.notes ? [...detail.notes] : [];

  const targetIndex = notesList.findIndex((n) => n.id === noteId);
  if (targetIndex === -1) throw new Error("Note not found");

  notesList[targetIndex] = {
    ...notesList[targetIndex],
    content: trimmed,
    date: `${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} (edited)`,
  };

  return await applicationDetailsRepository.upsertApplicationDetails(applicationId, {
    notes: notesList,
  });
}

export async function deleteNote(
  userId: string,
  applicationId: string,
  noteId: string
): Promise<ApplicationDetail> {
  if (!userId || !applicationId) throw new Error("User ID and Application ID are required");

  const app = await applicationsRepository.getApplicationById(userId, applicationId);
  if (!app) throw new Error("Application not found or unauthorized");

  const detail = await applicationDetailsRepository.getApplicationDetails(applicationId);
  const notesList = (detail?.notes || []).filter((n) => n.id !== noteId);

  return await applicationDetailsRepository.upsertApplicationDetails(applicationId, {
    notes: notesList,
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
  updateNote,
  deleteNote,
  updateJobDescription,
  appendTimelineEvent,
};
