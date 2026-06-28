import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("http://localhost:3000/encheres/peugeot-308-allure-2020");
  await page.waitForTimeout(5000);

  await page.screenshot({ path: "C:/Users/SCD-UM/next-app/scripts/screenshot-detail-v2.png", fullPage: true });
  console.log("Screenshot saved");
  await browser.close();
})();
