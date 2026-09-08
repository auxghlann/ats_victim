import Link from "next/link";

interface DashboardHeaderProps {
  userName?: string | null;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const firstName = userName?.split(" ")[0] || "User";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Here is the latest update on your job search.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/tracker"
          className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">table_chart</span>
          Open Application Tracker
        </Link>
      </div>
    </div>
  );
}
