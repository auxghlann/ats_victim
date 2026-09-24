import Link from "next/link";
import { Application, STATUS_BADGE_CLASSES } from "@/types/database";
import { formatSalaryRange } from "@/lib/utils/currency";

interface JobDetailHeaderProps {
  app: Application;
  postingUrl?: string | null;
}

export function JobDetailHeader({ app, postingUrl }: JobDetailHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Top Left Back Navigation Link */}
      <div>
        <Link
          href="/tracker"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors group"
        >
          <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-0.5">
            arrow_back
          </span>
          Back
        </Link>
      </div>

      {/* Main Header Card */}
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
              {(app.salary_min || app.salary_max) && (
                <>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">payments</span>
                    {formatSalaryRange(app.salary_min, app.salary_max, app.salary_currency, { badge: true })}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Actions: Original Posting Icon (where Back button was) */}
        {postingUrl && (
          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <a
              href={postingUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Original Posting"
              aria-label="Original Posting"
              className="p-2.5 rounded-xl border border-outline-variant/60 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors flex items-center justify-center shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">open_in_new</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
