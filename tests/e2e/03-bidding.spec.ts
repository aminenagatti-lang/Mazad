// E2E: Bidding flow
// Uncomment when Playwright is installed

// import { test, expect } from "@playwright/test";

// test.describe("Bidding", () => {
//   test("Cannot bid without login", async ({ page }) => {
//     await page.goto("/encheres");
//     await page.locator('[data-testid="vehicle-card"]').first().click();
//     await expect(
//       page.locator("text=Connectez-vous pour enchérir")
//     ).toBeVisible();
//   });

//   test("KYC pending blocks bidding", async ({ page }) => {
//     // Login as unverified buyer (mock scenario)
//     await page.goto("/connexion");
//     await page.fill('[name="email"]', "unverified@test.com");
//     await page.fill('[name="password"]', "Test1234!");
//     await page.click('[data-testid="login-submit"]');
//     await page.goto("/encheres");
//     await page.locator('[data-testid="vehicle-card"]').first().click();
//     await expect(
//       page.locator("text=vérification est en cours")
//     ).toBeVisible();
//   });
// });
