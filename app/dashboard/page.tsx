import "@/lib/supabase/suppress-warnings";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export default async function DashboardRootPage() {
  const cookieStore = await cookies();
  const testMode = cookieStore.get("__test_mode")?.value === "true";

  const supabase = await createClient();
  // Use getSession() to auto-refresh expired access tokens
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  if (!user && !testMode) {
    redirect("/connexion");
  }

  // In test mode without a real user, default to buyer dashboard
  if (!user && testMode) {
    redirect("/dashboard/acheteur");
  }

  // Use admin client to bypass RLS infinite-recursion on profiles
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  if (profile?.role === "admin") {
    redirect("/dashboard/admin");
  } else if (profile?.role === "seller") {
    redirect("/dashboard/vendeur");
  } else {
    redirect("/dashboard/acheteur");
  }
}
