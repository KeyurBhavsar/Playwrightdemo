/*
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';

test('test', async ({ page }) => {

    // login 
    const login = new LoginPage(page);
    await login.gotoLoginPage();
    await login.login('standard_user', 'secret_sauce');

    //home 
    const homepage = new HomePage(page);
    await homepage.VerifyUserOnHomePage();
    await homepage.productlistavailable();
    await homepage.AddProductToCart("Sauce Labs Bolt T-Shirt");
    await homepage.newTabWorkflow();
    await homepage.clickCartButton();

    //cart
    const cartPage = new CartPage(page);
    await cartPage.VerifyUserOnCartPage();

});
*/
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { readUsersFromExcel } from '../data/excelUtils';

const EXCEL_FILE_PATH = './data/testlogin.xlsx';
const testUsers = readUsersFromExcel(EXCEL_FILE_PATH);
/* ****************************************************************************************************************************** */

test.describe('E-commerce Workflow Tests (Data-Driven)', () => {
  if (!testUsers || testUsers.length === 0) {
    test.skip('No user data found in Excel file. Skipping all tests.', () => {});
    return;
  }

  // ✅ This loop must be INSIDE describe
  testUsers.forEach((user, index) => {
    console.log(`Row ${index + 1} user data:`, user);

    const username =
      user.Username ||
      user['Username '] || // handle trailing space
      user.username ||
      user['User Name'] ||
      'UnknownUser';

    const password =
      user.Password ||
      user.password ||
      user['Pass'] ||
      '';

    test(`Full workflow test for user ${index + 1}: ${username}`, async ({ page }) => {
      const login = new LoginPage(page);
      await login.gotoLoginPage();
      console.log(`********\n Test starts Here *******`);
      await login.login(username, password);
/* ****************************************************************************************************************************** */
      const homepage = new HomePage(page);
      await homepage.VerifyUserOnHomePage();
      await homepage.productlistavailable();
      await homepage.AddProductToCart('Sauce Labs Bolt T-Shirt');
      await homepage.newTabWorkflow();
      await homepage.clickCartButton();

      const cartPage = new CartPage(page);
      await cartPage.VerifyUserOnCartPage();

      console.log(`✅ Workflow completed successfully for user: ${username}`);
      console.log(`------------------------------------------------\n Test Ends Here -------------------------------------------------`);

    });
  });
});
