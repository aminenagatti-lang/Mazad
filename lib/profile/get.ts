import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Profile } from "@/lib/supabase/types";

export async function getProfileById(userId: string): Promise<Profile | null> {
  try {
    if (!supabaseAdmin) {
      return null;
    }
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error || !data) return null;
    return data as unknown as Profile;
  } catch {
    return null;
  }
}

export async function getUserEmail(userId: string): Promise<string | null> {
  try {
    if (!supabaseAdmin) return null;
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (error || !data) return null;
    return data.user.email ?? null;
  } catch {
    return null;
  }
}
