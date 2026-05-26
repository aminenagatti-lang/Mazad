// Test helpers for authentication
// Uncomment when Playwright is installed

// import type { Page } from "@playwright/test";
// import { expect } from "@playwright/test";

// export const testBuyerData = {
//   firstName: "Mohamed",
//   lastName: "Ben Ali",
//   email: `test+buyer${Date.now()}@mazadauto.test`,
//   phone: "22334455",
//   password: "Test1234!",
// };

// export async function registerBuyer(page: Page, data = testBuyerData) {
//   await page.goto("/inscription");
//   await page.click('[data-testid="choose-buyer"]');
//   await page.fill('[name="firstName"]', data.firstName);
//   await page.fill('[name="lastName"]', data.lastName);
//   await page.fill('[name="email"]', data.email);
//   await page.fill('[name="phone"]', data.phone);
//   await page.fill('[name="password"]', data.password);
//   await page.fill('[name="confirmPassword"]', data.password);
//   await page.check('[name="acceptCgu"]');
//   await page.click('[data-testid="step1-next"]');
//   await page.setInputFiles(
//     '[data-testid="cin-recto-upload"]',
//     "tests/fixtures/mock-id.jpg"
//   );
//   await page.setInputFiles(
//     '[data-testid="cin-verso-upload"]',
//     "tests/fixtures/mock-id.jpg"
//   );
//   await page.click('[data-testid="step2-submit"]');
//   await expect(page.locator('[data-testid="registration-success"]')).toBeVisible();
// }

// export async function loginAs(page: Page, email: string, password: string) {
//   await page.goto("/connexion");
//   await page.fill('[name="email"]', email);
//   await page.fill('[name="password"]', password);
//   await page.click('[data-testid="login-submit"]');
//   await expect(page).toHaveURL("/dashboard/acheteur");
// }
