"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isTestMode, setTestMode } from "@/lib/test-mode";

export function TestModeBanner() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isTestMode());
    const onStorage = () => setActive(isTestMode());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleExit = () => {
    setTestMode(false);
    setActive(false);
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-b border-yellow-300 bg-yellow-100 text-yellow-900"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Mode Test actif — Pas d&apos;authentification requise
            </div>
            <button
              onClick={handleExit}
              className="rounded bg-yellow-200 px-2 py-1 font-bold text-yellow-900 hover:bg-yellow-300"
            >
              Quitter le mode test
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
