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
    <div className="p-4 sm:p-6 bg-surface rounded-2xl border border-outline-variant/40 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-on-surface">Application Pipeline</h2>
        <span className="text-[11px] sm:text-xs text-on-surface-variant font-medium">Stage Progress</span>
      </div>

      <div className="flex items-center justify-between relative">
        {/* Connecting Background Line through circle centers */}
        <div className="absolute left-4 right-4 sm:left-6 sm:right-6 top-4 sm:top-5 h-0.5 bg-outline-variant/30 z-0" />

        {/* Connecting Active Progress Line */}
        <div
          className="absolute left-4 sm:left-6 top-4 sm:top-5 h-0.5 bg-primary transition-all duration-500 z-0"
          style={{
            width: `calc(${currentStepIndex / (STEPS.length - 1)} * (100% - 2rem))`,
          }}
        />

        {STEPS.map((step, idx) => {
          const isPassed = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={step.value} className="flex flex-col items-center gap-1.5 sm:gap-2 z-10">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                  isPassed
                    ? "bg-primary text-on-primary shadow-xs"
                    : isCurrent
                    ? "bg-primary text-on-primary ring-3 sm:ring-4 ring-primary/20 shadow-xs"
                    : "bg-surface-container text-on-surface-variant border border-outline-variant/40"
                }`}
              >
                <span className="material-symbols-outlined text-sm sm:text-base">{step.icon}</span>
              </div>
              <span
                className={`text-[10px] sm:text-[11px] font-bold text-center ${
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
