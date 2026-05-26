"use client";

import { motion } from "framer-motion";

export function CTABanner() {
  return (
    <section id="vendre" className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl font-heading">
            Vous gérez une flotte ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-ink-secondary">
            30+ opérateurs font confiance à MazadAuto pour céder leurs véhicules.
          </p>
          <div className="mt-8">
            <a
              href="/deposer"
              className="inline-flex items-center justify-center rounded-md bg-accent px-8 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-accent-dark"
            >
              Déposer mes véhicules
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
