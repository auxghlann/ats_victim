"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import {
  interviewsService,
  CreateInterviewInput,
  UpdateInterviewInput,
} from "@/lib/services/interviewsService";

export async function createInterviewAction(data: CreateInterviewInput) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const interview = await interviewsService.createInterview(user.id, data);
  revalidatePath("/interviews");
  if (data.applicationId) {
    revalidatePath(`/tracker/${data.applicationId}`);
  }
  revalidatePath("/");
  return interview;
}

export async function updateInterviewAction(
  interviewId: string,
  updates: UpdateInterviewInput
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const interview = await interviewsService.updateInterview(user.id, interviewId, updates);
  revalidatePath("/interviews");
  if (interview.application_id) {
    revalidatePath(`/tracker/${interview.application_id}`);
  }
  revalidatePath("/");
  return interview;
}

export async function deleteInterviewAction(interviewId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const success = await interviewsService.deleteInterview(user.id, interviewId);
  revalidatePath("/interviews");
  revalidatePath("/");
  return success;
}
