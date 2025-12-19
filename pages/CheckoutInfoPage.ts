import { Page, expect,Locator } from '@playwright/test';

export class CheckoutInfoPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
  }


 // Fill in user information with typing delay
async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
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
