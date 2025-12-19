import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { FinalPage } from '../pages/FinalPage';
import { readUsersFromExcel } from '../data/excelUtils';

const EXCEL_FILE_PATH = './data/testlogin.xlsx';
const testUsers = readUsersFromExcel(EXCEL_FILE_PATH);

/* ****************************************************************************************************************************** */

test.describe('E-commerce Workflow Tests (Data-Driven)', { tag: '@smoke' }, () => {

  if (!testUsers || testUsers.length === 0) {
    test.skip('No user data found in Excel file. Skipping all tests.', () => {});
    return;
  }

  for (const [index, user] of testUsers.entries()) {

    const username =
      user.Username ||
      user['Username '] ||
      user.username ||
      user['User Name'] ||
      'UnknownUser';

    const password =
      user.Password ||
      user.password ||
      user['Pass'] ||
      '';

    test(
      `Full workflow test for user ${index + 1}: ${username}`,
      { tag: ['@regression', '@dataDriven'] },
      async ({ page }) => {

        /* ===================== Login ===================== */
        const login = new LoginPage(page);
        await login.gotoLoginPage();
        console.log(`******** Test starts Here ********`);
        await login.login(username, password);

        /* ===================== Home Page ===================== */
        const homepage = new HomePage(page);
        await homepage.VerifyUserOnHomePage();
        await homepage.productlistavailable();
        await homepage.AddProductToCart('Sauce Labs Bolt T-Shirt');
        await homepage.newTabWorkflow();
        await homepage.clickCartButton();

        /* ===================== Cart Page ===================== */
        const cartPage = new CartPage(page);
        await cartPage.verifyUserOnCartPage();
        await cartPage.verifyAndClickCheckoutButton();

        /* ===================== Checkout Info Page ===================== */
        const checkoutPage = new CheckoutInfoPage(page);
        await checkoutPage.verifyOnCheckoutInfoPage();
        await checkoutPage.fillCheckoutInformation(
          'Keyur',
          'Bhavsar',
          '380050'
        );
        await checkoutPage.clickContinue();
        

        /* ===================== Final Page ===================== */
        const finalPage = new FinalPage(page);
        await finalPage.verifyFinalPageTitle();

  

        /* ===================== Test Completion ===================== */
        console.log(`✅ Workflow completed successfully for user: ${username}`);
        console.log(`----------------------Cheers------------------------\n`);
      }
    );
  }
});
