import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { applicationsService } from "@/lib/services/applicationsService";
import { tasksService } from "@/lib/services/tasksService";
import { JobDetailView } from "@/components/tracker/detail/JobDetailView";

export const dynamic = "force-dynamic";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const [result, tasks, allAppsResult] = await Promise.all([
    applicationsService.getApplicationDetail(user.id, id),
    tasksService.getApplicationTasks(user.id, id),
    applicationsService.listApplications(user.id, {}),
  ]);

  if (!result || !result.application) {
    return (
      <div className="p-12 text-center max-w-md mx-auto mt-12 bg-surface rounded-2xl border border-outline-variant/40">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
          search_off
        </span>
        <h1 className="text-base font-bold text-on-surface">
          Application Not Found
        </h1>
        <p className="text-xs text-on-surface-variant mt-1 mb-4">
          The job application you requested could not be found or has been deleted.
        </p>
        <Link
          href="/tracker"
          className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container"
        >
          Back to Tracker
        </Link>
      </div>
    );
  }

  return (
    <JobDetailView
      application={result.application}
      detail={result.detail}
      tasks={tasks}
      applications={allAppsResult.items}
    />
  );
}
