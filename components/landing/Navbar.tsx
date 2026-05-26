"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toggleTestMode, isTestMode } from "@/lib/test-mode";
import Link from "next/link";

const navLinks = [
  { label: "Enchères en cours", href: "/encheres" },
  { label: "Comment ça marche", href: "#comment-ca-marche" },
  { label: "Vendre un véhicule", href: "/commencer" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [testMode, setTestModeState] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    setTestModeState(isTestMode());
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleToggleTest = () => {
    const next = toggleTestMode();
    setTestModeState(next);
    window.location.reload();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 bg-paper transition-[border-color] duration-200 ${
        scrolled ? "border-b border-line" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0 text-xl font-bold tracking-tight">
          <span className="text-ink">Mazad</span>
          <span className="text-accent">Auto</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-ink-secondary transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-ink-secondary transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={handleToggleTest}
            className={`inline-flex items-center justify-center rounded-md border px-3 py-2 text-xs font-bold transition-colors ${
              testMode
                ? "border-yellow-400 bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                : "border-ink bg-paper text-ink hover:bg-ink hover:text-white"
            }`}
            title="Active le mode test pour naviguer sans authentification"
          >
            {testMode ? "Mode Test ON" : "Mode Test"}
          </button>
          {testMode && (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md border border-accent bg-accent-tint px-4 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/commencer"
            className="inline-flex items-center justify-center rounded-md border border-ink bg-paper px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            Vendre un véhicule
          </Link>
          <Link
            href="/commencer"
            className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            Enchérir maintenant
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          aria-label="Ouvrir le menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md p-2 text-ink md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-72 bg-paper p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="text-lg font-bold tracking-tight">
                  <span className="text-ink">Mazad</span>
                  <span className="text-accent">Auto</span>
                </span>
                <button
                  aria-label="Fermer le menu"
                  className="flex h-11 w-11 items-center justify-center rounded-md p-2 text-ink-secondary hover:text-ink"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) =>
                  link.href.startsWith("/") ? (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-base font-medium text-ink-secondary transition-colors hover:text-ink"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-base font-medium text-ink-secondary transition-colors hover:text-ink"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  )
                )}
                <div className="mt-2 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      handleToggleTest();
                      setMobileOpen(false);
                    }}
                    className={`inline-flex items-center justify-center rounded-md border px-4 py-3 text-sm font-bold transition-colors ${
                      testMode
                        ? "border-yellow-400 bg-yellow-100 text-yellow-800"
                        : "border-ink bg-paper text-ink hover:bg-ink hover:text-white"
                    }`}
                  >
                    {testMode ? "Quitter le Mode Test" : "Activer le Mode Test"}
                  </button>
                  {testMode && (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex items-center justify-center rounded-md border border-accent bg-accent-tint px-4 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/commencer"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center rounded-md border border-ink bg-paper px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
                  >
                    Vendre un véhicule
                  </Link>
                  <Link
                    href="/commencer"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
                  >
                    Enchérir maintenant
                  </Link>
                </div>
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
