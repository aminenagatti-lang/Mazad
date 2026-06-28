"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateProfile(
  userId: string,
  updates: Record<string, unknown>
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user.id !== userId) {
    return { success: false, error: "Non authentifié" };
  }

  const { email, id, role, ...safeUpdates } = updates;
  void email;
  void id;
  void role;

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update(safeUpdates)
    .eq("id", userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
