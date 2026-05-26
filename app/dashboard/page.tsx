import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardRootPage() {
  const cookieStore = await cookies();
  const testMode = cookieStore.get("__test_mode")?.value === "true";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && !testMode) {
    redirect("/connexion");
  }

  // In test mode without a real user, default to buyer dashboard
  if (!user && testMode) {
    redirect("/dashboard/acheteur");
  }

  const { data: profile } = await supabase
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
