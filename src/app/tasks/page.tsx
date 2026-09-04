import { getCurrentUser } from "@/lib/auth/session";
import { AppLayout } from "@/components/layout/AppLayout";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const user = await getCurrentUser();

  return (
    <AppLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">
            Checklist &amp; Tasks
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Action items, follow-ups, and application preparation checklist
          </p>
        </div>

        <div className="p-12 rounded-3xl bg-surface border border-outline-variant/40 text-center max-w-xl mx-auto mt-12 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">checklist</span>
          </div>
          <h2 className="text-lg font-bold text-on-surface">
            Task Management
          </h2>
          <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
            Prioritized follow-up tasks, referral reminders, and checklist items linked to your applications are scheduled for <strong>Sprint 3: Dashboard Analytics, Tasks &amp; Calendar</strong>.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container text-xs font-semibold text-primary border border-outline-variant/40">
            <span className="material-symbols-outlined text-sm">schedule</span>
            Scheduled for Sprint 3
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
