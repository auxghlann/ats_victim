import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { dashboardService } from "@/lib/services/dashboardService";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { WeeklyActivityChart } from "@/components/dashboard/WeeklyActivityChart";
import { RecentApplicationsCard } from "@/components/dashboard/RecentApplicationsCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  const userId = user?.id || "dev-user-001";

  const { counts, weeklyActivity, recentApplications } = await dashboardService.getDashboardMetrics(userId);

  return (
    <div className="space-y-8">
      <DashboardHeader userName={user?.name} />
      <DashboardStats counts={counts} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-outline-variant/40 shadow-xs flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-base font-bold text-on-surface">Weekly Activity</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Overview of recent application submissions and status transitions
              </p>
            </div>
            <Link
              href="/tracker"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View Full Tracker
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="flex-1">
            <WeeklyActivityChart data={weeklyActivity} />
          </div>
        </div>

        <RecentApplicationsCard applications={recentApplications} />
      </div>
    </div>
  );
}
