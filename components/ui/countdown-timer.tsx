"use client";

import { useState, useEffect, useCallback } from "react";

interface CountdownTimerProps {
  endDate: Date;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function CountdownTimer({ endDate, size = "sm", className = "" }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState<number>(() =>
    Math.max(0, endDate.getTime() - Date.now())
  );

  const update = useCallback(() => {
    setRemaining(Math.max(0, endDate.getTime() - Date.now()));
  }, [endDate]);

  useEffect(() => {
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [update]);

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  const isUrgent = remaining > 0 && days === 0 && hours === 0;
  const isEnded = remaining === 0;

  if (isEnded) {
    if (size === "lg") {
      return (
        <span className={`text-ink-muted font-heading font-bold ${className}`}>
          Enchère terminée
        </span>
      );
    }
    return (
      <span className={`text-xs text-ink-muted font-medium ${className}`}>
        Terminée
      </span>
    );
  }

  const colorClass = isUrgent ? "text-red-600" : "text-accent";

  if (size === "sm") {
    return (
      <span data-testid="countdown-timer" className={`text-sm font-bold ${colorClass} ${className}`}>
        {days > 0 && `${days}j `}
        {pad(hours)}h {pad(minutes)}m {pad(seconds)}s
      </span>
    );
  }

  if (size === "md") {
    return (
      <div className={`flex gap-1.5 ${className}`}>
        {[
          { value: pad(days), label: "J" },
          { value: pad(hours), label: "H" },
          { value: pad(minutes), label: "MIN" },
          { value: pad(seconds), label: "SEC" },
        ].map((unit) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center rounded-md bg-surface px-2 py-1"
          >
            <span className={`text-sm font-bold ${colorClass} font-heading`}>
              {unit.value}
            </span>
            <span className="text-[9px] font-medium uppercase tracking-wide text-ink-muted">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // lg
  return (
    <div className={`flex gap-3 ${className}`}>
      {[
        { value: pad(days), label: "JOURS" },
        { value: pad(hours), label: "HEURES" },
        { value: pad(minutes), label: "MIN" },
        { value: pad(seconds), label: "SEC" },
      ].map((unit) => (
        <div key={unit.label} className="flex flex-col items-center gap-1">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-surface">
            <span className={`text-2xl font-extrabold ${colorClass} font-heading`}>
              {unit.value}
            </span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
