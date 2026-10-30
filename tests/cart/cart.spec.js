import { test, expect } from '../../fixtures/base.test.js';
import { products } from '../../data/products.js';
import { sortTextAscending } from '../../utils/sorting.js';

test('user can add a product to the cart @smoke', async ({ authenticatedInventory, cartPage }) => {
  await authenticatedInventory.addProduct(products.backpack);
  await expect(authenticatedInventory.cartBadge).toHaveText('1');
  await authenticatedInventory.openCart();
  await expect(cartPage.title).toHaveText('Your Cart');
  await expect(cartPage.productNames).toHaveText([products.backpack]);
  await expect(cartPage.checkoutButton).toBeVisible();
});

test('TC-09. Cart contains the added products with quantity one', async ({ authenticatedInventory, cartPage }) => {
  const addedProducts = [products.backpack, products.bikeLight, products.onesie];

  await test.step('Add Backpack, Bike Light, and Onesie and open the cart', async () => {
    for (const name of addedProducts) {
      await authenticatedInventory.addProduct(name);
    }
    await authenticatedInventory.openCart();
    await expect(cartPage.title).toHaveText('Your Cart');
  });

  await test.step('Verify the exact product names regardless of order', async () => {
    await expect(cartPage.items).toHaveCount(3);
    await expect.poll(async () => {
      const names = await cartPage.productNames.allTextContents();
      return sortTextAscending(names);
    }).toEqual(sortTextAscending(addedProducts));
  });

  await test.step('Verify quantity one for every cart item', async () => {
    for (const item of await cartPage.items.all()) {
      await expect(item.getByTestId('item-quantity')).toHaveText('1');
    }
  });
});

test('TC-10. Remove products from the cart', async ({ authenticatedInventory, cartPage }) => {
  await test.step('Add two products and open the cart', async () => {
    await authenticatedInventory.addProduct(products.backpack);
    await authenticatedInventory.addProduct(products.bikeLight);
    await authenticatedInventory.openCart();
    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.items).toHaveCount(2);
    await expect(cartPage.cartBadge).toHaveText('2');
  });

  await test.step('Remove Backpack and verify one product remains', async () => {
    await cartPage.removeBackpack();
    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.productNames).toHaveText([products.bikeLight]);
    await expect(cartPage.cartBadge).toHaveText('1');
  });

  await test.step('Remove the last product and verify the badge element is absent', async () => {
    await cartPage.removeProduct(products.bikeLight);
    await expect(cartPage.items).toHaveCount(0);
    await expect(cartPage.cartBadge).toHaveCount(0);
  });
});
