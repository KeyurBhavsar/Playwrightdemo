import { link } from "fs";

const { test, expect } = require('@playwright/test');  // For Download all require Libraries 

test('MyTest-Orange HRM Web', async({page}) => {

    // 1. Go to the website

await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

await page.setViewportSize({ width: 1920, height: 1080 });

  // Locate the Username field and type the username
  await page.fill('input[name="username"]','Admin');
  // Locate the Password field and type the password
  await page.fill('input[name="password"]','admin123');
  // Click on the Login button
  //await page.click('button[type="submit"]');
  const loginBtn = await page.getByRole('button', { name: 'Login' });

  // Check if button is visible
  await expect(loginBtn).toBeVisible();

  // Check correct text
  await expect(loginBtn).toHaveText('Login');

  console.log("✔ Login button verified");
  await loginBtn.click();

  // await page.click('//button[normalize-space()="Login"]');


  // Print message
  console.log("🎉 Login successful!");

// Print homepage title 
const pagetitle = await page.title();
console.log("Home page title is : ", pagetitle);
// Verify Title
  await expect(page).toHaveTitle("OrangeHRM");    
  //await expect.soft(page).toHaveTitle("OrangeHRM");  // softassertion used here even if test fails code go on
  //We can use Try and catch block 

console.log("👍 Title verified successfully!",);



//assertequal check  OrangeHRM

    // 8. Scroll bottom of the page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // 9. Scroll top of the page
    await page.evaluate(() => window.scrollTo(0, 0));

// Print message
console.log("🎉 Page Activity Scroll successful!");

    //refresh the page 
await page.reload();


// 10. Hover over "Leave" menu in sidebar and click
await page.getByRole('link', { name: 'Leave' }).click();
// Print message
console.log("🎉 Click on Leave successful!");

//--------------------------------------------------------------------------------------------------------------------------------------

// ================================
// FROM DATE  (1st Input Box)
// ================================
const fromDate = page.locator("((//input[@placeholder='yyyy-dd-mm'])[1])");
await fromDate.click();
await fromDate.fill("2025-11-12");
console.log("🎉 From Date entered successfully!");


// ================================
// TO DATE  using following:: XPath
// (This is the better & stable method)  
// ================================
const toDate = page.locator("((//input[@placeholder='yyyy-dd-mm'])[2])");
await toDate.click();
await toDate.fill("2025-12-12");
console.log("🎉 TO Date entered successfully!");
console.log("🎉 Cheers !! ");


// page.locator("(//i[contains(@class,'oxd-select-text--arrow')])[1]").click();



const statusdropdown= await page.locator("(//div[@class='oxd-select-text--after']//i[contains(@class,'oxd-select-text--arrow')])[1]");

const rejected=page.locator("//span[contains(@class,'oxd-multiselect-chips-selected') and normalize-space()='Rejected']");
const rejectedCloseIcon = page.locator("//span[normalize-space()='Rejected']//i[contains(@class,'oxd-icon bi-x --clear')]");

const pending= page.locator("//span[contains(@class,'oxd-chip oxd-chip--default oxd-multiselect-chips-selected') and normalize-space()='Pending Approval']");
const pendingCloseIcon = page.locator("//span[normalize-space()='Pending Approval']//i[contains(@class,'oxd-icon bi-x --clear')]");



// Try catch block       if locator rejected is there then click on  icon cross *      then dropdown select 
try { 

  if (await rejected.isVisible()) {
      console.log("Removing Rejected chip...");
      await rejectedCloseIcon.click();
      
  }

  // 🟦 If Pending Approval chip is visible → remove it
  if (await pending.isVisible()) {
      console.log("Removing Pending Approval chip...");
      await pendingCloseIcon.click();
  }
   await page.waitForTimeout(2000)
  // 🟦 After clearing chips → click dropdown
  console.log("Opening Status dropdown...");
  await statusdropdown.click();

} catch (error) {
  console.error("⚠ Error while removing chips: ", error);
}d

await page.keyboard.press('ArrowDown');
await page.keyboard.press('Enter');
await page.waitForTimeout(10000);


console.log("✔ Dropdown opened");

// ================================
// SELECT 'Rejected'
// ================================
//await page.locator("//i[contains(text(), 'Rejected')]").click();
console.log("✔ 'Rejected' option selected");


const pastEmployeeSwitch = page.locator("//label[contains(@class,'oxd-switch-wrapper')]//span[contains(@class,'oxd-switch-input')]");

await page.waitForTimeout(2000);
await pastEmployeeSwitch.click();
});