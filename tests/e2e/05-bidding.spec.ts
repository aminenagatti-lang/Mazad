import { test, expect } from "@playwright/test";
import { activateTestMode, deactivateTestMode } from "./helpers/test-mode";

test.describe("Bidding Flow — Test Mode", () => {
  test.beforeEach(async ({ page }) => {
    await activateTestMode(page);
  });

  test.afterEach(async ({ page }) => {
    await deactivateTestMode(page);
  });

  test("Can view bid card without login in test mode", async ({ page }) => {
    await page.goto("/encheres/peugeot-308-allure-2020", { waitUntil: "networkidle" });
    await expect(page.locator('text=Enchère actuelle').first()).toBeVisible();
    await expect(page.locator('[data-testid="bid-submit"]')).toBeVisible();
  });

  test("Can place a bid in test mode", async ({ page }) => {
    await page.goto("/encheres/peugeot-308-allure-2020", { waitUntil: "networkidle" });
    await expect(page.locator('[data-testid="bid-submit"]')).toBeVisible();
    // Current price is 42 500 DT, min bid is +200 DT = 42 700 DT
    await page.fill('input[type="number"]', "43000");
    await page.click('[data-testid="bid-submit"]');
    // Check that price updated (toast may use a portal, checking DOM update is more reliable)
    await page.waitForTimeout(500);
    await expect(page.locator('[data-testid="bid-card"]')).toContainText("43 000 DT");
  });

  test("Bid updates price display in test mode", async ({ page }) => {
    await page.goto("/encheres/peugeot-308-allure-2020", { waitUntil: "networkidle" });
    const initialPrice = await page.locator('[data-testid="bid-card"] p.font-heading').textContent();
    await page.fill('input[type="number"]', "43500");
    await page.click('[data-testid="bid-submit"]');
    await page.waitForTimeout(500);
    const newPrice = await page.locator('[data-testid="bid-card"] p.font-heading').textContent();
    expect(newPrice).not.toBe(initialPrice);
  });
});

test.describe("Bidding Flow — Without Test Mode", () => {
  test("Shows login prompt when not authenticated", async ({ page }) => {
    await page.goto("/encheres/peugeot-308-allure-2020", { waitUntil: "networkidle" });
    await expect(page.locator('text=Enchère actuelle').first()).toBeVisible();
    await expect(page.locator('text=Connectez-vous pour enchérir')).toBeVisible();
  });
});
