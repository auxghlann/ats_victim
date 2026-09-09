import { ApplicationStatus } from "@/types/database";

interface PipelineStepperProps {
  status: ApplicationStatus;
}

const STEPS: { label: string; value: ApplicationStatus; icon: string }[] = [
  { label: "Applied", value: "applied", icon: "check" },
  { label: "Screening", value: "viewed", icon: "record_voice_over" },
  { label: "Technical", value: "interview", icon: "code" },
  { label: "Offer", value: "accepted", icon: "handshake" },
];

const STATUS_STEP_INDEX: Record<ApplicationStatus, number> = {
  applied: 0,
  viewed: 1,
  interview: 2,
  accepted: 3,
  rejected: 3,
};

export function PipelineStepper({ status }: PipelineStepperProps) {
  const currentStepIndex = STATUS_STEP_INDEX[status] ?? 0;

  return (
    <div className="p-6 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-on-surface">Application Pipeline</h2>
        <span className="text-xs text-on-surface-variant font-medium">Stage Progress</span>
      </div>

      <div className="flex items-center justify-between relative">
        {/* Connecting Background Line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-outline-variant/30 -z-0" />

        {/* Connecting Active Progress Line */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-500 -z-0"
          style={{
            width: `${(currentStepIndex / (STEPS.length - 1)) * 100 * 0.88}%`,
          }}
        />

        {STEPS.map((step, idx) => {
          const isPassed = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={step.value} className="flex flex-col items-center gap-2 z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isPassed
                    ? "bg-primary text-on-primary shadow-xs"
                    : isCurrent
                    ? "bg-primary text-on-primary ring-4 ring-primary/20 shadow-xs"
                    : "bg-surface-container text-on-surface-variant border border-outline-variant/40"
                }`}
              >
                <span className="material-symbols-outlined text-base">{step.icon}</span>
              </div>
              <span
                className={`text-[11px] font-bold ${
                  isCurrent
                    ? "text-primary font-extrabold"
                    : isPassed
                    ? "text-on-surface"
                    : "text-on-surface-variant/60"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
