import { getDatabase } from "@/lib/db";
import { Interview, EnrichedInterview } from "@/types/database";

export interface CreateInterviewData {
  applicationId: string;
  roundName: string;
  scheduledAt: string;
  meetingLink?: string | null;
  notes?: string | null;
}

export function listInterviewsByUserId(userId: string): EnrichedInterview[] {
  const sql = `
    SELECT i.*, a.company_name, a.job_title, a.status
    FROM interviews i
    LEFT JOIN applications a ON i.application_id = a.id
    WHERE i.user_id = ?
    ORDER BY i.scheduled_at ASC
  `;
  return getDatabase().prepare(sql).all(userId) as EnrichedInterview[];
}

export function createInterview(userId: string, data: CreateInterviewData): Interview {
  const id = `interview-${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const sql = `
    INSERT INTO interviews (id, user_id, application_id, round_name, scheduled_at, meeting_link, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `;
  return getDatabase().prepare(sql).get(
    id,
    userId,
    data.applicationId,
    data.roundName.trim(),
    data.scheduledAt,
    data.meetingLink?.trim() || null,
    data.notes?.trim() || null,
    now
  ) as Interview;
}

export interface UpdateInterviewData {
  roundName?: string;
  scheduledAt?: string;
  meetingLink?: string | null;
  notes?: string | null;
  applicationId?: string;
}

export function updateInterview(
  userId: string,
  interviewId: string,
  data: UpdateInterviewData
): Interview | null {
  const fields: string[] = [];
  const params: unknown[] = [];

  if (data.roundName !== undefined) {
    fields.push("round_name = ?");
    params.push(data.roundName.trim());
  }
  if (data.scheduledAt !== undefined) {
    fields.push("scheduled_at = ?");
    params.push(data.scheduledAt);
  }
  if (data.meetingLink !== undefined) {
    fields.push("meeting_link = ?");
    params.push(data.meetingLink?.trim() || null);
  }
  if (data.notes !== undefined) {
    fields.push("notes = ?");
    params.push(data.notes?.trim() || null);
  }
  if (data.applicationId !== undefined) {
    fields.push("application_id = ?");
    params.push(data.applicationId);
  }

  if (fields.length === 0) return null;

  params.push(userId, interviewId);
  const sql = `UPDATE interviews SET ${fields.join(", ")} WHERE user_id = ? AND id = ? RETURNING *`;
  return (getDatabase().prepare(sql).get(...params) as Interview) || null;
}

export function deleteInterview(userId: string, interviewId: string): boolean {
  const sql = `DELETE FROM interviews WHERE user_id = ? AND id = ?`;
  const result = getDatabase().prepare(sql).run(userId, interviewId);
  return result.changes > 0;
}

export const interviewsRepository = {
  listInterviewsByUserId,
  createInterview,
  updateInterview,
  deleteInterview,
};
