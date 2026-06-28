/**
 * Suppress the verbose Supabase warning about getSession() insecurity.
 * In SSR/Next.js context, getSession() is the correct way to refresh
 * expired tokens via cookies. The warning is intended for client-side
 * localStorage usage and creates noise in server logs.
 */
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const msg = typeof args[0] === "string" ? args[0] : "";
  if (
    msg.includes("Using the user object as returned from supabase.auth.getSession") ||
    msg.includes("supabase.auth.getSession() or from some supabase.auth.onAuthStateChange")
  ) {
    return;
  }
  originalWarn.apply(console, args as [string, ...unknown[]]);
};
