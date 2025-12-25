import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('https://webdriveruniversity.com/Actions/index.html');

  // Verify page title
  await expect(page).toHaveTitle('WebDriver | Actions');
});

test('All Actions MEthods', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('https://webdriveruniversity.com/Actions/index.html');

  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(2000);
  await page.mouse.wheel(0, -1000);

  const item = page.locator('#draggable');
  const target = page.locator('#droppable');

  //1.  Perform drag and drop-------------------------------------------------------
  await item.dragTo(target);

  // Optional verification
  await expect(target).toContainText('Dropped!');
  console.log("Yes Drag and drop successfully done");

  //2.  Perform DoubleClick-------------------------------------------------------------
  const doubleclick = page.locator('#double-click');
  await expect(doubleclick).toBeVisible();  //await expect(locator)
  await doubleclick.dblclick();
  
  console.log("2. Performed DoubleClick !! WEll !!");
  
  //3.  Perform Hover And Print Its InnerTexts------------------------------------------
  const buttons = page.locator('button.dropbtn');
  const buttonCount = await buttons.count();

for (let i = 0; i < buttonCount; i++) {
  await buttons.nth(i).hover();

  const visibleLinks = page.locator('a.list-alert:visible');
  const linkCount = await visibleLinks.count();

  console.log(`Hover ${i + 1} → ${linkCount} link(s)`);

  for (let j = 0; j < linkCount; j++) {
    console.log(await visibleLinks.nth(j).innerText());
  }

  await page.waitForTimeout(2000);
  console.log("3. Performed Hover On Elements !! WEll !!");

}


  //4.  Perform CLICk and HOLD 
  const element = page.locator('#click-box');


await element.click({ delay: 4000 });
console.log("4. Performed CLICk and HOLD !! WEll !!");


/*
await element.hover();
await page.mouse.down();          // press and hold
await page.waitForTimeout(5000);  // hold for 3 seconds
await page.mouse.up();  
*/

});


test('Amazon Scroll Test - Stable', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('https://www.amazon.in/');
  // Handle "Continue shopping" page if shown

  const continueBtn = page.getByRole('button', { name: /continue/i });

  if (await continueBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await continueBtn.click();
  }

  // Scroll to bottom (important for Amazon)
   // SAFE scroll to bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  await page.waitForTimeout(2000); // 2 sec delay
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Wait until footer link appears
  const aboutLink = page.getByRole('link', { name: 'About Amazon' });

await aboutLink.scrollIntoViewIfNeeded();

  await expect(aboutLink).toBeVisible({ timeout: 10000 });
  await aboutLink.click();
  const title = await page.title();
  console.log('Page Title:', title);
  await expect(page).toHaveTitle(/Amazon/);

});