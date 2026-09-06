import { ApplicationTracker } from "@/components/tracker/ApplicationTracker";
import { fetchApplicationsAction } from "@/app/actions/applications";

export const dynamic = "force-dynamic";

export default async function TrackerPage() {
  const { items, counts, total } = await fetchApplicationsAction({ page: 1, pageSize: 10 });

  return (
    <ApplicationTracker
      initialItems={items}
      initialCounts={counts}
      initialTotal={total}
    />
  );
}
