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
  weeklyActivity: { day: string; date: string; count: number; heightPct: number }[];
  recentApplications: Application[];
}

export async function getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  if (!userId) throw new Error("User ID is required");

  const counts = applicationsRepository.getStatusCounts(userId);
  const recent = applicationsRepository.listApplications(userId, {
    pageSize: 5,
    sortBy: "last_activity_date",
    sortOrder: "desc",
  });

  const pendingTasksCount = tasksRepository.getPendingTasksCount(userId);

  // Calculate 7-day weekly activity (Mon - Sun rolling back from today)
  const now = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyActivity = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = days[d.getDay()];

    const count = applicationsRepository.getActivityCountByDate(userId, dateStr);
    weeklyActivity.push({
      day: dayLabel,
      date: dateStr,
      count,
    });
  }

  // Ensure bars have a proportional height representation
  const maxCount = Math.max(...weeklyActivity.map((w) => w.count), 1);
  const activityWithHeights = weeklyActivity.map((w) => ({
    ...w,
    heightPct: Math.max(15, Math.min(100, Math.round((w.count / maxCount) * 90) + 10)),
  }));

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
    weeklyActivity: activityWithHeights,
    recentApplications: recent.items,
  };
}

export const dashboardService = {
  getDashboardMetrics,
};
