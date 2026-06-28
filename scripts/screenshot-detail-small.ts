import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto("http://localhost:3000/encheres/peugeot-308-allure-2020");
  await page.waitForTimeout(5000);

  await page.screenshot({ path: "C:/Users/SCD-UM/next-app/scripts/screenshot-detail-small.png", fullPage: false, type: "jpeg", quality: 80 });
  console.log("Screenshot saved");
  await browser.close();
})();
