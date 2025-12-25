// ===================================================================
// JAVASCRIPT VERSION - CartPage
// ===================================================================
// CONVERSION NOTES:
// TypeScript: import { expect } from '@playwright/test';
// JavaScript: const { expect } = require('@playwright/test');
//
// TypeScript: export class CartPage {
// JavaScript: exports.CartPage = class CartPage {
//              OR: class CartPage { ... } then exports.CartPage = CartPage;
// ===================================================================

const { expect } = require('@playwright/test');

exports.CartPage = class CartPage {

    constructor(page) {
        this.page = page;
        this.checkoutButton = page.locator('#checkout'); // Checkout button by ID
    }

    // Lazy locator for Your Cart title
    yourCartTitle() {
        return this.page.getByText("Your Cart", { exact: true });
    }

    async verifyUserOnCartPage() {
        await expect(this.yourCartTitle()).toBeVisible({ timeout: 5000 });
        console.log('✅ Yes – Welcome to Add to Cart page');

        // Optional visual pause
        await this.page.waitForTimeout(2000);
    }

    async verifyAndClickCheckoutButton() {
        await expect(this.checkoutButton).toBeVisible({ timeout: 5000 });
        console.log('✅ Checkout button is visible');

        await this.checkoutButton.click();
        console.log('✅ Clicked on Checkout button');
    }

}

