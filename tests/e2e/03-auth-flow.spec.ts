import { test, expect } from "@playwright/test";
import { activateTestMode, deactivateTestMode } from "./helpers/test-mode";

test.describe("Auth Flows", () => {
  test.afterEach(async ({ page }) => {
    await deactivateTestMode(page);
  });

  test("Login page loads", async ({ page }) => {
    await page.goto("/connexion", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toContainText("Connexion");
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-submit"]')).toBeVisible();
  });

  test("Registration page loads", async ({ page }) => {
    await page.goto("/inscription/nouveau", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toContainText("Créer un compte");
  });

  test("Test mode activation from landing page", async ({ page }) => {
    await activateTestMode(page);
    await expect(page.locator('text=Mode Test actif')).toBeVisible();
  });

  test("Test mode deactivation removes banner", async ({ page }) => {
    await activateTestMode(page);
    await deactivateTestMode(page);
    await expect(page.locator('text=Mode Test actif')).not.toBeVisible();
  });
});
