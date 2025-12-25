// ===================================================================
// JAVASCRIPT VERSION - CheckoutInfoPage
// ===================================================================
// CONVERSION NOTES:
// TypeScript: import { Page, expect, Locator } from '@playwright/test';
// JavaScript: const { expect } = require('@playwright/test');
//
// TypeScript: export class CheckoutInfoPage {
// JavaScript: exports.CheckoutInfoPage = class CheckoutInfoPage {
//
// TypeScript: readonly page: Page;
// JavaScript: (remove 'readonly' keyword - not needed in JS)
//
// TypeScript: readonly firstNameInput: Locator;
// JavaScript: (remove type annotation and 'readonly')
//
// TypeScript: constructor(page: Page) {
// JavaScript: constructor(page) {
//
// TypeScript: async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string)
// JavaScript: async fillCheckoutInformation(firstName, lastName, postalCode)
// ===================================================================

const { expect } = require('@playwright/test');

exports.CheckoutInfoPage = class CheckoutInfoPage {
  // JavaScript: No type annotations or 'readonly' keyword needed
  // TypeScript had: readonly page: Page;
  // TypeScript had: readonly firstNameInput: Locator;
  
  constructor(page) {
    // TypeScript: constructor(page: Page)
    this.page = page;
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
  }


 // Fill in user information with typing delay
 // JavaScript: No type annotations for parameters
 // TypeScript: async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string)
async fillCheckoutInformation(firstName, lastName, postalCode) {
    // 100ms delay between keystrokes
    await this.firstNameInput.type(firstName, { delay: 100 });
    await this.lastNameInput.type(lastName, { delay: 100 });
    await this.postalCodeInput.type(postalCode, { delay: 100 });
}

  // Click Continue button
  async clickContinue() {
    await this.continueButton.click();
  }


  // Verify if user is on checkout info page
  async verifyOnCheckoutInfoPage() {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.postalCodeInput).toBeVisible();
  }
}

