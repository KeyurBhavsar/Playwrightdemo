const { expect } = require('@playwright/test');

class HomePage {
    constructor(page) {
        this.page = page;
        this.productList = '.inventory_item';
        this.addtocartButton = '#add-to-cart';
        this.cartButton = page.locator('[data-test="shopping-cart-link"]');
    }

    // ================= HOME PAGE ==================
    async VerifyUserOnHomePage() {
        const headerLabel = this.page.locator('.header_label');
        await expect(headerLabel).toBeVisible();
        await expect(headerLabel).toHaveText('Swag Labs');
        console.log('✅ User successfully navigated to Home Page');
    }

    async  VerifyPopupOnHomePage(page) {
        page.on('dialog', async dialog => {
          console.log(`⚠️ Dialog appeared with message: "${dialog.message()}"`);
          await dialog.accept();  // or use dialog.dismiss() if you want to accept the dialog
          console.log('Dialog was accepted successfully.');
        });
      }

    // ============== PRODUCT LIST ==================
    async productlistavailable() {
        const productList = this.page.locator(this.productList);
        const count = await productList.count();

        if (count > 0) {
            console.log("\n===== PRODUCTS FOUND =====");

            const products = [];

            for (let i = 0; i < count; i++) {
                const item = productList.nth(i);

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

    // ============== ADD TO CART ==================
    async AddProductToCart(productName) {
        const product = this.page
            .locator('.inventory_item')
            .filter({ hasText: productName });

        if (await product.count() > 0) {
            await product.locator('button:has-text("Add to cart")').click();
            console.log(`✅ Added to cart: ${productName}`);
        } else {
            console.log(`⚠️ Product not found: ${productName}`);
        }
    }

    // ============== NEW TAB WORKFLOW ===============
    async newTabWorkflow() {
        const context = this.page.context();

        const newTab = await context.newPage();
        await newTab.goto('https://playwright.dev/docs/writing-tests');
        console.log('✅ New tab opened');

        await newTab.setViewportSize({ width: 800, height: 600 });
        console.log('🖥️ New tab minimized');

        const today = new Date().toISOString().split('T')[0];

        await newTab.screenshot({
            path: `./Screenshots/screen-${today}.png`,
            fullPage: true
        });

        await newTab.waitForTimeout(3000);

        await newTab.setViewportSize({ width: 1920, height: 1080 });
        console.log('🖥️ New tab maximized');
        await newTab.waitForTimeout(2000);

        await newTab.reload();
        console.log('🔄 New tab reloaded');

        await this.page.bringToFront();
        console.log('⬅️ Back to original Home Page');
    }

    // ============== CART BUTTON ==================
    async clickCartButton() {
        await this.cartButton.click();
        console.log('✅ Cart button clicked');

        await this.page.waitForSelector('.title', { timeout: 5000 });
    }
}

module.exports = { HomePage };
