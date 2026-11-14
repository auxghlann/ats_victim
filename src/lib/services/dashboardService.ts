import { applicationsRepository } from "@/lib/repositories/applicationsRepository";
import { tasksRepository } from "@/lib/repositories/tasksRepository";
import { Application } from "@/types/database";

export interface DashboardMetrics {
  counts: {
    all: number;
    applied: number;
    viewed: number;
    interview: number;
    accepted: number;
    rejected: number;
    pending_tasks: number;
    [key: string]: number;
  };
  weeklyActivity: { day: string; date: string; count: number }[];
  recentApplications: Application[];
}

export async function getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  if (!userId) throw new Error("User ID is required");

  const now = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = now.getUTCDay();
  const sunday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - dayOfWeek));
  const sundayStr = sunday.toISOString().split("T")[0];

  const [counts, recent, pendingTasksCount, recentActivityRows] = await Promise.all([
    applicationsRepository.getStatusCounts(userId),
    applicationsRepository.listApplications(userId, {
      pageSize: 5,
      sortBy: "last_activity_date",
      sortOrder: "desc",
    }),
    tasksRepository.getPendingTasksCount(userId),
    applicationsRepository.getWeeklyActivityDates(userId, sundayStr),
  ]);

  const dayCounts = new Map<string, number>();
  for (const row of recentActivityRows) {
    const target = row.last_activity_date || row.date_applied;
    if (target) {
      dayCounts.set(target, (dayCounts.get(target) || 0) + 1);
    }
  }

  const weeklyActivity = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(Date.UTC(sunday.getUTCFullYear(), sunday.getUTCMonth(), sunday.getUTCDate() + i));
    const dateStr = d.toISOString().split("T")[0];
    weeklyActivity.push({
      day: days[i],
      date: dateStr,
      count: dayCounts.get(dateStr) || 0,
    });
  }

  return {
    counts: {
      all: counts.all || 0,
      applied: counts.applied || 0,
      viewed: counts.viewed || 0,
      interview: counts.interview || 0,
      accepted: counts.accepted || 0,
      rejected: counts.rejected || 0,
      pending_tasks: pendingTasksCount,
    },
    weeklyActivity,
    recentApplications: recent.items,
  };
}

export const dashboardService = {
  getDashboardMetrics,
};
