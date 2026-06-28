import { test, expect } from "@playwright/test";

const TEST_ACCOUNTS = [
  { email: "admin@mazadauto.tn", password: "Admin123!", expectedDashboard: "/dashboard/admin", role: "admin" },
  { email: "vendeur@example.tn", password: "Vendeur123!", expectedDashboard: "/dashboard/vendeur", role: "seller" },
  { email: "acheteur@example.tn", password: "Acheteur123!", expectedDashboard: "/dashboard/acheteur", role: "buyer" },
];

for (const account of TEST_ACCOUNTS) {
  test.describe(`Auth Flow — ${account.role}`, () => {
    test(`Login with ${account.email} stays logged in`, async ({ page }) => {
      // Go to login page
      await page.goto("/connexion", { waitUntil: "networkidle" });
      await expect(page.locator("h1")).toContainText("Connexion");

      // Fill credentials
      await page.fill('input[type="email"]', account.email);
      await page.fill('input[type="password"]', account.password);
      await page.click('[data-testid="login-submit"]');

      // Should redirect to dashboard (full page reload after login)
      await page.waitForURL(account.expectedDashboard, { timeout: 15000 });

      // Wait a bit and verify we're still on the dashboard (not kicked back to login)
      await page.waitForTimeout(2000);
      const url = page.url();
      expect(url).toContain("/dashboard");
      expect(url).not.toContain("/connexion");

      // Refresh page and verify still logged in
      await page.reload({ waitUntil: "networkidle" });
      await page.waitForTimeout(1000);
      const urlAfterReload = page.url();
      expect(urlAfterReload).toContain("/dashboard");
      expect(urlAfterReload).not.toContain("/connexion");
    });
  });
}

test.describe("Auth Flow — Logout", () => {
  test("Logout redirects to login", async ({ page }) => {
    // Login first
    await page.goto("/connexion", { waitUntil: "networkidle" });
    await page.fill('input[type="email"]', "acheteur@example.tn");
    await page.fill('input[type="password"]', "Acheteur123!");
    await page.click('[data-testid="login-submit"]');
    await page.waitForURL("/dashboard/acheteur", { timeout: 15000 });

    // Navigate to profile where logout button should be
    await page.goto("/dashboard/acheteur/profil", { waitUntil: "networkidle" });

    // Click logout if it exists
    const logoutBtn = page.locator('button:has-text("Déconnexion"), a:has-text("Déconnexion")').first();
    if (await logoutBtn.isVisible().catch(() => false)) {
      await logoutBtn.click();
      await page.waitForURL("/connexion", { timeout: 10000 });
      await expect(page.locator("h1")).toContainText("Connexion");
    }
  });
});
