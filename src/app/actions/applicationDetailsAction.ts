"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { applicationDetailsService } from "@/lib/services/applicationDetailsService";

export async function addNoteAction(applicationId: string, content: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const detail = await applicationDetailsService.addNote(user.id, applicationId, content);
  revalidatePath(`/tracker/${applicationId}`);
  return detail;
}

export async function updateJobDescriptionAction(
  applicationId: string,
  description: string
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const detail = await applicationDetailsService.updateJobDescription(user.id, applicationId, description);
  revalidatePath(`/tracker/${applicationId}`);
  return detail;
}
