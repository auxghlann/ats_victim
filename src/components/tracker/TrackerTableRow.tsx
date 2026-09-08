import { useRouter } from "next/navigation";
import Link from "next/link";
import { Application, STATUS_BADGE_CLASSES } from "@/types/database";
import { formatRelativeDate } from "@/lib/utils/date";

interface TrackerTableRowProps {
  app: Application;
  openActionMenuId: string | null;
  onToggleActionMenu: (appId: string) => void;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
}

export function TrackerTableRow({
  app,
  openActionMenuId,
  onToggleActionMenu,
  onEdit,
  onDelete,
}: TrackerTableRowProps) {
  const router = useRouter();
  const isMenuOpen = openActionMenuId === app.id;

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest("[data-no-row-click]")) {
      return;
    }
    router.push(`/tracker/${app.id}`);
  };

  // Format Salary
  const salaryText = (() => {
    if (app.salary_min && app.salary_max) {
      return `$${Math.round(app.salary_min / 1000)}k - $${Math.round(app.salary_max / 1000)}k`;
    }
    if (app.salary_min) {
      return `From $${Math.round(app.salary_min / 1000)}k`;
    }
    return "Undisclosed";
  })();

  const relativeActivityDate = formatRelativeDate(app.last_activity_date || app.created_at || "");

  return (
    <tr
      onClick={handleRowClick}
      className="border-b border-outline-variant/20 hover:bg-surface-variant/80 transition-colors group cursor-pointer"
    >
      {/* 1. Company */}
      <td className="px-4 py-3.5 border-r border-outline-variant/15">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-surface-container border border-outline-variant/40 flex items-center justify-center font-bold text-xs text-primary shrink-0">
            {app.company_name.charAt(0)}
          </div>
          <span className="text-xs font-bold text-on-surface truncate" title={app.company_name}>
            {app.company_name}
          </span>
        </div>
      </td>

      {/* 2. Role */}
      <td className="px-4 py-3.5 border-r border-outline-variant/15">
        <div className="min-w-0">
          <span
            className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors truncate block"
            title={app.job_title}
          >
            {app.job_title}
          </span>
        </div>
      </td>

      {/* 3. Status */}
      <td className="px-4 py-3.5 border-r border-outline-variant/15">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold capitalize border ${
            STATUS_BADGE_CLASSES[app.status] || "bg-surface-container text-on-surface-variant"
          }`}
        >
          {app.status}
        </span>
      </td>

      {/* 4. Location */}
      <td className="px-4 py-3.5 border-r border-outline-variant/15">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-xs text-on-surface truncate" title={app.location || "Remote"}>
            {app.location || "Remote"}
          </span>
          {app.work_setup && (
            <span className="text-[10px] text-on-surface-variant/80 font-medium capitalize">
              {app.work_setup}
            </span>
          )}
        </div>
      </td>

      {/* 5. Salary */}
      <td className="px-4 py-3.5 border-r border-outline-variant/15">
        <span className="text-xs font-medium text-on-surface truncate block" title={salaryText}>
          {salaryText}
        </span>
      </td>

      {/* 6. Last Activity */}
      <td className="px-4 py-3.5 border-r border-outline-variant/15">
        <span
          suppressHydrationWarning
          className="text-xs text-on-surface-variant truncate block"
          title={app.last_activity_date || ""}
        >
          {relativeActivityDate}
        </span>
      </td>

      {/* 7. Actions Menu */}
      <td className="px-2 py-3.5 text-center relative">
        <button
          type="button"
          onClick={() => onToggleActionMenu(app.id)}
          className="w-7 h-7 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors mx-auto cursor-pointer"
          title="Actions"
        >
          <span className="material-symbols-outlined text-base">more_vert</span>
        </button>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={() => onToggleActionMenu(app.id)}
            />
            <div className="absolute right-2 top-11 z-30 w-36 py-1.5 rounded-xl bg-surface border border-outline-variant/40 shadow-lg animate-in fade-in zoom-in-95 duration-100 text-left">
              <Link
                href={`/tracker/${app.id}`}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs text-on-surface hover:bg-surface-container transition-colors"
                onClick={() => onToggleActionMenu(app.id)}
              >
                <span className="material-symbols-outlined text-sm text-on-surface-variant">
                  visibility
                </span>
                View Details
              </Link>
              <button
                type="button"
                onClick={() => {
                  onToggleActionMenu(app.id);
                  onEdit(app);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-on-surface-variant">
                  edit
                </span>
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  onToggleActionMenu(app.id);
                  onDelete(app);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs text-error hover:bg-error/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Delete
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
}
