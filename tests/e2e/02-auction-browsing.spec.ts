import { test, expect } from "@playwright/test";

test.describe("Auction Browsing", () => {
  test("Auction list page loads with heading and cards", async ({ page }) => {
    await page.goto("/encheres", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Enchères en cours");
    // Use text-based assertion for vehicle cards
    await expect(page.locator('text=Peugeot 308').first()).toBeVisible();
    await expect(page.locator('text=Renault Clio').first()).toBeVisible();
    await expect(page.locator('text=Volkswagen Passat').first()).toBeVisible();
  });

  test("Filter by marque updates URL and results", async ({ page }) => {
    await page.goto("/encheres", { waitUntil: "networkidle" });
    await page.waitForSelector('[data-testid="filter-marque-Peugeot"]', { timeout: 15000 });
    await page.click('[data-testid="filter-marque-Peugeot"]');
    await expect(page).toHaveURL(/marque=Peugeot/);
    await expect(page.locator('text=Peugeot 308').first()).toBeVisible();
    await expect(page.locator('text=Volkswagen Passat')).not.toBeVisible();
  });

  test("Filter by carburant works", async ({ page }) => {
    await page.goto("/encheres?carburant=diesel", { waitUntil: "networkidle" });
    await expect(page.locator('text=Peugeot 308').first()).toBeVisible();
    await expect(page.locator('text=Volkswagen Passat').first()).toBeVisible();
    // Toyota Corolla is hybride, should not appear
    await expect(page.locator('text=Toyota Corolla')).not.toBeVisible();
  });

  test("Filter by transmission works", async ({ page }) => {
    await page.goto("/encheres?transmission=manuelle", { waitUntil: "networkidle" });
    await expect(page.locator('text=Peugeot 308').first()).toBeVisible();
    // All others are automatique
    await expect(page.locator('text=Renault Clio')).not.toBeVisible();
  });

  test("Sort by price ascending works", async ({ page }) => {
    await page.goto("/encheres?sort=price_asc", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/sort=price_asc/);
    await expect(page.locator('text=Peugeot 308').first()).toBeVisible();
  });

  test("Vehicle detail page loads from list", async ({ page }) => {
    await page.goto("/encheres", { waitUntil: "networkidle" });
    await page.click('a:has-text("Peugeot 308")');
    await page.waitForURL(/encheres\/peugeot-308-allure-2020/);
    await expect(page.locator('text=Peugeot 308').first()).toBeVisible();
    await expect(page.locator('[data-testid="specs-grid"]')).toBeVisible();
  });

  test("Direct vehicle detail page loads", async ({ page }) => {
    await page.goto("/encheres/peugeot-308-allure-2020", { waitUntil: "networkidle" });
    await expect(page.locator('text=Peugeot 308').first()).toBeVisible();
    await expect(page.locator('text=Enchère actuelle').first()).toBeVisible();
    await expect(page.locator('[data-testid="specs-grid"]')).toBeVisible();
  });

  test("Reset filters shows all vehicles", async ({ page }) => {
    // Start filtered, verify limited results
    await page.goto("/encheres?marque=Peugeot&carburant=diesel", { waitUntil: "networkidle" });
    await expect(page.locator('text=Peugeot 308').first()).toBeVisible();
    await expect(page.locator('text=Renault Clio')).not.toBeVisible();

    // Navigate directly to unfiltered page (reset via URL)
    await page.goto("/encheres", { waitUntil: "networkidle" });
    await expect(page.locator('text=10 véhicules disponibles')).toBeVisible();
    await expect(page.locator('text=Renault Clio').first()).toBeVisible();
    await expect(page.locator('text=Volkswagen Passat').first()).toBeVisible();
  });
});
