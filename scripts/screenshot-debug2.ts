import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on("console", (msg) => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => {
    console.log(`[PAGE ERROR] ${err.message}`);
  });
  page.on("response", (resp) => {
    if (resp.url().includes("/api/vehicles")) {
      console.log(`[RESPONSE] ${resp.url()} status=${resp.status()}`);
    }
  });

  await page.goto("http://localhost:3000/");
  await page.waitForTimeout(5000);

  // Check DOM
  const cards = await page.locator('[data-testid="vehicle-card"]').count();
  console.log(`Vehicle cards count: ${cards}`);

  const liveSectionText = await page.locator('#encheres').innerHTML().catch(() => 'not found');
  console.log('LiveAuctions HTML length:', liveSectionText.length);

  await page.screenshot({ path: "C:/Users/SCD-UM/next-app/scripts/screenshot-home-debug2.png", fullPage: false });
  console.log("Screenshot saved");
  await browser.close();
})();
