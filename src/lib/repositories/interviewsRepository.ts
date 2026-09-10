import { getSupabase } from "@/lib/db/supabase";
import { Interview, EnrichedInterview } from "@/types/database";

export interface CreateInterviewData {
  applicationId: string;
  roundName: string;
  scheduledAt: string;
  meetingLink?: string | null;
  notes?: string | null;
}

export async function listInterviewsByUserId(userId: string): Promise<EnrichedInterview[]> {
  const { data, error } = await getSupabase()
    .from("interviews")
    .select("*, applications(company_name, job_title, status)")
    .eq("user_id", userId)
    .order("scheduled_at", { ascending: true });

  if (error) {
    console.error("Supabase listInterviewsByUserId error:", error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((i: any) => ({
    id: i.id,
    user_id: i.user_id,
    application_id: i.application_id,
    round_name: i.round_name,
    scheduled_at: i.scheduled_at,
    meeting_link: i.meeting_link || null,
    notes: i.notes || null,
    created_at: i.created_at,
    company_name: i.applications?.company_name || null,
    job_title: i.applications?.job_title || null,
    status: i.applications?.status || null,
  })) as EnrichedInterview[];
}

export async function createInterview(userId: string, data: CreateInterviewData): Promise<Interview> {
  const id = `interview-${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  const payload = {
    id,
    user_id: userId,
    application_id: data.applicationId,
    round_name: data.roundName.trim(),
    scheduled_at: data.scheduledAt,
    meeting_link: data.meetingLink?.trim() || null,
    notes: data.notes?.trim() || null,
    created_at: now,
  };

  const { data: created, error } = await getSupabase()
    .from("interviews")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    console.error("Supabase createInterview error:", error);
    throw error;
  }
  return created as Interview;
}

export interface UpdateInterviewData {
  roundName?: string;
  scheduledAt?: string;
  meetingLink?: string | null;
  notes?: string | null;
  applicationId?: string;
}

export async function updateInterview(
  userId: string,
  interviewId: string,
  data: UpdateInterviewData
): Promise<Interview | null> {
  const payload: Record<string, unknown> = {};
  if (data.roundName !== undefined) payload.round_name = data.roundName.trim();
  if (data.scheduledAt !== undefined) payload.scheduled_at = data.scheduledAt;
  if (data.meetingLink !== undefined) payload.meeting_link = data.meetingLink?.trim() || null;
  if (data.notes !== undefined) payload.notes = data.notes?.trim() || null;
  if (data.applicationId !== undefined) payload.application_id = data.applicationId;

  if (Object.keys(payload).length === 0) return null;

  const { data: updated, error } = await getSupabase()
    .from("interviews")
    .update(payload)
    .eq("user_id", userId)
    .eq("id", interviewId)
    .select("*")
    .maybeSingle();

  if (error || !updated) {
    console.error("Supabase updateInterview error:", error);
    return null;
  }
  return updated as Interview;
}

export async function deleteInterview(userId: string, interviewId: string): Promise<boolean> {
  const { error } = await getSupabase()
    .from("interviews")
    .delete()
    .eq("user_id", userId)
    .eq("id", interviewId);

  if (error) {
    console.error("Supabase deleteInterview error:", error);
    return false;
  }
  return true;
}

export const interviewsRepository = {
  listInterviewsByUserId,
  createInterview,
  updateInterview,
  deleteInterview,
};
