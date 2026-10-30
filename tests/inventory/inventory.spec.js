import { test, expect } from '../../fixtures/base.test.js';
import { expectedProductNames, products } from '../../data/products.js';
import { sortNumbersAscending, sortNumbersDescending, sortTextAscending } from '../../utils/sorting.js';

test('TC-04. Product name list', async ({ authenticatedInventory }) => {
  await test.step('Verify all six product names in the default order', async () => {
    await expect(authenticatedInventory.productNames).toHaveCount(6);
    await expect(authenticatedInventory.productNames).toHaveText(expectedProductNames);
  });
});

test('TC-06. Sort product prices low to high and high to low', async ({ authenticatedInventory }) => {
  const expectedPrices = [7.99, 9.99, 15.99, 15.99, 29.99, 49.99];
  await expect(authenticatedInventory.productPrices).toHaveCount(6);

  await test.step('Verify prices sorted from low to high', async () => {
    await authenticatedInventory.sortByPriceAscending();
    await expect.poll(() => authenticatedInventory.getPrices()).toEqual(expectedPrices);
    const prices = await authenticatedInventory.getPrices();
    expect(prices).toEqual(sortNumbersAscending(prices));
  });

  await test.step('Verify prices sorted from high to low', async () => {
    await authenticatedInventory.sortByPriceDescending();
    await expect.poll(() => authenticatedInventory.getPrices()).toEqual([...expectedPrices].reverse());
    const prices = await authenticatedInventory.getPrices();
    expect(prices).toEqual(sortNumbersDescending(prices));
  });
});

test('TC-05. Sort product names A to Z and Z to A', async ({ authenticatedInventory }) => {
  await expect(authenticatedInventory.productNames).toHaveCount(6);
  const originalNames = await authenticatedInventory.productNames.allTextContents();

  await test.step('Verify product names are sorted A to Z by default', async () => {
    const ascendingNames = sortTextAscending(originalNames);
    expect(originalNames).toEqual(ascendingNames);
  });

  await test.step('Select Name (Z to A) and verify the reversed list', async () => {
    await authenticatedInventory.sortByNameDescending();
    const reversedNames = [...originalNames].reverse();
    await expect(authenticatedInventory.productNames).toHaveText(reversedNames);
    const sortedNames = await authenticatedInventory.productNames.allTextContents();
    expect(sortedNames).toEqual(reversedNames);
  });
});

test('TC-07. Find a product card by name and add it to the cart', async ({ authenticatedInventory }) => {
  const jacketCard = authenticatedInventory.getProductCard(products.fleeceJacket);
  await expect(jacketCard).toHaveCount(1);

  await test.step('Verify the price inside the jacket card', async () => {
    await expect(jacketCard.getByTestId('inventory-item-price')).toHaveText('$49.99');
  });

  await test.step('Add the jacket and verify the button and cart badge', async () => {
    await jacketCard.getByRole('button', { name: 'Add to cart', exact: true }).click();
    await expect(jacketCard.getByRole('button', { name: 'Remove', exact: true })).toBeVisible();
    await expect(jacketCard.getByRole('button', { name: 'Add to cart', exact: true })).toHaveCount(0);
    await expect(authenticatedInventory.cartBadge).toHaveText('1');
  });
});

test('TC-08. Add all products to the cart in a loop', async ({ authenticatedInventory }) => {
  await expect(authenticatedInventory.items).toHaveCount(6);

  await test.step('Add each product from its card', async () => {
    await authenticatedInventory.addAllProducts();
  });

  await test.step('Verify the cart badge and Remove button in every card', async () => {
    await expect(authenticatedInventory.cartBadge).toHaveText('6');
    for (const card of await authenticatedInventory.items.all()) {
      await expect(card.getByRole('button', { name: 'Remove', exact: true })).toBeVisible();
      await expect(card.getByRole('button', { name: 'Add to cart', exact: true })).toHaveCount(0);
    }
  });
});
