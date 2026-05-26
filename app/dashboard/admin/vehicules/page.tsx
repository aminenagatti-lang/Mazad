"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import { isTestMode } from "@/lib/test-mode";
import { getPublicUrl } from "@/lib/supabase/storage";
import { approveVehicle } from "@/app/actions/admin";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface VehicleRow {
  id: string;
  marque: string;
  modele: string;
  annee: number;
  status: string;
  created_at: string;
  seller: { first_name: string | null; last_name: string | null }[] | null;
}

interface VehiclePhoto {
  id: string;
  storage_path: string;
  is_cover: boolean;
}

interface VehicleDoc {
  id: string;
  document_type: string;
  storage_path: string;
  file_name: string | null;
}

type FilterStatus = "pending_inspection" | "active" | "sold" | "cancelled";

function isSupabaseReady() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "your-project-url" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "your-anon-key"
  );
}

export default function AdminVehiclesPage() {
  const [filter, setFilter] = useState<FilterStatus>("pending_inspection");
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRow | null>(null);
  const [photos, setPhotos] = useState<VehiclePhoto[]>([]);
  const [docs, setDocs] = useState<VehicleDoc[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isSupabaseReady() || isTestMode()) {
      setVehicles([
        { id: "1", marque: "Peugeot", modele: "308", annee: 2020, status: "pending_inspection", created_at: "2025-05-20", seller: [{ first_name: "Karim", last_name: "Ben Ali" }] },
        { id: "2", marque: "Renault", modele: "Clio", annee: 2018, status: "active", created_at: "2025-05-19", seller: [{ first_name: "Sami", last_name: "Trabelsi" }] },
        { id: "3", marque: "Ford", modele: "Ranger", annee: 2021, status: "sold", created_at: "2025-05-15", seller: [{ first_name: "Mohamed", last_name: "Khadhraoui" }] },
      ]);
      setLoading(false);
      return;
    }

    supabase
      .from("vehicles")
      .select("id, marque, modele, annee, status, created_at, seller:profiles(first_name, last_name)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setVehicles((data as VehicleRow[]) ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedVehicle) {
      setPhotos([]);
      setDocs([]);
      return;
    }
    setPhotosLoading(true);

    Promise.all([
      supabase.from("vehicle_photos").select("id, storage_path, is_cover").eq("vehicle_id", selectedVehicle.id).order("display_order", { ascending: true }),
      supabase.from("vehicle_documents").select("id, document_type, storage_path, file_name").eq("vehicle_id", selectedVehicle.id),
    ]).then(([photosRes, docsRes]) => {
      setPhotos((photosRes.data ?? []) as VehiclePhoto[]);
      setDocs((docsRes.data ?? []) as VehicleDoc[]);
      setPhotosLoading(false);
    });
  }, [selectedVehicle]);

  const filtered = vehicles.filter((v) => v.status === filter);

  const handleApprove = async (vehicleId: string) => {
    setProcessing(true);
    const res = await approveVehicle(vehicleId);
    setProcessing(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Véhicule approuvé et mis en ligne");
    setVehicles((prev) => prev.map((v) => v.id === vehicleId ? { ...v, status: "active" } : v));
    setSelectedVehicle(null);
  };

  const handleDeletePhoto = async (photoId: string) => {
    const { error } = await supabase.from("vehicle_photos").delete().eq("id", photoId);
    if (error) {
      toast.error("Erreur lors de la suppression");
      return;
    }
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    toast.success("Photo supprimée");
  };

  const inspectionDoc = docs.find((d) => d.document_type === "rapport_inspection");

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">Véhicules</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["pending_inspection", "active", "sold", "cancelled"] as FilterStatus[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === f ? "bg-accent text-white" : "bg-surface text-ink-secondary hover:bg-elevated"
            }`}
          >
            {f === "pending_inspection" ? "En attente" : f === "active" ? "Actifs" : f === "sold" ? "Vendus" : "Annulés"}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 w-full animate-pulse rounded bg-surface" />
            ))}
          </div>
        ) : (
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Véhicule</th>
                <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Vendeur</th>
                <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Soumis le</th>
                <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Statut</th>
                <th className="pb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => {
                const s = v.seller?.[0];
                const sellerName = s ? `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim() : "—";
                return (
                  <tr key={v.id} className="border-b border-line last:border-0">
                    <td className="py-3 text-sm font-medium text-ink">{v.marque} {v.modele} {v.annee}</td>
                    <td className="py-3 text-sm text-ink-secondary">{sellerName}</td>
                    <td className="py-3 text-sm text-ink-secondary">{new Date(v.created_at).toLocaleDateString("fr-FR")}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        v.status === "pending_inspection" ? "bg-yellow-50 text-yellow-700" :
                        v.status === "active" ? "bg-accent-tint text-accent" :
                        v.status === "sold" ? "bg-green-50 text-green-700" :
                        "bg-red-50 text-red-700"
                      }`}>
                        {v.status === "pending_inspection" ? "En attente" : v.status === "active" ? "Actif" : v.status === "sold" ? "Vendu" : "Annulé"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        {v.status === "pending_inspection" && (
                          <>
                            <button onClick={() => handleApprove(v.id)} disabled={processing} className="text-xs font-semibold text-accent hover:text-accent-dark">Approuver</button>
                            <button onClick={() => toast.error("Véhicule rejeté")} className="text-xs font-semibold text-red-600 hover:text-red-700">Rejeter</button>
                          </>
                        )}
                        <button onClick={() => setSelectedVehicle(v)} className="text-xs font-semibold text-ink-secondary hover:text-ink">Examiner</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-sm text-ink-muted">Aucun véhicule</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Vehicle Review Side Panel */}
      <AnimatePresence>
        {selectedVehicle && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-y-auto border-l border-line bg-paper shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-ink font-heading">Examiner le véhicule</h2>
                <button onClick={() => setSelectedVehicle(null)} className="flex h-11 w-11 items-center justify-center rounded-md p-2 text-ink-muted hover:text-ink">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <div className="mt-4 rounded-xl bg-surface p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">Véhicule</p>
                <p className="mt-1 text-sm font-semibold text-ink">{selectedVehicle.marque} {selectedVehicle.modele} {selectedVehicle.annee}</p>
                <p className="mt-3 text-xs font-medium uppercase tracking-wider text-ink-muted">Statut</p>
                <p className="mt-1 text-sm text-ink">{selectedVehicle.status === "pending_inspection" ? "En attente d'inspection" : selectedVehicle.status}</p>
              </div>

              {/* Photos */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-ink font-heading">Photos ({photos.length})</h3>
                {photosLoading ? (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="aspect-square animate-pulse rounded-lg bg-surface" />
                    ))}
                  </div>
                ) : photos.length === 0 ? (
                  <p className="mt-2 text-xs text-ink-muted">Aucune photo.</p>
                ) : (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg bg-surface">
                        {!imgError[photo.id] ? (
                          <Image
                            src={getPublicUrl("vehicle-photos", photo.storage_path)}
                            alt="Vehicle photo"
                            fill
                            className="object-cover"
                            sizes="120px"
                            onError={() => setImgError((p) => ({ ...p, [photo.id]: true }))}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-ink-muted">Erreur</div>
                        )}
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-white hover:bg-red-700"
                          title="Supprimer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Inspection Document */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-ink font-heading">Document d'inspection</h3>
                {inspectionDoc ? (
                  <a
                    href={getPublicUrl("vehicle-documents", inspectionDoc.storage_path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 rounded-lg border border-line bg-paper px-4 py-2.5 text-sm font-medium text-accent hover:bg-surface"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                    {inspectionDoc.file_name ?? "Rapport d'inspection"}
                  </a>
                ) : (
                  <p className="mt-2 text-xs text-ink-muted">Aucun document d'inspection.</p>
                )}
              </div>

              {/* Actions */}
              {selectedVehicle.status === "pending_inspection" && (
                <div className="mt-8 flex flex-col gap-3">
                  <button onClick={() => handleApprove(selectedVehicle.id)} disabled={processing} className="w-full rounded-md bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60">
                    {processing ? "Traitement..." : "Approuver et mettre en ligne"}
                  </button>
                  <button onClick={() => { toast.error("Véhicule rejeté"); setSelectedVehicle(null); }} disabled={processing} className="w-full rounded-md border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60">
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
