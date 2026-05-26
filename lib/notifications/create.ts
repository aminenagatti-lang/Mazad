import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createNotification({
  userId,
  type,
  title,
  body,
}: {
  userId: string;
  type: string;
  title: string;
  body?: string;
}) {
  try {
    if (!supabaseAdmin) {
      return;
    }
    await supabaseAdmin.from("notifications").insert({
      user_id: userId,
      type,
      title,
      body: body ?? null,
    });
  } catch {
    // ignore
  }
}
