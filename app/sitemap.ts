import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Fetch active vehicles from Supabase
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("slug, updated_at")
    .eq("status", "active");

  const vehicleUrls = (vehicles ?? []).map((v) => ({
    url: `https://mazadauto.tn/encheres/${v.slug}`,
    lastModified: v.updated_at ? new Date(v.updated_at) : new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://mazadauto.tn",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://mazadauto.tn/encheres",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: "https://mazadauto.tn/portefeuille",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://mazadauto.tn/connexion",
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://mazadauto.tn/inscription",
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...vehicleUrls,
  ];
}
