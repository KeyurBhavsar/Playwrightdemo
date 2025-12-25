const { test, expect } = require('@playwright/test');


const TEST_CREDENTIALS = {
  username: 'Admin',
  password: 'admin123'
};


test.beforeEach(async ({ page }) => {
  // 1️⃣ Open login page
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.setViewportSize({ width: 1920, height: 1080 });

  // 2️⃣ Login
  await page.getByPlaceholder('Username').fill(TEST_CREDENTIALS.username);
  await page.getByPlaceholder('Password').fill(TEST_CREDENTIALS.password);

  const loginBtn = page.getByRole('button', { name: 'Login' });
  await expect(loginBtn).toBeVisible();
  await loginBtn.click();

  // 3️⃣ Verify home page
  await expect(page).toHaveTitle('OrangeHRM');
  await page.waitForLoadState('networkidle');

  console.log('✅ Login successful');
});

test('My Info – Print details and fill personal & contact data', async ({ page }) => {

  // 4️⃣ Click hamburger menu
  const sideMenuBtn = page.locator('button.oxd-main-menu-button');
  await sideMenuBtn.click();
  console.log('✅ Side menu clicked');

  // 5️⃣ Click My Info
  const myInfo = page.locator('span.oxd-main-menu-item--name', { hasText: 'My Info' }).locator('..');
  await expect(myInfo).toBeVisible();
  await myInfo.click();
  console.log('✅ My Info clicked');

  // 6️⃣ Verify Personal Details page
  await expect(page).toHaveURL(/pim\/viewPersonalDetails/);
  const personalHeader = page.getByRole('heading', { name: 'Personal Details' });
  await expect(personalHeader).toBeVisible();

  console.log('Section:', await personalHeader.textContent());



  const firstName = page.getByPlaceholder('First Name');
  const middleName = page.getByPlaceholder('Middle Name');
  const lastName = page.getByPlaceholder('Last Name');

  // Wait until editable
  await expect(firstName).toBeEditable();

  // Clear using Windows keyboard shortcuts
  for (const field of [firstName, middleName, lastName]) {
    await field.click();
    await field.press('Control+A');   // Windows select all
    await field.press('Backspace');   // Delete selected text
  }

  await firstName.pressSequentially('Keyur', { delay: 150 });
  await middleName.pressSequentially('Rajeshbhai', { delay: 150 });
  await lastName.pressSequentially('Bhavsar', { delay: 150 });

  // Assert values are visible
  await expect(firstName).toHaveValue('Keyur');
  await expect(middleName).toHaveValue('Rajeshbhai');
  await expect(lastName).toHaveValue('Bhavsar');

  console.log('✅ Names cleared and retyped successfully (Windows)');

  const firstNameValue = await firstName.inputValue();
  const middleNameValue = await middleName.inputValue();
  const lastNameValue = await lastName.inputValue();

  console.log('👤 Employee Full Name:');
  console.log('First Name :', firstNameValue);
  console.log('Middle Name:', middleNameValue);
  console.log('Last Name  :', lastNameValue);
  console.log(`Full Name  : ${firstNameValue} ${middleNameValue} ${lastNameValue}`);


  // ================= PERSONAL DETAILS =================

  // Employee Id
  const employeeId = page.locator(
    'label:has-text("Employee Id") >> xpath=following::input[1]'
  );
  await employeeId.fill('T4519');

  // Other Id
  const otherId = page.locator(
    'label:has-text("Other Id") >> xpath=following::input[1]'
  );
  await otherId.fill('OID9007');

  // Driver License Number
  const driverLicense = page.locator(
    'label:has-text("Driver\'s License Number") >> xpath=following::input[1]'
  );
  await driverLicense.fill('DL-123456');

  // License Expiry Date (React-safe clear + type)
  const licenseExpiry = page.locator(
    'label:has-text("License Expiry Date") >> xpath=following::input[1]'
  );
  await licenseExpiry.click();
  await licenseExpiry.press('Control+A');
  await licenseExpiry.press('Backspace');
  await licenseExpiry.pressSequentially('2025-10-10', { delay: 150 });

  // Date of Birth
  const dob = page.locator(
    'label:has-text("Date of Birth") >> xpath=following::input[1]'
  );
  await dob.fill('1996-05-10');

  // ---------------- Nationality Dropdown ----------------
  const nationalityDropdown = page.locator(
    '//label[text()="Nationality"]/following::div[contains(@class,"oxd-select-text")][1]'
  );
  await nationalityDropdown.click();
  await page.getByRole('option', { name: 'Indian' }).click();


  // ================= PRINT ENTERED VALUES =================

  console.log('📄 Personal Details Entered:');
  console.log('Employee Id         :', await employeeId.inputValue());
  console.log('Other Id            :', await otherId.inputValue());
  console.log('Driver License      :', await driverLicense.inputValue());
  console.log('License Expiry Date :', await licenseExpiry.inputValue());
  console.log('Date of Birth       :', await dob.inputValue());

  // Dropdown value
  const nationalityValue = await nationalityDropdown.textContent();
  console.log('Nationality         :', nationalityValue.trim());


  // ================= SAVE PERSONAL DETAILS =================

  const savePersonal = page
    .locator('h6:has-text("Personal Details")')
    .locator('..')
    .getByRole('button', { name: 'Save' });

  await savePersonal.scrollIntoViewIfNeeded();
  await expect(savePersonal).toBeEnabled();
  await savePersonal.click();

  // Wait until save completes (button enabled again)
  await expect(savePersonal).toBeEnabled();

  console.log('✅ Personal details filled, printed, and saved successfully');

  // ================= CONTACT DETAILS =================
  // ================= CONTACT DETAILS =================

  // Click Contact Details tab
  await page.getByRole('link', { name: 'Contact Details' }).click();
  await expect(page.getByRole('heading', { name: 'Contact Details' })).toBeVisible();

  // define contact section parent (💥 fix #1)
  const contactSection = page.locator('h6:has-text("Contact Details")').locator('..');

  // --- Address Fields ---
  const street1 = contactSection.locator('label:has-text("Street 1") >> xpath=following::input[1]');
  await page.waitForLoadState('networkidle');  // need to do here to load page 
  await street1.pressSequentially(' 425 Wilson Avenue',{ delay: 200 });

  const street2 = contactSection.locator('label:has-text("Street 2") >> xpath=following::input[1]');
  await street2.pressSequentially('Unit 509',{ delay: 150 });

  const city = contactSection.locator('label:has-text("City") >> xpath=following::input[1]');
  await city.pressSequentially('Kitchener',{ delay: 150 });

  const state = contactSection.locator('label:has-text("State/Province") >> xpath=following::input[1]');
  await state.pressSequentially('Ontario',{ delay: 150 });

  const zip = contactSection.locator('label:has-text("Zip/Postal Code") >> xpath=following::input[1]');
  await zip.pressSequentially('N2C 2R8',{ delay: 150 });

  // --- Country Dropdown (💥 fix #2)
  const countryDropdown = contactSection.locator('.oxd-select-text').first();
  await countryDropdown.click();

  // Select country
  await page.getByRole('option', { name: 'India', exact: true }).click();

  // --- Print Values (💥 correct way, no timeout)
  console.log('📞 Contact Details Entered:');
  console.log('Street 1 :', await street1.inputValue());
  console.log('Street 2 :', await street2.inputValue());
  console.log('City     :', await city.inputValue());
  console.log('State    :', await state.inputValue());
  console.log('Zip Code :', await zip.inputValue());

  // ⭐ Print selected country directly from dropdown (works reliably)
  const selectedCountry = (await countryDropdown.textContent()).trim();
  console.log('Country  :', selectedCountry);

  // ================= SAVE CONTACT DETAILS =================
  const saveContact = contactSection.getByRole('button', { name: 'Save' });
  await expect(saveContact).toBeEnabled();
  await saveContact.click();
  await expect(saveContact).toBeEnabled();

  console.log('✅ Contact details filled, printed, and saved successfully');



//*************************************************************************************** */

});