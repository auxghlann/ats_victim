"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Application, ApplicationDetail } from "@/types/database";
import { deleteApplicationAction } from "@/app/actions/applicationsAction";
import { JobDetailHeader } from "./JobDetailHeader";
import { PipelineStepper } from "./PipelineStepper";
import { JobDescriptionSection } from "./JobDescriptionSection";
import { JobNotesSection } from "./JobNotesSection";
import { JobTimelineSection } from "./JobTimelineSection";

interface JobDetailViewProps {
  application: Application;
  detail: ApplicationDetail | null;
}

export function JobDetailView({
  application: initialApp,
  detail: initialDetail,
}: JobDetailViewProps) {
  const router = useRouter();
  const [app] = useState<Application>(initialApp);
  const [detail, setDetail] = useState<ApplicationDetail | null>(initialDetail);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete application for ${app.company_name}?`)) {
      await deleteApplicationAction(app.id);
      router.push("/tracker");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Hero Job Header */}
      <JobDetailHeader app={app} onDelete={handleDelete} />

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

        {/* Right 1 Column: Timeline */}
        <div className="space-y-6">
          <JobTimelineSection detail={detail} />
        </div>
      </div>
    </div>
  );
}
