"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { toast } from "sonner";
import { isTestMode } from "@/lib/test-mode";
import { demoNotifications } from "@/lib/dashboard/demo-data";
import type { Notification } from "@/lib/supabase/types";

function getNotifIcon(type: string): string {
  const icons: Record<string, string> = {
    outbid: "🔴",
    won: "🏆",
    kyc_approved: "✅",
    kyc_rejected: "❌",
    auction_ending: "⏰",
    vehicle_live: "🚗",
    system: "ℹ️",
  };
  return icons[type] || "ℹ️";
}

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!userId) return;

    if (isTestMode()) {
      const notifs = (demoNotifications as unknown) as Notification[];
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => !n.read).length);
      return;
    }

    // Initial fetch
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        if (error) {
          console.error("notifications fetch", error);
          return;
        }
        const notifs = (data ?? []) as unknown as Notification[];
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n) => !n.read).length);
      });

    // Realtime subscription
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev]);
          setUnreadCount((prev) => prev + 1);
          toast(newNotif.title, {
            description: newNotif.body ?? undefined,
            icon: getNotifIcon(newNotif.type),
            duration: 5000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const markAllRead = async () => {
    if (!isTestMode()) {
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markOneRead = async (id: string) => {
    if (!isTestMode()) {
      await supabase.from("notifications").update({ read: true }).eq("id", id);
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return { notifications, unreadCount, markAllRead, markOneRead };
}
