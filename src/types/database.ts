export type ApplicationStatus =
  | "applied"
  | "viewed"
  | "interview"
  | "accepted"
  | "rejected";

export const STATUS_BADGE_CLASSES: Record<ApplicationStatus, string> = {
  applied: "bg-[#e6f4ea] text-[#137333] border-[#ceead6]",
  interview: "bg-[#fef7e0] text-[#b06000] border-[#feefc3]",
  viewed: "bg-[#f1f3f4] text-[#5f6368] border-[#dadce0]",
  accepted: "bg-[#e8f0fe] text-[#1a73e8] border-[#d2e3fc]",
  rejected: "bg-[#fce8e6] text-[#c5221f] border-[#fad2cf]",
};


export type TaskPriority = "low" | "medium" | "high";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  avatar_url?: string | null;
  created_at?: string;
}

export interface UserIntegration {
  id: string;
  user_id: string;
  provider: string;
  encrypted_refresh_token: string;
  scopes?: string;
  last_synced_at?: string | null;
  is_active: number | boolean;
  created_at?: string;
}

export interface Application {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  status: ApplicationStatus;
  location?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string;
  date_applied?: string | null;
  last_activity_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TimelineEvent {
  status: ApplicationStatus;
  date: string;
  snippet?: string;
}

export interface ApplicationDetail {
  id: string;
  application_id: string;
  posting_url?: string | null;
  job_description?: string | null;
  notes?: string | null;
  timeline: string | TimelineEvent[]; // String in SQLite, parsed to TimelineEvent[]
  created_at?: string;
  updated_at?: string;
}

export interface ProcessedEmail {
  id: string;
  user_id: string;
  message_id: string;
  sender?: string | null;
  subject?: string | null;
  processed_at?: string;
}

export interface Task {
  id: string;
  user_id: string;
  application_id?: string | null;
  title: string;
  due_date?: string | null;
  completed: number | boolean;
  priority: TaskPriority;
  created_at?: string;
}

export interface Interview {
  id: string;
  user_id: string;
  application_id: string;
  round_name: string;
  scheduled_at: string;
  meeting_link?: string | null;
  notes?: string | null;
  created_at?: string;
}
