import { test, expect } from '../../fixtures/test.js';
import { products } from '../../data/products.js';

test('TC-11. Calculate checkout subtotal, tax, and total', async ({ authenticatedInventory, cartPage, checkoutPage }) => {
  await test.step('Add three products and continue to checkout overview', async () => {
    for (const name of [products.backpack, products.bikeLight, products.onesie]) {
      await authenticatedInventory.addProduct(name);
    }
    await authenticatedInventory.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation({
      firstName: 'Alex',
      lastName: 'Smith',
      postalCode: '12345',
    });
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');
  });

  await test.step('Calculate the subtotal from displayed product prices', async () => {
    await expect(checkoutPage.productPrices).toHaveCount(3);
    const priceTexts = await checkoutPage.productPrices.allTextContents();
    // Sum integer cents to avoid floating-point rounding errors.
    const subtotalCents = priceTexts.reduce((sum, text) => {
      const price = Number(text.trim().replace(/^\$/, ''));
      expect(Number.isFinite(price)).toBe(true);
      return sum + Math.round(price * 100);
    }, 0);

    await expect(checkoutPage.subtotalLabel).toHaveText(`Item total: $${(subtotalCents / 100).toFixed(2)}`);

    const expectedTaxCents = Math.round(subtotalCents * 0.08);
    await expect(checkoutPage.taxLabel).toHaveText(`Tax: $${(expectedTaxCents / 100).toFixed(2)}`);

    // Read the displayed tax so the total check verifies subtotal + actual tax.
    const taxText = await checkoutPage.taxLabel.innerText();
    const taxCents = Math.round(Number(taxText.replace('Tax: $', '').trim()) * 100);
    const total = (subtotalCents + taxCents) / 100;
    await expect(checkoutPage.totalLabel).toHaveText(`Total: $${total.toFixed(2)}`);
  });
});

const checkoutValidationCases = [
  {
    name: 'missing first name',
    firstName: '',
    lastName: '',
    postalCode: '',
    error: 'Error: First Name is required',
  },
  {
    name: 'missing last name',
    firstName: 'John',
    lastName: '',
    postalCode: '',
    error: 'Error: Last Name is required',
  },
  {
    name: 'missing postal code',
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '',
    error: 'Error: Postal Code is required',
  },
];

for (const { name, firstName, lastName, postalCode, error } of checkoutValidationCases) {
  test(`TC-12. Checkout form validation: ${name}`, async ({ authenticatedInventory, cartPage, checkoutPage, page }) => {
    await test.step('Open the checkout information form with a product in the cart', async () => {
      await authenticatedInventory.addProduct(products.backpack);
      await authenticatedInventory.openCart();
      await cartPage.checkout();
      await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
    });

    const checkoutUrl = page.url();

    await test.step('Submit incomplete information and verify the required-field error', async () => {
      await checkoutPage.fillInformation({ firstName, lastName, postalCode });
      await expect(checkoutPage.errorMessage).toBeVisible();
      await expect(checkoutPage.errorMessage).toHaveText(error);
      await expect(page).toHaveURL(checkoutUrl);
      await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
    });
  });
}

test('TC-13. Complete an order and return to the catalog', async ({ authenticatedInventory, cartPage, checkoutPage, page }) => {
  await test.step('Add a product after login and proceed to checkout', async () => {
    await authenticatedInventory.addProduct(products.backpack);
    await expect(authenticatedInventory.cartBadge).toHaveText('1');
    await authenticatedInventory.openCart();
    await expect(cartPage.productNames).toHaveText([products.backpack]);
    await cartPage.checkout();
    await checkoutPage.fillInformation({
      firstName: 'John',
      lastName: 'Doe',
      postalCode: '12345',
    });
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');
  });

  await test.step('Finish the order and verify confirmation and the absent badge', async () => {
    await checkoutPage.finishOrder();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutPage.cartBadge).toHaveCount(0);
  });

  await test.step('Return to the product catalog', async () => {
    await checkoutPage.backToProducts();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(authenticatedInventory.title).toHaveText('Products');
    await expect(authenticatedInventory.items).toHaveCount(6);
    await expect(authenticatedInventory.cartBadge).toHaveCount(0);
  });
});
