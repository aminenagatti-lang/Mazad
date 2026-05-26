"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InspectionItem {
  id: string;
  category: string;
  label: string;
  status: "ok" | "warning" | "fail";
  note: string | null;
}

interface InspectionReportProps {
  items: InspectionItem[];
  score: number | null;
}

export function InspectionReport({ items, score }: InspectionReportProps) {
  const [open, setOpen] = useState(true);

  const scoreColor =
    score === null ? "text-ink-muted" : score >= 80 ? "text-accent" : score >= 50 ? "text-yellow-600" : "text-red-600";
  const scoreBg =
    score === null ? "bg-surface" : score >= 80 ? "bg-accent-tint" : score >= 50 ? "bg-yellow-50" : "bg-red-50";

  return (
    <div className="mt-8">
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-ink font-heading">Rapport d&apos;inspection</h2>
          {score !== null && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${scoreColor} ${scoreBg}`}>
              {score}/100
            </span>
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pb-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-3 rounded-lg border border-line bg-paper p-3">
                  {item.status === "ok" ? (
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                  ) : item.status === "warning" ? (
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-50 text-yellow-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </span>
                  ) : (
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.category}</p>
                    {item.note && <p className="text-xs text-ink-secondary">{item.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
