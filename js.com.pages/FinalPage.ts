const { expect } = require('@playwright/test');

class FinalPage {

  constructor(page) {
    this.page = page;

    // Locators
    this.pageTitle = page.locator('.title');                 // "Checkout: Complete!"
    this.successMessage = page.locator('.complete-header'); // "Thank you for your order!"
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  // Verify Final Page title starts with "Checkout"
  async verifyFinalPageTitle() {
    await expect(this.pageTitle).toHaveText(/^Checkout/, { timeout: 5000 });
  }

  // (Optional) verify order success message
  async verifyOrderSuccess() {
    await expect(this.successMessage).toBeVisible();
    console.log("🎉 Order placed successfully!");
  }

  // (Optional) click Back Home button
  async clickBackHomeButton() {
    await this.backHomeButton.click();
    console.log("🏠 Back to home page");
  }
}

module.exports = { FinalPage };
