import { getDatabase } from "@/lib/db";
import { ApplicationDetail, TimelineEvent } from "@/types/database";

export function getApplicationDetails(applicationId: string): ApplicationDetail | null {
  const query = `SELECT * FROM application_details WHERE application_id = ?`;
  return (getDatabase().prepare(query).get(applicationId) as ApplicationDetail) || null;
}

export function upsertApplicationDetails(
  applicationId: string,
  details: {
    posting_url?: string | null;
    job_description?: string | null;
    notes?: string | null;
    timeline?: string | TimelineEvent[];
  }
): ApplicationDetail {
  const now = new Date().toISOString();
  const id = `detail-${crypto.randomUUID()}`;
  const timelineStr = details.timeline !== undefined
    ? typeof details.timeline === "string" ? details.timeline : JSON.stringify(details.timeline)
    : null;

  const sql = `
    INSERT INTO application_details (
      id, application_id, posting_url, job_description, notes, timeline, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, COALESCE(?, '[]'), ?, ?)
    ON CONFLICT(application_id) DO UPDATE SET
      posting_url = COALESCE(excluded.posting_url, application_details.posting_url),
      job_description = COALESCE(excluded.job_description, application_details.job_description),
      notes = COALESCE(excluded.notes, application_details.notes),
      timeline = COALESCE(?, application_details.timeline),
      updated_at = excluded.updated_at
    RETURNING *
  `;

  return getDatabase()
    .prepare(sql)
    .get(
      id,
      applicationId,
      details.posting_url ?? null,
      details.job_description ?? null,
      details.notes ?? null,
      timelineStr,
      now,
      now,
      timelineStr
    ) as ApplicationDetail;
}

export function appendTimelineEvent(
  applicationId: string,
  event: TimelineEvent
): ApplicationDetail {
  const existing = getApplicationDetails(applicationId);
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
