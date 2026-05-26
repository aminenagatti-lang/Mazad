"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Inspection certifiée",
    description: "Contrôle physique dans notre parc à Tunis",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Enchère 48h",
    description: "Ouverte aux acheteurs professionnels vérifiés",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Adjudication",
    description: "Transfert de propriété sécurisé en 72h",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center lg:text-left">
          <h2 className="text-2xl font-bold text-ink sm:text-3xl font-heading">
            Comment ça marche
          </h2>
          <p className="mt-3 text-ink-secondary">
            Un processus simple et transparent en trois étapes.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
              className="relative flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-7xl font-extrabold text-elevated select-none lg:left-0 lg:translate-x-0 font-heading">
                {step.num}
              </span>
              <div className="relative z-10 mb-4 mt-4 text-ink">{step.icon}</div>
              <h3 className="relative z-10 text-lg font-bold text-ink font-heading">
                {step.title}
              </h3>
              <p className="relative z-10 mt-2 text-sm leading-relaxed text-ink-secondary">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
