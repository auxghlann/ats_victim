import { getCurrentUser } from "@/lib/auth/session";
import { AppLayout } from "@/components/layout/AppLayout";
import { ApplicationTracker } from "@/components/tracker/ApplicationTracker";
import { fetchApplicationsAction } from "@/app/actions/applications";

export const dynamic = "force-dynamic";

export default async function TrackerPage() {
  const user = await getCurrentUser();
  const { items, counts } = await fetchApplicationsAction();

  return (
    <AppLayout user={user}>
      <ApplicationTracker initialItems={items} initialCounts={counts} />
    </AppLayout>
  );
}
