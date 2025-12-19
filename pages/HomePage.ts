import { expect, BrowserContext, Page } from '@playwright/test';

exports.HomePage = class HomePage {

    constructor(page) {

        this.page = page;     //wherever page.wait.. etc need yo use we must now use this.page  reference provides here for current page 
        this.productList = '.inventory_item';
        this.addtocartButton = '#add-to-cart';
        this.cartButton = page.locator('[data-test="shopping-cart-link"]'); // page.locator("//span[@data-test='title']"); // '#shopping_cart_container';

    }
    async VerifyUserOnHomePage() {
    
            // Verify URL
           // await expect(this.page).toHaveURL(/inventory.html/);
        
            // Verify Swag Labs header is visible
            const headerLabel = this.page.locator('.header_label');
            await expect(headerLabel).toBeVisible();
        
            // Optional: Verify exact text
            await expect(headerLabel).toHaveText('Swag Labs');
        
            console.log('✅ User successfully navigated to Home Page');
        }

    /*
        async productlistavailable() {
            try {
                const productList = await this.page.$$(this.productList);
                let count = 0;
                console.log("\n===== ALL LINKS ON PAGE =====");
    
                for (const item of productList) {
                    const itemname = await item.textContent();
                    console.log(itemname);
                    count++;
                }
    
                console.log("Yes Productlist Here, Total products found: " + count);
                console.log("====================================\n");
            } catch (error) {
                console.log('No Products on HomePage');
            }
    
        }*/

            async productlistavailable() {
                // Get all product items on the page
                const productList = this.page.locator(this.productList);
                const count = await productList.count();
              
                if (count > 0) {
                  console.log("\n===== PRODUCTS FOUND =====");
              
                  const products: { name: string; price: number }[] = [];
              
                  for (let i = 0; i < count; i++) {
                    const item = productList.nth(i);
              
                    // Safely extract name and price
                    const name = (await item.locator('.inventory_item_name').innerText()).trim();
                    const priceText = (await item.locator('.inventory_item_price').innerText()).trim();
                    const price = parseFloat(priceText.replace('$', ''));
              
                    products.push({ name, price });
                  }
              
                  console.log('🛒 Products with Prices:');
                  products.forEach(p => console.log(`→ ${p.name} - $${p.price}`));
              
                  return products;
                } else {
                  console.log('❌ No Products on HomePage');
                  return [];
                }
              }

            /*const prices = products.map(p => p.price);
            for (let i = 0; i < prices.length - 1; i++) {
                expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
                console.log(`$${prices[i]} >= $${prices[i + 1]}`);
            }

            const highest = products.reduce((prev, curr) => (curr.price > prev.price ? curr : prev));
            const lowest = products.reduce((prev, curr) => (curr.price < prev.price ? curr : prev));

            console.log(`Highest Price: ${highest.name} - $${highest.price}`);
            console.log(`Lowest Price: ${lowest.name} - $${lowest.price}`);*/

            /*
                        for (const item of productList) {
                            const itemname = (await item.textContent())?.trim();
                            console.log(itemname);
                            count++;
                        }
            
                        console.log(`\nTotal products found: ${count}`);
                        console.log("===========================\n");
            */


    async AddProductToCart(productName: string) {

        const product = this.page
            .locator('.inventory_item')
            .filter({ hasText: productName });      /* alternative of this step here used awesome :
            
            const productList = await this.page.$$(this.productList);
            for (const product of productList) {
                if (productname === await product.textContent()) {
                    await product.click();*/

        if (await product.count() > 0) {
            await product.locator('button:has-text("Add to cart")').click();   // We are going to inside Parent locator .. then click on child locator here:product> product's add to cart > click
            console.log(`✅  Added to cart: ${productName}`);
        } else {
            console.log(`⚠️  Product not found: ${productName}`);
        }
    }

    async newTabWorkflow() {
        const context: BrowserContext = this.page.context();

        // 1️⃣ Open new tab
        const newTab: Page = await context.newPage();
        await newTab.goto('https://playwright.dev/docs/writing-tests');
        console.log('✅ New tab opened');

        // 2️⃣ Minimize (simulate via small viewport)
        await newTab.setViewportSize({ width: 800, height: 600 });
        console.log('🖥️ New tab minimized');

        // 3️⃣ Take screenshot og NewTAb Full Page
        const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

        await newTab.screenshot({
            path: `./Screenshots/screen-${today}.png`,
            fullPage: true
        });

        // 
        // await page.screenshot({path:'./Screenshots/pageScreenshot.png'});
        // await page.screenshot({path:'./Screenshots/fullpageScreenshot.png', FullPage:true });
        // await page.locator('#username').screenshot({path:'./Screenshots/LocatorScreenshot.png'});


        // 4️⃣ Wait for 5 seconds
        await newTab.waitForTimeout(3000);

        // 5️⃣ Maximize (simulate via large viewport)
        await newTab.setViewportSize({ width: 1920, height: 1080 });
        console.log('🖥️ New tab maximized');
        await newTab.waitForTimeout(2000);

        // 6️⃣ Reload new tab
        await newTab.reload();
        console.log('🔄 New tab reloaded');

        // 7️⃣ Return to original page
        await this.page.bringToFront();
        console.log('⬅️ Back to original Home Page');
    }

    async clickCartButton() {
        await this.cartButton.click();    //this.cartButton has already page./// property 

        console.log('✅ Cart button clicked');
        // Wait for Cart page title to appear
        await this.page.waitForSelector('.title', { timeout: 5000 });

    }
}

/*
task remained:

  const productElements = await page.$$('.inventory_item');

  const products = [];

  for (const productElement of productElements) {
    const name = await productElement.$eval('.inventory_item_name', el => el.textContent.trim());
    const priceText = await productElement.$eval('.inventory_item_price', el => el.textContent.trim());
    const price = parseFloat(priceText.replace('$', ''));
    products.push({ name, price });
  }

  console.log('Products with Prices:');
  products.forEach(p => console.log(`${p.name} - $${p.price}`));

  const prices = products.map(p => p.price);
  for (let i = 0; i < prices.length - 1; i++) {
    expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    console.log(`$${prices[i]} >= $${prices[i + 1]}`);
  }

  const highest = products.reduce((prev, curr) => (curr.price > prev.price ? curr : prev));
  const lowest = products.reduce((prev, curr) => (curr.price < prev.price ? curr : prev));

  console.log(`Highest Price: ${highest.name} - $${highest.price}`);
  console.log(`Lowest Price: ${lowest.name} - $${lowest.price}`);

  const highestCartSelector = highest.name.toLowerCase().replace(/ /g, '-');
  await page.locator(`[data-test="add-to-cart-${highestCartSelector}"]`).click();

  */