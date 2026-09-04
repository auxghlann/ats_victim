import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { AppLayout } from "@/components/layout/AppLayout";
import { applicationsService } from "@/lib/services/applicationsService";
import { STATUS_BADGE_CLASSES } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  const userId = user?.id || "dev-user-001";

  const { counts, recentApplications } = await applicationsService.getDashboardMetrics(userId);



  return (
    <AppLayout user={user}>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">
              Welcome back, {user?.name?.split(" ")[0] || "User"}
            </h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Your career pipeline is synchronized and up to date
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/tracker"
              className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all shadow-xs flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">table_chart</span>
              Open Application Tracker
            </Link>
          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface-variant">Total Applications</span>
              <span className="material-symbols-outlined text-primary text-xl">work</span>
            </div>
            <div className="mt-3 text-2xl font-bold text-on-surface">
              {counts.all || 0}
            </div>
            <div className="mt-1 text-[11px] text-on-surface-variant">
              Active in pipeline
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface-variant">Interviewing</span>
              <span className="material-symbols-outlined text-status-interviewing text-xl">event_repeat</span>
            </div>
            <div className="mt-3 text-2xl font-bold text-status-interviewing">
              {counts.interview || 0}
            </div>
            <div className="mt-1 text-[11px] text-on-surface-variant">
              Rounds in progress
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface-variant">Offers Received</span>
              <span className="material-symbols-outlined text-status-applied text-xl">verified</span>
            </div>
            <div className="mt-3 text-2xl font-bold text-status-applied">
              {counts.accepted || 0}
            </div>
            <div className="mt-1 text-[11px] text-on-surface-variant">
              Accepted offer
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface-variant">Applied Stage</span>
              <span className="material-symbols-outlined text-primary text-xl">send</span>
            </div>
            <div className="mt-3 text-2xl font-bold text-on-surface">
              {counts.applied || 0}
            </div>
            <div className="mt-1 text-[11px] text-on-surface-variant">
              Awaiting review
            </div>
          </div>
        </div>

        {/* Recent Applications Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-on-surface">
                Recent Applications
              </h2>
              <p className="text-xs text-on-surface-variant">
                Latest updates and changes in your pipeline
              </p>
            </div>
            <Link
              href="/tracker"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View all in Tracker
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-outline-variant/40 bg-surface shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/40">
                <tr>
                  <th className="py-3 px-5">Company</th>
                  <th className="py-3 px-5">Position</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Location</th>
                  <th className="py-3 px-5">Salary</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 text-on-surface">
                {recentApplications.map((app) => (

                  <tr key={app.id} className="hover:bg-surface-variant/40 transition-colors">
                    <td className="py-3.5 px-5 font-medium flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {app.company_name.charAt(0)}
                      </div>
                      <span className="font-bold text-on-surface">{app.company_name}</span>
                    </td>
                    <td className="py-3.5 px-5 text-xs">{app.job_title}</td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${
                        STATUS_BADGE_CLASSES[app.status] || "bg-surface-container text-on-surface-variant border-outline-variant"
                      }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-on-surface-variant text-xs">
                      {app.location || "Remote"}
                    </td>
                    <td className="py-3.5 px-5 text-xs">
                      {app.salary_min && app.salary_max
                        ? `$${(app.salary_min / 1000).toFixed(0)}k - $${(app.salary_max / 1000).toFixed(0)}k`
                        : "Competitive"}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href="/tracker"
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Manage &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
