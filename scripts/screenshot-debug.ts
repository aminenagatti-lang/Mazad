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

  await page.goto("http://localhost:3000/");
  await page.waitForTimeout(3000);
  
  const errorText = await page.locator("text=Une erreur est survenue").isVisible().catch(() => false);
  if (errorText) {
    console.log("Error boundary visible");
    // Try to click Réessayer to see underlying error in console
    await page.click("text=Réessayer");
    await page.waitForTimeout(2000);
  }
  
  await page.screenshot({ path: "C:/Users/SCD-UM/next-app/scripts/screenshot-home-debug.png", fullPage: false });
  console.log("Screenshot saved");
  await browser.close();
})();
