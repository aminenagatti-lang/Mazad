import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3000/");
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "C:/Users/SCD-UM/next-app/scripts/screenshot-home-full.png", fullPage: true });
  console.log("Full page screenshot saved");
  await browser.close();
})();
