import { ApplicationTracker } from "@/components/tracker/ApplicationTracker";
import { fetchApplicationsAction } from "@/app/actions/applicationsAction";

export const dynamic = "force-dynamic";

export default async function TrackerPage() {
  const { items, total } = await fetchApplicationsAction({ page: 1, pageSize: 10 });

  return (
    <ApplicationTracker
      initialItems={items}
      initialTotal={total}
    />
  );
}
