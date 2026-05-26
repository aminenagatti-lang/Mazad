"use client";

import { motion } from "framer-motion";

const values = [
  "Prix de marché réel",
  "Acheteurs KYB vérifiés",
  "Rapport d'inspection inclus",
  "Zéro frais cachés",
];

export function Trust() {
  return (
    <section className="bg-paper py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Statement */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-ink sm:text-4xl lg:text-5xl font-heading">
              Fini le gré à gré.
              <br />
              La transparence
              <br />
              par défaut.
            </h2>
          </motion.div>

          {/* Right Items */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            {values.map((value, i) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center gap-4"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className="text-base font-medium text-ink">{value}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
