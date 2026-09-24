import Link from "next/link";
import { Application, STATUS_BADGE_CLASSES } from "@/types/database";

interface JobDetailHeaderProps {
  app: Application;
}

export function JobDetailHeader({ app }: JobDetailHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-6 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm">
      <div className="flex items-start gap-3 sm:gap-4 min-w-0">
        {/* Company Avatar */}
        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-surface-container border border-outline-variant/40 flex items-center justify-center font-extrabold text-xl sm:text-2xl text-primary shrink-0 shadow-2xs">
          {app.company_name.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-on-surface tracking-tight break-words">
              {app.job_title}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold capitalize border ${
                STATUS_BADGE_CLASSES[app.status] || "bg-surface-container text-on-surface-variant"
              }`}
            >
              {app.status}
            </span>
          </div>

          <p className="text-sm font-semibold text-on-surface-variant mt-1 flex items-center gap-2 flex-wrap">
            <span className="text-on-surface font-bold">{app.company_name}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {app.location || "Remote"} {app.work_setup ? `(${app.work_setup})` : ""}
            </span>
            {app.salary_min && (
              <>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">payments</span>
                  ${Math.round(app.salary_min / 1000)}k
                  {app.salary_max ? ` - $${Math.round(app.salary_max / 1000)}k` : "+"}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 self-start md:self-center">
        <Link
          href="/tracker"
          className="px-4 py-2 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back
        </Link>
      </div>
    </div>
  );
}
