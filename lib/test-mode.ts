"use client";

export const TEST_MODE_KEY = "__mazad_test_mode";
export const TEST_MODE_COOKIE = "__test_mode";

export function isTestMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(TEST_MODE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setTestMode(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (enabled) {
      localStorage.setItem(TEST_MODE_KEY, "true");
      document.cookie = `${TEST_MODE_COOKIE}=true; path=/; max-age=86400`;
    } else {
      localStorage.removeItem(TEST_MODE_KEY);
      document.cookie = `${TEST_MODE_COOKIE}=; path=/; max-age=0`;
    }
  } catch {
    // ignore
  }
}

export function toggleTestMode(): boolean {
  const next = !isTestMode();
  setTestMode(next);
  return next;
}
