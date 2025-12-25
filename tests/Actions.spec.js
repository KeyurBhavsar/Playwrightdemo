// ===================================================================
// JAVASCRIPT vs TYPESCRIPT SYNTAX DIFFERENCES
// ===================================================================
// 
// 1. IMPORT STATEMENT:
//    JavaScript (this file):  const { test, expect } = require('@playwright/test');
//    TypeScript (.ts file):  import { test, expect } from '@playwright/test';
//    
//    JavaScript uses: require() - CommonJS module system
//    TypeScript uses: import/from - ES6 module system
//
// 2. FILE EXTENSIONS:
//    JavaScript: .js files
//    TypeScript: .ts files
//
// 3. TYPE ANNOTATIONS:
//    JavaScript: NO type annotations (dynamic typing)
//    TypeScript: Can add type annotations (static typing)
//    
//    Example:
//    JavaScript: const item = page.locator('#draggable');
//    TypeScript: const item: Locator = page.locator('#draggable');
//
// 4. TYPE CHECKING:
//    JavaScript: No compile-time type checking (errors at runtime)
//    TypeScript: Compile-time type checking (catches errors before running)
//
// 5. FUNCTION PARAMETERS:
//    JavaScript: async ({ page }) => { ... }
//    TypeScript: async ({ page }: { page: Page }) => { ... }
//                (can optionally add types, but not required)
//
// ===================================================================

const { test, expect } = require('@playwright/test');

// ===================================================================
// TEST 1: Has Title
// ===================================================================
// SYNTAX NOTE: Both JavaScript and TypeScript use the same syntax here
//              because Playwright's API is the same for both languages
// ===================================================================
test('has title', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('https://webdriveruniversity.com/Actions/index.html');

  // Verify page title
  await expect(page).toHaveTitle('WebDriver | Actions');
});

// ===================================================================
// TEST 2: All Actions Methods
// ===================================================================
// VARIABLE DECLARATION DIFFERENCE:
// JavaScript: const item = page.locator('#draggable');
// TypeScript: const item: Locator = page.locator('#draggable');
//             (TypeScript can optionally specify the type 'Locator')
// ===================================================================
test('All Actions MEthods', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('https://webdriveruniversity.com/Actions/index.html');

  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(2000);
  await page.mouse.wheel(0, -1000);

  // JavaScript: No type annotation needed
  const item = page.locator('#draggable');
  const target = page.locator('#droppable');
  // TypeScript equivalent would be:
  // const item: Locator = page.locator('#draggable');
  // const target: Locator = page.locator('#droppable');

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
  // SYNTAX NOTE: Both JS and TS use the same syntax for:
  //              - Template literals: `Hover ${i + 1} → ${linkCount} link(s)`
  //              - Async/await: await buttons.count()
  //              - Arrow functions: async ({ page }) => { ... }
  const buttons = page.locator('button.dropbtn');
  const buttonCount = await buttons.count();
  // JavaScript: const buttonCount = await buttons.count();
  // TypeScript: const buttonCount: number = await buttons.count();
  //             (TypeScript can optionally specify return type as 'number')

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


// ===================================================================
// TEST 3: Amazon Scroll Test
// ===================================================================
// REGULAR EXPRESSIONS: Same syntax in both JavaScript and TypeScript
//                      /continue/i is a regex pattern (case-insensitive)
// ===================================================================
test('Amazon Scroll Test - Stable', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('https://www.amazon.in/');
  // Handle "Continue shopping" page if shown

  // JavaScript: const continueBtn = page.getByRole('button', { name: /continue/i });
  // TypeScript: const continueBtn: Locator = page.getByRole('button', { name: /continue/i });
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

// --------- Multiple ways to check title ---------

// 1. Using Playwright's toHaveTitle (REGEX)
await expect(page).toHaveTitle(/Amazon/);

// 2. Using direct comparison with await page.title() (EXACT STRING)
const actualTitle = await page.title();
console.log('Page Title:', actualTitle);
expect(actualTitle).toContain('Amazon'); // Checks substring presence

// 3. Using regular expression test directly
const titleRegex = /Amazon/i; // case-insensitive
if (!titleRegex.test(actualTitle)) {
  throw new Error(`Page title does not match regex /Amazon/i. Actual: "${actualTitle}"`);
}

// 4. (Extra) Using startsWith or endsWith for fine control
if (!actualTitle.startsWith("About Amazon")) {
  console.warn("Title does not start with 'About Amazon'");
}

// ------------------------------------------------

});

// ===================================================================
// SUMMARY OF KEY DIFFERENCES:
// ===================================================================
// 1. IMPORT: require() vs import/from
// 2. TYPES: JavaScript has NO type annotations, TypeScript has OPTIONAL types
// 3. FILE EXT: .js vs .ts
// 4. COMPILATION: JavaScript runs directly, TypeScript needs compilation
// 5. ERROR CHECKING: JavaScript at runtime, TypeScript at compile-time
//
// NOTE: Most Playwright code looks identical in both languages because:
//       - Playwright API is the same
//       - TypeScript types are often inferred automatically
//       - Type annotations in TypeScript are OPTIONAL
// ===================================================================

