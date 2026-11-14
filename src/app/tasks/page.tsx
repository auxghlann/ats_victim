import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { tasksService } from "@/lib/services/tasksService";
import { applicationsService } from "@/lib/services/applicationsService";
import { TaskManager } from "@/components/tasks/TaskManager";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const [tasks, appsResult] = await Promise.all([
    tasksService.getAllUserTasks(user.id),
    applicationsService.listApplications(user.id, { pageSize: 100 }),
  ]);

  return (
    <TaskManager
      initialTasks={tasks}
      applications={appsResult.items}
    />
  );
}
