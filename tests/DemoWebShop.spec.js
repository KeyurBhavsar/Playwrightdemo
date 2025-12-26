const { test, expect } = require('@playwright/test');
const { link } = require('fs');

const TEST_CREDENTIALS = {
  email: 'keyur.bhavsar@tatvasoft.com',
  password: 'Keyur@tatva123'
};

// --------------------------------------------------
// LOGIN TEST
// --------------------------------------------------
test.beforeEach('Login with provided credentials (Keyur)', async ({ page }) => {

  await page.goto('https://demowebshop.tricentis.com/');
  await page.setViewportSize({ width: 1920, height: 1080 });

  await page.getByRole('link', { name: /log in/i }).click();

  await page.fill('#Email', TEST_CREDENTIALS.email);
  await page.fill('#Password', TEST_CREDENTIALS.password);

  await page.getByRole('button', { name: /log in/i }).click();
  await page.waitForLoadState('networkidle');

  const logoutLink = page.getByRole('link', { name: /log out/i });
  await expect(logoutLink).toBeVisible();


  console.log(`✅ Login PASSED for ${TEST_CREDENTIALS.email}`);
});

// --------------------------------------------------
// HOMEPAGE VERIFICATION
// --------------------------------------------------
test('Homepage verification', async ({ page }) => {

  await page.goto('https://demowebshop.tricentis.com/');

  await expect(page).toHaveTitle(/Demo Web Shop/);

  console.log('Page URL is:', page.url());
  await page.reload();

  const menu = page.locator('ul.top-menu > li > a');
  await expect(menu).toHaveCount(7);

  const menuItems = await menu.allInnerTexts();

  console.log('\n📋 Menu Items:\n');
  menuItems
    .map(item => item.trim())
    .forEach((item, index) => {
      console.log(`> ${index + 1}. ${item}`);
    });


  const computersMenu = page
    .locator('ul.top-menu')
    .getByRole('link', { name: 'Computers' });

  await expect(computersMenu).toBeVisible();
  await computersMenu.hover();

  const desktops = page
    .locator('ul.top-menu')
    .getByRole('link', { name: 'Desktops' });

  await desktops.click();
  // Ensure correct URL
  await expect(page).toHaveURL(/\/desktops/);

  const desktopsItems = page.locator('div.item-box');
  await expect(desktopsItems.first()).toBeVisible();

  const count = await desktopsItems.count();

  console.log('\n📋 Desktop Products with Prices:\n');

  for (let i = 0; i < count; i++) {
    const item = desktopsItems.nth(i);

    // Get product name
    const name = (await item.locator('.product-title a').innerText()).trim();

    // Get product price
    const price = (await item.locator('.prices .price').innerText()).trim();

    console.log(`> ${i + 1}. ${name} - ${price}`);
  }

  const expComputer = page.getByRole('link', { name: 'Build your own expensive computer' });
  await expComputer.first().click();

  await expect(page).toHaveURL('https://demowebshop.tricentis.com/build-your-own-expensive-computer-2');
  await page.waitForLoadState("networkidle");

  const addtocartBtn = page.locator('#add-to-cart-button-74');
  await addtocartBtn.click();

  // Handle Loader here :  Wait for the notification to appear
  const productMsg = page.locator('.bar-notification.success p');
  await productMsg.waitFor({ state: 'visible', timeout: 6000 });

  // Print the message text
  const msgText = await productMsg.textContent();
  console.log('Message:', msgText);

  // Optional: assert it contains expected text
  await expect(productMsg).toHaveText(/added to your shopping cart/i);

  const cartBtn = page.locator('#topcartlink').getByRole('link', { name: 'Shopping cart' });
  await cartBtn.click();

  const updateCartBtn = page.getByRole('button', { name: 'Update shopping cart' });
  await expect(updateCartBtn).toBeVisible();
  await updateCartBtn.click();
  console.log('\nClicked on udpate Button and Yes Test Passed\n')

  const country = page.locator('#CountryId');
  await country.selectOption({ label: 'Canada' });
  await expect(country).toHaveValue('2');
  console.log(`\nSelected country: Canada\n`);

  const state = page.locator('#StateProvinceId');
  //const state = page.getByLabel('State / province:');
  //page.getByRole('combobox', { name: 'State / province:' });

  await state.selectOption({ label: 'Ontario' });

  await expect(state).toHaveValue('71');
  await expect(state.locator('option:checked')).toHaveText('Ontario');

  /*// both can used BUT Twist is | Element    | Assertion                       |
  | ---------- | ------------------------------- |
  | `<select>` | `toHaveValue()`                 |
  | `<option>` | `option:checked → toHaveText()` |
  */

  console.log(`\nSelected stateProvince : Ontario\n`);


  const ShoppingCart = page.locator('div .page-title h1');
  const cartText = await ShoppingCart.textContent();
  console.log(cartText);


  const cartRows = page.locator('tr.cart-item-row');
  const count2 = await cartRows.count();
  console.log(count2);

  let calculatedTotal = 0;
  console.log('\n🛒 Shopping Cart Details:\n');

  for (let i = 0; i < count2; i++) {
    const row = cartRows.nth(i);

    const productName = await row
      .locator('td.product a.product-name')
      .innerText();

    const description = await row
      .locator('td.product div.attributes')
      .innerText();

    const quantity = await row
      .locator('td.qty.nobr input')
      .inputValue();

    const unitprice = await row
      .locator('td.unit-price .product-unit-price')
      .innerText();

    const subTotalText = await row
      .locator('td.subtotal .product-subtotal')
      .innerText();


    // 🔢 Convert SubTotal text → number
    const subTotal = parseFloat(
      subTotalText.replace(/[^\d.]/g, '')
    );

    calculatedTotal += subTotal;

    console.log(`📦 Product ${i + 1}`);
    console.log(`Name        : ${productName}`);
    console.log(`Description :\n${description}`);
    console.log(`Quantity    : ${quantity}`);
    console.log(`Unit Price  : ${unitprice}`);
    console.log(`SubTotal    : ${subTotal}`);
    console.log('-----------------------------');



  }

  // ================================
  // ✅ Checkout Total
  // ================================

  const checkoutTotalText = await page.locator('.product-price.order-total strong').first().textContent();
  const checkoutTotal = parseFloat(checkoutTotalText.replace(/[^\d.]/g, ''));

  console.log(`🧮 Calculated Total : ${calculatedTotal}`);
  console.log(`💳 Checkout Total   : ${checkoutTotal}`);

  // ================================
  // ✅ Assertion
  // ================================

  expect(calculatedTotal).toBe(checkoutTotal);

  console.log('🎉 Checkout total matched.');
  console.log('--------------\n');

  // checkbox I agree clicked
  // Agree to terms
  const iAgreeCheckBox = page.locator('#termsofservice');
  await iAgreeCheckBox.check();
  await expect(iAgreeCheckBox).toBeChecked();

  // Checkout
  await page.getByRole('button', { name: /checkout/i }).click();

  await page.waitForLoadState('networkidle');


  // ================================
  // ✅ CheckOut Page
  // ================================
  console.log('➡️ Billing Address: Clicking Continue');

  await page
    .locator('#opc-billing')
    .getByRole('button', { name: 'Continue' })
    .click();
  await page.waitForLoadState('networkidle');

  // ================================
  // 🚚 Shipping Address
  // ================================
  console.log('➡️ Shipping Address: Selecting Pick Up In Store');

  const pickUpInStoreCheckbox = page.locator('#PickUpInStore');
  await pickUpInStoreCheckbox.check();
  await expect(pickUpInStoreCheckbox).toBeChecked();

  console.log('➡️ Shipping Address: Clicking Continue');

  await page
    .locator('#opc-shipping')
    .getByRole('button', { name: 'Continue' })
    .click();
  await page.waitForLoadState('networkidle');

  // ================================
  // 📦 SHIPPING METHOD
  // ================================
  console.log('➡️ Shipping Method: Waiting for section');
  const pickUpInStoreChecked = await page.locator('#PickUpInStore').isChecked();
  await page.waitForLoadState('networkidle');

  if (!pickUpInStoreChecked) {
    console.log('➡️ Shipping Method: Selecting shipping option');

    const shippingMethodSection = page.locator('#opc-shipping_method');
    await expect(shippingMethodSection).toBeVisible();

    const nextDayShippingRadio = shippingMethodSection.locator('#shippingoption_1');
    await nextDayShippingRadio.check();
    await expect(nextDayShippingRadio).toBeChecked();

    await shippingMethodSection
      .getByRole('button', { name: 'Continue' })
      .click();
  } else {
    console.log('ℹ️ Shipping Method skipped (Pick Up In Store selected)');
  }
  await page.waitForLoadState('networkidle');


  // ================================
  // 💳 PAYMENT METHOD
  // ================================
  console.log('➡️ Payment Method: Waiting for section');

  const paymentMethodSection = page.locator('#opc-payment_method');
  await expect(paymentMethodSection).toBeVisible();

  console.log('➡️ Payment Method: Selecting Credit Card');

  const creditCardRadio = paymentMethodSection.locator('#paymentmethod_1');
  await creditCardRadio.check();
  await expect(creditCardRadio).toBeChecked();

  console.log('➡️ Payment Method: Clicking Continue');

  await paymentMethodSection.getByRole('button', { name: 'Continue' })
    .click();

    await page.waitForTimeout(5000);

  // 💳 PAYMENT INFORMATION
  // ================================
  console.log('➡️ Payment Information: Clicking Continue');
  const paymentInfoSection = page.locator('#opc-payment_info');
  await expect(paymentInfoSection).toBeVisible();

  console.log('➡️ Payment Information: Clicking Continue');
  await page.waitForTimeout(5000);

  await paymentInfoSection
    .getByRole('button', { name: /continue/i })
    .click();
  // ================================
  // ✅ CONFIRM ORDER
  // ================================
  console.log('➡️ Confirm Order: Waiting for section');

  const orderConfirmationSection = page.locator('#opc-confirm_order');
  await expect(orderConfirmationSection).toBeVisible();

  console.log('➡️ Confirm Order: Clicking Confirm');

  await orderConfirmationSection
    .getByRole('button', { name: 'Confirm' })
    .click();

  // ================================
// 🎉 ORDER COMPLETION
// ================================
console.log('➡️ Order Completion: Verifying success message');

// Use a more specific and accurate locator for the order completion section
const orderCompletionSection = page.locator('.section.order-completed');
await expect(orderCompletionSection).toBeVisible();

// Verify success message text is visible
await expect(
  orderCompletionSection.getByText(
    'Your order has been successfully processed!'
  )
).toBeVisible();

// ✅ Extract Order Number text safely
const orderNumberText = await orderCompletionSection
  .locator('text=Order number:')
  .innerText();

// Extract just the number part from "Order number: 2173348"
const orderId = orderNumberText.replace('Order number:', '').trim();

console.log(`📦 Order ID: ${orderId}`);

// 🖨️ Print full order completion section text using innerText for visible text
const orderCompletionText = await orderCompletionSection.innerText();

console.log('\n📦 Order Completion Section Content:\n');
console.log(orderCompletionText);

console.log('\n***********');
console.log('🎉 Order completed successfully!');
console.log('***********\n');

  
});
