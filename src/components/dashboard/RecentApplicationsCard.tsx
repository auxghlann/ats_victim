import Link from "next/link";
import { Application, STATUS_BADGE_CLASSES } from "@/types/database";

interface RecentApplicationsCardProps {
  applications: Application[];
}

export function RecentApplicationsCard({ applications }: RecentApplicationsCardProps) {
  return (
    <div className="bg-surface p-6 rounded-2xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-on-surface">Recent Applications</h2>
          <span className="text-xs text-on-surface-variant font-medium">Latest updates</span>
        </div>

        <div className="flex flex-col gap-3">
          {applications.map((app) => (
            <Link
              key={app.id}
              href={`/tracker/${app.id}`}
              className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-low transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant/40 flex items-center justify-center font-bold text-sm text-primary shrink-0 group-hover:bg-primary/10 transition-colors">
                {app.company_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                  {app.job_title}
                </h3>
                <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                  {app.company_name} &bull; {app.location || "Remote"}
                </p>
              </div>
              <div className="shrink-0">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize border ${
                    STATUS_BADGE_CLASSES[app.status] || "bg-surface-container text-on-surface-variant border-outline-variant"
                  }`}
                >
                  {app.status}
                </span>
              </div>
            </Link>
          ))}

          {applications.length === 0 && (
            <div className="text-center py-8 text-xs text-on-surface-variant">
              No applications found. Add your first job application in Tracker.
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-outline-variant/20">
        <Link
          href="/tracker"
          className="w-full block py-2.5 text-center text-xs font-semibold text-primary border border-outline-variant/50 rounded-xl hover:bg-primary/5 transition-colors"
        >
          View All Applications
        </Link>
      </div>
    </div>
  );
}
