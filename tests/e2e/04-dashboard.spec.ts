import { test, expect } from "@playwright/test";
import { activateTestMode, deactivateTestMode } from "./helpers/test-mode";

test.describe("Dashboards — Test Mode", () => {
  test.beforeEach(async ({ page }) => {
    await activateTestMode(page);
  });

  test.afterEach(async ({ page }) => {
    await deactivateTestMode(page);
  });

  test("Buyer dashboard loads without auth", async ({ page }) => {
    await page.goto("/dashboard/acheteur", { waitUntil: "domcontentloaded" });
    await expect(page.locator("text=Dashboard acheteur")).toBeVisible();
    await expect(page.locator("text=Enchères actives")).toBeVisible();
  });

  test("Seller dashboard loads without auth", async ({ page }) => {
    await page.goto("/dashboard/vendeur", { waitUntil: "domcontentloaded" });
    await expect(page.locator("text=Vue d'ensemble vendeur")).toBeVisible();
    await expect(page.locator("text=Véhicules actifs")).toBeVisible();
  });

  test("Admin dashboard loads without auth", async ({ page }) => {
    await page.goto("/dashboard/admin", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1:has-text(\"Vue d'ensemble\")")).toBeVisible();
    await expect(page.locator("text=Total utilisateurs")).toBeVisible({ timeout: 15000 });
  });

  test("Buyer profile page loads", async ({ page }) => {
    await page.goto("/dashboard/acheteur/profil", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1:has-text('Mon profil')")).toBeVisible();
    await expect(page.locator('[data-testid="edit-profile"]')).toBeVisible();
  });

  test("Notifications page loads", async ({ page }) => {
    await page.goto("/dashboard/acheteur/notifications", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1:has-text('Notifications')")).toBeVisible();
  });

  test("Add vehicle page loads in seller dashboard", async ({ page }) => {
    await page.goto("/dashboard/vendeur/vehicules/nouveau", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1:has-text('Ajouter')")).toBeVisible();
  });
});

test.describe("Dashboards — Without Test Mode", () => {
  test("Buyer dashboard redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/dashboard/acheteur", { waitUntil: "domcontentloaded" });
    await page.waitForURL(/connexion/, { timeout: 10000 });
    await expect(page.locator("h1")).toContainText("Connexion");
  });

  test("Admin dashboard redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/dashboard/admin", { waitUntil: "domcontentloaded" });
    await page.waitForURL(/connexion/, { timeout: 10000 });
    await expect(page.locator("h1")).toContainText("Connexion");
  });
});
