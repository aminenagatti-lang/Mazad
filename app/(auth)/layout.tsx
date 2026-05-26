import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "../globals.css";
import Link from "next/link";

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
  title: "MazadAuto — Connexion",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${bricolage.variable} ${inter.variable} antialiased min-h-full`}>
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left panel — brand */}
        <div className="relative hidden flex-col justify-between bg-ink p-10 text-white lg:flex lg:w-[40%]">
          <div>
            <Link href="/" className="flex items-center gap-0 text-xl font-bold tracking-tight">
              <span className="text-white">Mazad</span>
              <span className="text-accent">Auto</span>
            </Link>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight font-heading">
              Achetez et vendez vos véhicules en toute confiance.
            </h2>
          </div>
          <div>
            <p className="text-sm text-white/60">
              2 400+ véhicules adjugés · Tunisie
            </p>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex flex-1 items-center justify-center bg-paper px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
