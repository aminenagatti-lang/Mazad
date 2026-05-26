"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getPublicUrl } from "@/lib/supabase/storage";

interface VehiclePhoto {
  id: string;
  storage_path: string;
  is_cover: boolean;
  display_order: number;
}

interface PhotoGalleryProps {
  photos: VehiclePhoto[];
  vehicleName: string;
}

export function PhotoGallery({ photos, vehicleName }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  const sorted = [...photos].sort((a, b) => a.display_order - b.display_order);
  const activePhoto = sorted[activeIndex] ?? sorted[0];

  const navigate = useCallback(
    (dir: number) => {
      setActiveIndex((i) => {
        const next = i + dir;
        if (next < 0) return sorted.length - 1;
        if (next >= sorted.length) return 0;
        return next;
      });
    },
    [sorted.length]
  );

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, navigate]);

  const handleError = (id: string) => {
    setImgError((prev) => ({ ...prev, [id]: true }));
  };

  const mainImageSrc = activePhoto ? getPublicUrl("vehicle-photos", activePhoto.storage_path) : "";

  return (
    <div>
      <button
        onClick={() => setLightboxOpen(true)}
        className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-surface"
      >
        {activePhoto && !imgError[activePhoto.id] ? (
          <Image
            src={mainImageSrc}
            alt={`${vehicleName} — Photo ${activeIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority={activeIndex === 0}
            onError={() => handleError(activePhoto.id)}
          />
        ) : (
          <span className="flex flex-col items-center gap-2 text-ink-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Photos à venir
          </span>
        )}
        {sorted.length > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-semibold text-white">
            {activeIndex + 1} / {sorted.length}
          </span>
        )}
      </button>

      {/* Thumbnails */}
      {sorted.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {sorted.map((photo, i) => (
            <button
              key={photo.id}
              onClick={() => setActiveIndex(i)}
              className={`relative flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface text-xs font-medium text-ink-muted transition-colors ${
                activeIndex === i ? "ring-2 ring-accent" : "hover:bg-elevated"
              }`}
            >
              {!imgError[photo.id] ? (
                <Image
                  src={getPublicUrl("vehicle-photos", photo.storage_path)}
                  alt={`${vehicleName} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                  onError={() => handleError(photo.id)}
                />
              ) : (
                <span>{i + 1}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative flex aspect-video w-full max-w-5xl items-center justify-center rounded-xl bg-surface"
              onClick={(e) => e.stopPropagation()}
            >
              {!imgError[activePhoto.id] ? (
                <Image
                  src={getPublicUrl("vehicle-photos", activePhoto.storage_path)}
                  alt={`${vehicleName} — Photo ${activeIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  onError={() => handleError(activePhoto.id)}
                />
              ) : (
                <span className="text-sm font-semibold uppercase tracking-widest text-ink-muted">
                  {vehicleName} — Photo {activeIndex + 1} / {sorted.length}
                </span>
              )}

              {sorted.length > 1 && (
                <>
                  <button
                    onClick={() => navigate(-1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                    aria-label="Photo précédente"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <button
                    onClick={() => navigate(1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                    aria-label="Photo suivante"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </>
              )}

              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                aria-label="Fermer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
