import { Page, expect } from '@playwright/test';

export class FinalPage {
  readonly page: Page;

  // Locators
  readonly pageTitle;
  readonly successMessage;
  readonly backHomeButton;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title'); // "Checkout: Complete!"
    this.successMessage = page.locator('.complete-header');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

 // ✅ Verify Final Page Title starts with "Checkout"
async verifyFinalPageTitle() {
    await expect(this.pageTitle).toHaveText(/^Checkout/, { timeout: 5000 });
}



}
