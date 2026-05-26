// E2E: Registration flows
// Uncomment when Playwright is installed

// import { test, expect } from "@playwright/test";
// import { registerBuyer } from "./helpers/auth";

// test.describe("Registration flows", () => {
//   test("Buyer registration — happy path", async ({ page }) => {
//     await registerBuyer(page);
//     await expect(
//       page.locator("text=Votre compte acheteur est créé")
//     ).toBeVisible();
//   });

//   test("Buyer registration — validation errors", async ({ page }) => {
//     await page.goto("/inscription/acheteur");
//     await page.click('[data-testid="step1-next"]');
//     await expect(page.locator("text=Email invalide")).toBeVisible();
//     await expect(page.locator("text=Minimum 8 caractères")).toBeVisible();
//   });
// });
