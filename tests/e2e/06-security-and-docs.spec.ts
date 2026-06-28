import { test, expect } from "@playwright/test";

test.describe("Security Headers", () => {
  test("Homepage includes security headers", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.headers()["x-frame-options"]).toBe("DENY");
    expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response?.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(response?.headers()["content-security-policy"]).toContain("default-src 'self'");
  });
});

test.describe("Vehicle Detail — Documents", () => {
  test("Vehicle detail page shows document download link", async ({ page }) => {
    await page.goto("/encheres/peugeot-308-allure-2020", { waitUntil: "networkidle" });
    await expect(page.locator('text=Documents')).toBeVisible();
    await expect(page.locator('a:has-text("controle-technique")')).toBeVisible();
  });
});
