import { test, expect } from "@playwright/test";
// =============================== Scenario: GO to Amazon> Check title > Prints links and count of it > Open Menu, Print Menu Items and close it > GO To serach , Type Iphone 17Pro , Prints all Options , Choose Iphone 17 promax 256gb > On the Page Choose Orange colour checkbox and prints all suggestions click on first option 
//> print description  and add to cart > click on cart ,addtocart page verify added in cart ,verify item name,quantity, price .

// ===============================
// TEST 1: Verify Page Title
// ===============================
test("Has correct page title", async ({ page, context }) => {

    await page.goto("https://www.amazon.in/ref=nav_logo");
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Soft assert → test continues even if it fails
    await expect.soft(page).toHaveTitle(
        "Online Shopping site in India: Shop Online for Mobiles, Books, Watches, Shoes and More - Amazon.in"
    );

    console.log("✔ Test continues even if title does NOT match");

    // Get all window handles (tabs)
    const pages = context.pages();
    console.log("Total tabs: " + pages.length);

});

// ===============================
// TEST 2: Count all links on page
// ===============================

test("Count all links and print them", async ({ page }) => {

    await page.goto("https://www.amazon.in/ref=nav_logo");
    await page.setViewportSize({ width: 1920, height: 1080 });

    const links = await page.$$('a');

    let count = 0;
    console.log("\n===== ALL LINKS ON PAGE =====");

    for (const link of links) {
        const linktext = await link.textContent();
        console.log(linktext);
        count++;
    }

    console.log("Total links found: " + count);
    console.log("====================================\n");
});



// ===============================
// TEST 3: Open Menu, Print Menu Items
// ===============================
test("Open hamburger menu & print all menu options", async ({ page }) => {

    await page.goto("https://www.amazon.in/ref=nav_logo");
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Click on Menu icon
    const menuButton = page.locator("//a[@href='javascript: void(0)']");
    await menuButton.click();

    // Wait for menu to appear
    await page.waitForSelector("#hmenu-content");

    const menuItems = await page
        .locator("//div[@id='hmenu-canvas']//a[contains(@class,'hmenu-item')]")
        .allInnerTexts();

    console.log("\n===== MENU OPTIONS =====");

    menuItems.forEach((text, index) => {
        console.log(`${index + 1}. ${text}`);
    });


    console.log("=========================");

    // Close menu
    await page.click('#hmenu-close-icon');
});


// ===============================
// TEST 4: GO To serach , Type Iphone 17Pro , Prints all Options , Choose Iphone 17 promax 256gb
// ===============================

test("Open Search bar Type : Iphone 17Pro & Print all options", async ({ page }) => {

    await page.goto("https://www.amazon.in/ref=nav_logo");
    await page.setViewportSize({ width: 1920, height: 1080 });

    // GO to Search and Type Iphone17 pro
    //const searchBox = page.locator('input#twotabsearchtextbox');       
    const searchBox = page.getByRole('searchbox', { name: 'Search Amazon.in' });   //both locators work

    await searchBox.fill("iPhone 17 Pro");
    await expect(searchBox).toHaveValue("iPhone 17 Pro");         // Assert to Check to Enter Input as Iphone...  Its input so I used here  toHaveValue
    await page.waitForTimeout(3000);

    // Wait for suggestions list
    await page.waitForSelector('//div[contains(@id,"sac-suggestion-row")]');

    //Define Locator and Suggestionslist array 
    const suggestionLocator = await page.locator('//div[contains(@class,"s-suggestion-ellipsis-direction")]');
    const suggestionslist = await page.locator('//div[contains(@class,"s-suggestion-ellipsis-direction")]').allInnerTexts();

    // Print suggestions
    suggestionslist.forEach((item, index) => {
        console.log(`${index + 1}. ${item}`);   // make sure use Backticks no signle quotes backtics At Below ESC key in Keyboard before 1 >> ``

    });

    // Choose Iphone 17 Pro max 256gb out of the list     

    for (let i = 0; i < suggestionslist.length; i++) {

        if (suggestionslist[i].toLowerCase().includes("iphone 17 pro max 256")) {

            console.log(`\nClicking on suggestion: ${suggestionslist[i]}`);

            await suggestionLocator.nth(i).click();
            break;
        }
    }

    // Verify you are on Page of Iphone17 Pro max 256gb
    const searchresult = page.locator('//span[@class="a-color-state a-text-bold"]');    //   searchresult → locator object          and  make sure once single quote and next time double quotes in xpath 
    const text = await searchresult.textContent();                                      //   text → string (fetched text from locator) ----text print from const string   -- NOT USEFUL HERE

    // Assert partial match (case-insensitive)
    await expect.soft(searchresult).toContainText(
        "iphone 17 pro max 256gb",
        { ignoreCase: true }
    );
    console.log("\nUser lands on Correct Page of :", text);
    ///////////////////////////

    // Click product & catch new tab
    const [newTab] = await Promise.all([
        page.waitForEvent("popup"),
        page.getByRole('link', { name: /iPhone 17 Pro Max 256 GB/i }).first().click()     // whatever First link I get on page result either Orange or deep Blue colour Iphone 
    ]);

    await newTab.waitForLoadState();  // ensure tab loaded
    await newTab.setViewportSize({ width: 1920, height: 1080 });
    console.log("\nProduct is opened in new Tab Successfully")

    // Click Add to Cart on the new tab
    await newTab.getByRole('button', { name: /Add to Cart/i }).first().click();


    // METHOD 1: Check "Added to Cart"
    const successMsg = newTab.locator('#NATC_SMART_WAGON_CONF_MSG_SUCCESS');
    await expect(successMsg).toBeVisible();
    console.log("\nProduct added to cart successfully Checked")


    // Print out product Name,Quantity, subtotal:(//span[@class="a-price sw-subtotal-amount"])
// Get Colour
const colour = await newTab
  .locator("//li[contains(@class,'sw-product-variation')]//span[contains(text(),'Colour')]/following-sibling::span")
  .textContent();

// Get Size
const size = await newTab
  .locator("//li[contains(@class,'sw-product-variation')]//span[contains(text(),'Size')]/following-sibling::span")
  .textContent();

// console.log("Product Variant:", `${colour.trim()} ${size.trim()}`);

// Extract cart subtotal
const subtotal = await newTab
  .locator('//span[@class="a-price sw-subtotal-amount"]//span[@class="a-offscreen"]')
  .textContent();

console.log("====================================");
console.log("🛒 Product Added to Cart Details:");
console.log("📦 Product Variant :", `${colour.trim()} ${size.trim() }}`);
console.log("💰 Cart Subtotal :", subtotal?.trim());
console.log("====================================");
console.log("/n============👌Cheers👌================");

});