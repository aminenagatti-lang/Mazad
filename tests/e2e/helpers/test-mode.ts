import { test, expect, type Page } from "@playwright/test";

export async function activateTestMode(page: Page) {
  await page.goto("/");
  // Programmatically enable test mode via localStorage + cookie (more reliable than UI click)
  await page.evaluate(() => {
    localStorage.setItem("__mazad_test_mode", "true");
    document.cookie = "__test_mode=true; path=/; max-age=86400";
  });
  await page.reload();
  await page.waitForLoadState("networkidle");
  // Verify banner appeared
  await expect(page.locator('text=Mode Test actif')).toBeVisible();
}

export async function deactivateTestMode(page: Page) {
  await page.goto("/");
  const btn = page.locator('button:has-text("Quitter le Mode Test")').first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
    await page.waitForLoadState("networkidle");
  }
  // Clear localStorage + cookie just in case
  await page.evaluate(() => {
    localStorage.removeItem("__mazad_test_mode");
    document.cookie = "__test_mode=; path=/; max-age=0";
  });
}
