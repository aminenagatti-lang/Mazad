"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createProfile(payload: Record<string, unknown>) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Non authentifié" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("profiles").insert({
    id: user.id,
    ...payload,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
