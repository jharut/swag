import { test, expect } from '../../fixtures/base.test.js';
import { users } from '../../data/users.js';

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
});

test('TC-01. Successful login @smoke', async ({ loginPage, inventoryPage, page }) => {
  await test.step('Enter standard_user in username', async () => {
    await loginPage.username.fill('standard_user');
  });

  await test.step('Enter secret_sauce in password', async () => {
    await loginPage.password.fill('secret_sauce');
  });

  await test.step('Click login-button', async () => {
    await loginPage.loginButton.click();
  });

  await test.step('Verify navigation to the inventory page', async () => {
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(6);
  });
});

test('TC-02. Locked-out user', async ({ loginPage, page }) => {
  const loginUrl = page.url();
  await loginPage.login(users.lockedOut.username, users.lockedOut.password);
  await expect(loginPage.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  await expect(page).toHaveURL(loginUrl);
});

const invalidLoginCases = [
  {
    name: 'empty username and password',
    username: '',
    password: '',
    error: 'Epic sadface: Username is required',
  },
  {
    name: 'empty password',
    username: 'standard_user',
    password: '',
    error: 'Epic sadface: Password is required',
  },
  {
    name: 'incorrect password',
    username: 'standard_user',
    password: 'wrong',
    error: 'Epic sadface: Username and password do not match any user in this service',
  },
];

for (const { name, username, password, error } of invalidLoginCases) {
  test(`TC-03. Login validation: ${name}`, async ({ loginPage, page }) => {
    const loginUrl = page.url();

    await loginPage.login(username, password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(error);
    await expect(page).toHaveURL(loginUrl);

    await loginPage.dismissError();
    await expect(loginPage.errorMessage).toBeHidden();
  });
}
