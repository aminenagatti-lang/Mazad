import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Test mode bypass: allow unauthenticated access to all protected routes
  const testModeCookie = request.cookies.get("__test_mode")?.value;
  const isTestMode = testModeCookie === "true";

  // If accessing dashboard without session → redirect to login (unless test mode)
  if (path.startsWith("/dashboard")) {
    if (!user && !isTestMode) {
      return NextResponse.redirect(new URL("/connexion", request.url));
    }

    // If accessing admin routes without admin role (skip in test mode)
    if (path.startsWith("/dashboard/admin") && !isTestMode) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user!.id)
          .single();

        if (!profile || profile.role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch {
        return NextResponse.redirect(new URL("/connexion", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
