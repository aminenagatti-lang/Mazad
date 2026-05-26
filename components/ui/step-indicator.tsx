"use client";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number; // 0-indexed
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        const isLast = i === steps.length - 1;

        return (
          <div key={step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-accent text-white"
                    : isDone
                    ? "bg-accent-tint text-accent"
                    : "bg-surface text-ink-muted"
                }`}
              >
                {isDone ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isActive ? "text-accent" : isDone ? "text-accent" : "text-ink-muted"
                }`}
              >
                {step}
              </span>
            </div>
            {!isLast && (
              <div
                className={`mx-2 h-0.5 flex-1 transition-colors ${
                  i < currentStep ? "bg-accent" : "bg-line"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
