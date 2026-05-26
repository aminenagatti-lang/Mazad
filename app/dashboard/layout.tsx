"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useNotifications } from "@/lib/supabase/realtime";
import { getCurrentUser, signOut, type UserProfile } from "@/lib/dashboard/data";
import Link from "next/link";

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Il y a ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `Il y a ${days}j`;
  return new Date(date).toLocaleDateString("fr-FR");
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const buyerItems = [
  { label: "Dashboard", href: "/dashboard/acheteur", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { label: "Mes enchères", href: "/dashboard/acheteur", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m8.5 14.5 2 2 5-5"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg> },
  { label: "Favoris", href: "/dashboard/acheteur", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  { label: "Mon profil", href: "/dashboard/acheteur/profil", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { label: "Notifications", href: "/dashboard/acheteur/notifications", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> },
  { label: "Se déconnecter", href: "#logout", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> },
];

const sellerItems = [
  { label: "Vue d'ensemble", href: "/dashboard/vendeur", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { label: "Mes véhicules", href: "/dashboard/vendeur", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-5.25a1 1 0 0 0-1.76 0L9 11 4.84 11.86a1 1 0 0 0-.84.99V16h3"/><path d="M19 8v4"/><path d="M4 8v4"/><circle cx="6.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/></svg> },
  { label: "Ajouter un véhicule", href: "/dashboard/vendeur/vehicules/nouveau", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>, highlight: true },
  { label: "Mes ventes", href: "/dashboard/vendeur", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 14h.01"/><path d="M12 14h.01"/><path d="M15 14h.01"/></svg> },
  { label: "Mon profil", href: "/dashboard/vendeur/profil", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { label: "Notifications", href: "/dashboard/vendeur", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> },
  { label: "Se déconnecter", href: "#logout", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> },
];

const adminItems = [
  { label: "Vue d'ensemble", href: "/dashboard/admin", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { label: "KYC en attente", href: "/dashboard/admin/kyc", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  { label: "Véhicules", href: "/dashboard/admin/vehicules", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-5.25a1 1 0 0 0-1.76 0L9 11 4.84 11.86a1 1 0 0 0-.84.99V16h3"/><path d="M19 8v4"/><path d="M4 8v4"/><circle cx="6.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/></svg> },
  { label: "Enchères", href: "/dashboard/admin", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m8.5 14.5 2 2 5-5"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg> },
  { label: "Utilisateurs", href: "/dashboard/admin/utilisateurs", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label: "Virements", href: "/dashboard/admin/virements", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
  { label: "Se déconnecter", href: "#logout", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> },
];

interface NavItem {
  label: string;
  href: string;
  icon: ReactElement;
  badge?: number;
  highlight?: boolean;
}

function Sidebar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-ink text-white lg:flex">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-0 text-lg font-bold tracking-tight">
          <span className="text-white">Mazad</span>
          <span className="text-accent">Auto</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return item.href === "#logout" ? (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "border-l-2 border-accent bg-white/5 text-accent"
                  : "border-l-2 border-transparent text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </a>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "border-l-2 border-accent bg-white/5 text-accent"
                  : "border-l-2 border-transparent text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function NotificationBell({ userId }: { userId: string }) {
  const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications(userId);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const getIcon = (type: string) => {
    const map: Record<string, string> = {
      outbid: "🔴",
      won: "🏆",
      kyc_approved: "✅",
      kyc_rejected: "❌",
      auction_ending: "⏰",
      vehicle_live: "🚗",
      system: "ℹ️",
    };
    return map[type] || "ℹ️";
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        data-testid="notifications-bell"
        className="relative flex h-11 w-11 items-center justify-center rounded-full p-2 text-ink-secondary transition-colors hover:bg-surface"
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-line bg-paper shadow-lg">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="text-sm font-bold text-ink">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-accent hover:text-accent-dark"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-ink-muted">
                Aucune notification
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markOneRead(n.id)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface ${
                    n.read ? "bg-gray-50/50" : "bg-white"
                  }`}
                >
                  <span className="mt-0.5 text-lg">{getIcon(n.type)}</span>
                  <div className="flex-1">
                    <p className={`text-sm ${n.read ? "font-medium text-ink-secondary" : "font-bold text-ink"}`}>
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="mt-0.5 text-xs text-ink-muted">{n.body}</p>
                    )}
                    <p className="mt-1 text-[11px] text-ink-muted">
                      {timeAgo(n.created_at)}
                    </p>
                  </div>
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                </button>
              ))
            )}
          </div>

          <div className="border-t border-line px-4 py-2 text-right">
            <Link
               href="/dashboard/acheteur/notifications"
               className="text-xs font-medium text-accent hover:text-accent-dark"
             >
               Voir tout →
             </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const [mobileNav, setMobileNav] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const isAdmin = pathname.includes("/dashboard/admin");
  const isSeller = pathname.includes("/dashboard/vendeur");
  const items = isAdmin ? adminItems : isSeller ? sellerItems : buyerItems;

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u) {
        setUserId(u.id);
        setProfile(u);
      }
    });
  }, []);

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  const displayName = profile
    ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || profile.email
    : "";

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar items={items} />

      {/* Mobile top bar */}
      <header className="flex h-14 items-center justify-between border-b border-line bg-paper px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-0 text-lg font-bold tracking-tight">
          <span className="text-ink">Mazad</span>
          <span className="text-accent">Auto</span>
        </Link>
        <div className="flex items-center gap-2">
          {userId && <NotificationBell userId={userId} />}
          <button onClick={() => setMobileNav((s) => !s)} className="p-2 text-ink">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink p-6 text-white lg:hidden">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold tracking-tight">MazadAuto</span>
            <button onClick={() => setMobileNav(false)} className="p-2 text-white/70">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <nav className="mt-8 flex flex-col gap-2">
            {items.map((item) =>
              item.href === "#logout" ? (
                <a key={item.label} href={item.href} onClick={() => setMobileNav(false)} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-white/70">
                  {item.icon}
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} href={item.href} onClick={() => setMobileNav(false)} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-white/70">
                  {item.icon}
                  {item.label}
                </Link>
              )
            )}
            <button onClick={handleLogout} className="mt-4 flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Se déconnecter
            </button>
          </nav>
        </div>
      )}

      <main className="flex-1 bg-paper">
        {/* Desktop top bar */}
        <div className="hidden items-center justify-between border-b border-line bg-paper px-8 py-3 lg:flex">
          <div className="text-sm text-ink-secondary">
            {displayName && <span>Bienvenue, <span className="font-semibold text-ink">{displayName}</span></span>}
          </div>
          <div className="flex items-center gap-4">
            {userId && <NotificationBell userId={userId} />}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-ink-secondary transition-colors hover:bg-surface hover:text-ink"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Déconnexion
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
