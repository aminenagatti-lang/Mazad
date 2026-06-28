/**
 * Client-side vehicle data helpers.
 */

import type { VehicleWithAuction } from "./vehicles";
export type { VehicleWithAuction };

export async function getAllVehiclesClient(): Promise<VehicleWithAuction[]> {
  try {
    const res = await fetch("/api/vehicles", { cache: "no-store" });
    if (!res.ok) {
      console.error("getAllVehiclesClient error:", res.status, await res.text());
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error("getAllVehiclesClient fetch error:", err);
    return [];
  }
}

export async function getVehicleBySlugClient(slug: string): Promise<any | null> {
  try {
    const res = await fetch(`/api/vehicles/${slug}`, { cache: "no-store" });
    if (!res.ok) {
      if (res.status === 404) return null;
      console.error("getVehicleBySlugClient error:", res.status, await res.text());
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("getVehicleBySlugClient fetch error:", err);
    return null;
  }
}
