"use client";

import { useState, useMemo } from "react";

const notifications = [
  { id: 1, type: "auction", title: "Surenchéri sur Peugeot 308", body: "Quelqu'un a dépassé votre enchère de 500 DT.", read: false, date: "Il y a 10 min" },
  { id: 2, type: "system", title: "KYC approuvé", body: "Votre vérification d'identité est terminée.", read: false, date: "Il y a 2h" },
  { id: 3, type: "auction", title: "Enchère terminée", body: "Votre enchère sur Ford Ranger n'a pas été remportée.", read: true, date: "Hier" },
  { id: 4, type: "system", title: "Bienvenue sur MazadAuto", body: "Complétez votre profil pour commencer.", read: true, date: "Il y a 3j" },
];

export default function BuyerNotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "auction" | "system">("all");
  const [items, setItems] = useState(notifications);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "unread") return items.filter((n) => !n.read);
    if (filter === "auction") return items.filter((n) => n.type === "auction");
    if (filter === "system") return items.filter((n) => n.type === "system");
    return items;
  }, [filter, items]);

  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink font-heading">Notifications</h1>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm font-semibold text-accent hover:text-accent-dark">
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {([
          { key: "all" as const, label: "Toutes" },
          { key: "unread" as const, label: `Non lues (${unreadCount})` },
          { key: "auction" as const, label: "Enchères" },
          { key: "system" as const, label: "Système" },
        ]).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === f.key ? "bg-accent text-white" : "bg-surface text-ink-secondary hover:bg-elevated"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 w-full animate-pulse rounded-xl bg-surface" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-paper py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-muted">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/><line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
            <p className="mt-3 text-sm font-medium text-ink-secondary">Aucune notification pour le moment</p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-4 rounded-xl border p-4 ${
                n.read ? "border-line bg-paper" : "border-accent/20 bg-accent-tint/30"
              }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${n.type === "auction" ? "bg-accent text-white" : "bg-surface text-ink"}`}>
                {n.type === "auction" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8.5 14.5 2 2 5-5"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${n.read ? "text-ink" : "text-ink"}`}>{n.title}</p>
                <p className="mt-0.5 text-xs text-ink-secondary">{n.body}</p>
                <p className="mt-1.5 text-[10px] text-ink-muted">{n.date}</p>
              </div>
              {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
