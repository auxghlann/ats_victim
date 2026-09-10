import { getSupabase } from "@/lib/db/supabase";
import { ApplicationDetail, TimelineEvent } from "@/types/database";

export async function getApplicationDetails(applicationId: string): Promise<ApplicationDetail | null> {
  const { data, error } = await getSupabase()
    .from("application_details")
    .select("*")
    .eq("application_id", applicationId)
    .maybeSingle();

  if (error) {
    console.error("Supabase getApplicationDetails error:", error);
    return null;
  }
  if (!data) return null;

  return {
    ...data,
    timeline: typeof data.timeline === "string" ? data.timeline : JSON.stringify(data.timeline || []),
  } as ApplicationDetail;
}

export async function upsertApplicationDetails(
  applicationId: string,
  details: {
    posting_url?: string | null;
    job_description?: string | null;
    notes?: string | null;
    timeline?: string | TimelineEvent[];
  }
): Promise<ApplicationDetail> {
  const now = new Date().toISOString();
  const id = `detail-${crypto.randomUUID()}`;

  let timelineParsed: unknown = [];
  if (details.timeline !== undefined && details.timeline !== null) {
    if (typeof details.timeline === "string") {
      try {
        timelineParsed = JSON.parse(details.timeline);
      } catch {
        timelineParsed = [];
      }
    } else {
      timelineParsed = details.timeline;
    }
  }

  const payload: Record<string, unknown> = {
    id,
    application_id: applicationId,
    updated_at: now,
  };
  if (details.posting_url !== undefined) payload.posting_url = details.posting_url;
  if (details.job_description !== undefined) payload.job_description = details.job_description;
  if (details.notes !== undefined) payload.notes = details.notes;
  if (details.timeline !== undefined) payload.timeline = timelineParsed;

  const { data, error } = await getSupabase()
    .from("application_details")
    .upsert(payload, { onConflict: "application_id" })
    .select("*")
    .single();

  if (error) {
    console.error("Supabase upsertApplicationDetails error:", error);
    throw error;
  }

  return {
    ...data,
    timeline: typeof data.timeline === "string" ? data.timeline : JSON.stringify(data.timeline || []),
  } as ApplicationDetail;
}

export async function appendTimelineEvent(
  applicationId: string,
  event: TimelineEvent
): Promise<ApplicationDetail> {
  const existing = await getApplicationDetails(applicationId);
  let events: TimelineEvent[] = [];
  if (existing?.timeline) {
    try {
      events = typeof existing.timeline === "string" ? JSON.parse(existing.timeline) : existing.timeline;
    } catch {
      events = [];
    }
  }
  events.push(event);
  return upsertApplicationDetails(applicationId, { timeline: events });
}

export const applicationDetailsRepository = {
  getApplicationDetails,
  upsertApplicationDetails,
  appendTimelineEvent,
};
