import { Console, count } from "console";

const { test, expect } = require('@playwright/test');

test('MyTest- ', async ({ page }) => {

    // Go to Website
    await page.goto("https://www.amazon.in/ref=nav_logo");
    await page.setViewportSize({ width: 1920, height: 1080 });  // Please update width & height here ,Window Screen Resolution as per your Device

    // To Verify Page Title 
    // SOFT ASSERT (does NOT stop test if fails)
    await expect.soft(page).toHaveTitle(
        "Online Shopping site in India: Shop Online for Mobiles, Books, Watches, Shoes and More - Amazon.in"
    );
    console.log(" Test continues even if title did NOT match");

    //1.  Check how many links there and PrintOut
    const links = await page.$$('a');

    let count = 0;
    for (const link of links) {

        const linktext = await link.textContent();
        console.log(linktext);
        count++;

    }

    console.log("Total links Found:" + count);
    console.log("-----------------------------------------------------------\n----------------------------------------------------------")

    // 2.  Print Out all menubar options
    const allmenu = page.locator("//a[@href='javascript: void(0)']");
    await allmenu.click();

    //     Wait for menu to appear

    await page.waitForSelector("#hmenu-content");
    const menuItems = await page.locator("//div[@id='hmenu-canvas']//a[contains(@class,'hmenu-item')]").allInnerTexts(); // if you need in single array like paragraph then use alltextContents()


        menuItems.forEach((text, index) => {                 // Logic 1 for Print out all options 
        console.log(`${index + 1}. ${text}`);}
        );

 /*  for (const item of menuItems)                             // Logic 2 : Not Successful : for Print out all options 
    {
        console.log("${index + 1}" + item);
    }
*/
    await page.click('#hmenu-close-icon');          // Click on close Icon of Menu bar 


    console.log("-----------------------------------------------------------\n------------------------------------------------------------")




});

