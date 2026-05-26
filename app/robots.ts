import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/encheres", "/encheres/"],
        disallow: ["/dashboard/", "/api/", "/connexion", "/inscription"],
      },
    ],
    sitemap: "https://mazadauto.tn/sitemap.xml",
    host: "https://mazadauto.tn",
  };
}
