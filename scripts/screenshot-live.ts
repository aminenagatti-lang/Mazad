import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("http://localhost:3000/");
  await page.waitForTimeout(5000);

  const el = await page.locator('#encheres');
  await el.screenshot({ path: "C:/Users/SCD-UM/next-app/scripts/screenshot-liveauctions.png" });
  console.log("LiveAuctions screenshot saved");
  await browser.close();
})();
