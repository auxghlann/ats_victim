import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { interviewsService } from "@/lib/services/interviewsService";
import { applicationsService } from "@/lib/services/applicationsService";
import { InterviewsCalendar } from "@/components/interviews/InterviewsCalendar";

export const dynamic = "force-dynamic";

export default async function InterviewsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const [interviews, appsResult] = await Promise.all([
    interviewsService.listInterviews(user.id),
    applicationsService.listApplications(user.id, { pageSize: 100 }),
  ]);

  return (
    <InterviewsCalendar
      initialInterviews={interviews}
      applications={appsResult.items}
    />
  );
}
