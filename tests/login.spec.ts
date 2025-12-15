const { test, expect } = require('@playwright/test');

test('GUI Form Test - Hover, Fill, Checkboxes', async ({ page }) => {

  // 1. Go to the website
  await page.goto('https://testautomationpractice.blogspot.com/');

  // 2. Hover over GUI Elements title for 2 seconds
  const guiElement = page.locator('h2:has-text("GUI Elements")');
  await page.waitForTimeout(2000); // wait 2 sec

  // 3. Fill the "Name" text field
  await page.fill('input[name="name"]', 'Keyur');

  // 4. Fill the "Email" field
  await page.fill('input[name="email"]', 'keyur.bhavsar@tatvasoft.com');

  // 5. Tick checkboxes
  await page.check('input[type="checkbox"][value="sunday"]');   // Sunday
  await page.check('input[type="checkbox"][value="monday"]');   // Monday

  // 6. Assert value entered
  await expect(page.locator('input[name="name"]')).toHaveValue('Keyur');
  await expect(page.locator('input[name="email"]')).toHaveValue('keyur.bhavsar@tatvasoft.com');
});