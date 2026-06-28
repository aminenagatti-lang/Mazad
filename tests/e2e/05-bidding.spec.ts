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
    // Current price is 42 000 DT, min bid is +200 DT = 42 200 DT
    await page.fill('input[type="number"]', "43000");
    await page.click('[data-testid="bid-submit"]');
    // Confirm modal
    await page.click('[data-testid="confirm-bid-modal"] button:has-text("Confirmer")');
    await expect(page.locator('[data-testid="confirm-bid-modal"]')).not.toBeVisible();
    // Check that price updated
    await expect(page.locator('[data-testid="bid-card"]')).toContainText("43 000 DT");
  });

  test("Bid updates price display in test mode", async ({ page }) => {
    await page.goto("/encheres/peugeot-308-allure-2020", { waitUntil: "networkidle" });
    await expect(page.locator('[data-testid="bid-card"] p.text-3xl.font-heading')).toContainText("42 000");
    await page.fill('input[type="number"]', "43500");
    await page.click('[data-testid="bid-submit"]');
    await page.click('[data-testid="confirm-bid-modal"] button:has-text("Confirmer")');
    await expect(page.locator('[data-testid="confirm-bid-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="bid-card"] p.text-3xl.font-heading')).toContainText("43 500");
  });

  test("Can place quick bid +200 in test mode", async ({ page }) => {
    await page.goto("/encheres/peugeot-308-allure-2020", { waitUntil: "networkidle" });
    await page.click('[data-testid="bid-quick-200"]');
    await page.click('[data-testid="confirm-bid-modal"] button:has-text("Confirmer")');
    await expect(page.locator('[data-testid="confirm-bid-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="bid-card"]')).toContainText("42 200 DT");
  });

  test("Can place quick bid +500 in test mode", async ({ page }) => {
    await page.goto("/encheres/peugeot-308-allure-2020", { waitUntil: "networkidle" });
    await page.click('[data-testid="bid-quick-500"]');
    await page.click('[data-testid="confirm-bid-modal"] button:has-text("Confirmer")');
    await expect(page.locator('[data-testid="confirm-bid-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="bid-card"]')).toContainText("42 500 DT");
  });

  test("Can place quick bid +1000 in test mode", async ({ page }) => {
    await page.goto("/encheres/peugeot-308-allure-2020", { waitUntil: "networkidle" });
    await page.click('[data-testid="bid-quick-1000"]');
    await page.click('[data-testid="confirm-bid-modal"] button:has-text("Confirmer")');
    await expect(page.locator('[data-testid="confirm-bid-modal"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="bid-card"]')).toContainText("43 000 DT");
  });
});

test.describe("Bidding Flow — Without Test Mode", () => {
  test("Shows login prompt when not authenticated", async ({ page }) => {
    await page.goto("/encheres/peugeot-308-allure-2020", { waitUntil: "networkidle" });
    await expect(page.locator('text=Enchère actuelle').first()).toBeVisible();
    await expect(page.locator('text=Connectez-vous pour enchérir')).toBeVisible();
  });
});
