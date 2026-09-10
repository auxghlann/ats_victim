import { applicationsRepository } from "@/lib/repositories/applicationsRepository";
import { tasksRepository } from "@/lib/repositories/tasksRepository";
import { Application } from "@/types/database";
import { getCachedData, setCachedData } from "./cache";

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
  weeklyActivity: { day: string; date: string; count: number; heightPct: number }[];
  recentApplications: Application[];
}

export async function getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  if (!userId) throw new Error("User ID is required");

  const cacheKey = `dash:${userId}`;
  const cached = getCachedData<DashboardMetrics>(cacheKey);
  if (cached) return cached;

  const now = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

  const [counts, recent, pendingTasksCount, recentActivityRows] = await Promise.all([
    applicationsRepository.getStatusCounts(userId),
    applicationsRepository.listApplications(userId, {
      pageSize: 5,
      sortBy: "last_activity_date",
      sortOrder: "desc",
    }),
    tasksRepository.getPendingTasksCount(userId),
    applicationsRepository.getWeeklyActivityDates(userId, sevenDaysAgoStr),
  ]);

  // Aggregate 7-day activity in-memory
  const dayCounts = new Map<string, number>();
  for (const row of recentActivityRows) {
    const target = row.last_activity_date || row.date_applied;
    if (target) {
      dayCounts.set(target, (dayCounts.get(target) || 0) + 1);
    }
  }

  const weeklyActivity = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = days[d.getDay()];
    weeklyActivity.push({
      day: dayLabel,
      date: dateStr,
      count: dayCounts.get(dateStr) || 0,
    });
  }

  // Ensure bars have a proportional height representation
  const maxCount = Math.max(...weeklyActivity.map((w) => w.count), 1);
  const activityWithHeights = weeklyActivity.map((w) => ({
    ...w,
    heightPct: Math.max(15, Math.min(100, Math.round((w.count / maxCount) * 90) + 10)),
  }));

  const result: DashboardMetrics = {
    counts: {
      all: counts.all || 0,
      applied: counts.applied || 0,
      viewed: counts.viewed || 0,
      interview: counts.interview || 0,
      accepted: counts.accepted || 0,
      rejected: counts.rejected || 0,
      pending_tasks: pendingTasksCount,
    },
    weeklyActivity: activityWithHeights,
    recentApplications: recent.items,
  };

  setCachedData(cacheKey, result, 15);
  return result;
}

export const dashboardService = {
  getDashboardMetrics,
};
