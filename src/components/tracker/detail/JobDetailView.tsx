"use client";

import { useState } from "react";
import { Application, ApplicationDetail, Task } from "@/types/database";
import { JobDetailHeader } from "./JobDetailHeader";
import { PipelineStepper } from "./PipelineStepper";
import { JobDescriptionSection } from "./JobDescriptionSection";
import { JobNotesSection } from "./JobNotesSection";
import { JobTasksSection } from "./JobTasksSection";
import { JobTimelineSection } from "./JobTimelineSection";

interface JobDetailViewProps {
  application: Application;
  detail: ApplicationDetail | null;
  tasks: Task[];
  applications: Application[];
}

export function JobDetailView({
  application: initialApp,
  detail: initialDetail,
  tasks,
  applications,
}: JobDetailViewProps) {
  const [app] = useState<Application>(initialApp);
  const [detail, setDetail] = useState<ApplicationDetail | null>(initialDetail);

  return (
    <div className="space-y-6">
      {/* 1. Hero Job Header */}
      <JobDetailHeader app={app} />

      {/* 2. Visual Status Stepper */}
      <PipelineStepper status={app.status} />

      {/* 3. Main Details Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Description & Notes */}
        <div className="lg:col-span-2 space-y-6">
          <JobDescriptionSection
            applicationId={app.id}
            detail={detail}
            onDetailUpdated={setDetail}
          />
          <JobNotesSection
            applicationId={app.id}
            detail={detail}
            onDetailUpdated={setDetail}
          />
        </div>

        {/* Right 1 Column: Tasks & Timeline */}
        <div className="space-y-6">
          <JobTasksSection
            application={app}
            initialTasks={tasks}
            applications={applications}
          />
          <JobTimelineSection detail={detail} />
        </div>
      </div>
    </div>
  );
}
