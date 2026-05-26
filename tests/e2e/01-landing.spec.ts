import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads with brand name", async ({ page }) => {
    await expect(page.locator("text=MazadAuto").first()).toBeVisible();
    await expect(page.locator("h1")).toContainText("enchères");
    await expect(page.locator("h1")).toContainText("automobile");
  });

  test("has navigation links", async ({ page }) => {
    // Scope to nav to avoid footer duplicate
    await expect(page.locator('nav >> a:has-text("Enchères en cours")')).toBeVisible();
    await expect(page.locator('nav >> a:has-text("Vendre un véhicule")')).toBeVisible();
  });

  test("CTA buttons are visible", async ({ page }) => {
    await expect(page.locator('a:has-text("Enchérir maintenant")').first()).toBeVisible();
    await expect(page.locator('a:has-text("Vendre un véhicule")').first()).toBeVisible();
  });

  test("How It Works section renders", async ({ page }) => {
    await expect(page.locator('h2:has-text("Comment")')).toBeVisible();
  });

  test("Footer renders", async ({ page }) => {
    await expect(page.locator('footer, a:has-text("Conditions")').first()).toBeVisible();
  });
});
