import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { OrgJsonLd } from "@/components/seo/org-jsonld";
import { TestModeBanner } from "@/components/ui/test-mode-banner";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mazadauto.tn"),
  title: {
    default: "MazadAuto — Enchères automobile en Tunisie",
    template: "%s — MazadAuto",
  },
  description:
    "Achetez et vendez des véhicules aux enchères en Tunisie. Particuliers et professionnels. Inspection certifiée, paiement sécurisé.",
  keywords: [
    "enchères voiture tunisie",
    "vente voiture enchère tunisie",
    "achat voiture tunisie",
    "mazad sayarat",
    "occasion tunisie",
    "flotte véhicules tunisie",
    "mazadauto",
  ],
  authors: [{ name: "MazadAuto", url: "https://mazadauto.tn" }],
  creator: "MazadAuto",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fr_TN",
    url: "https://mazadauto.tn",
    siteName: "MazadAuto",
    title: "MazadAuto — Enchères automobile en Tunisie",
    description: "La première plateforme d'enchères automobile en Tunisie.",
    images: [
      {
        url: "/api/og?title=MazadAuto",
        width: 1200,
        height: 630,
        alt: "MazadAuto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MazadAuto — Enchères automobile en Tunisie",
    description: "Achetez et vendez des véhicules aux enchères en Tunisie.",
    images: ["/api/og?title=MazadAuto"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${bricolage.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-full">
        <TestModeBanner />
        <OrgJsonLd />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
