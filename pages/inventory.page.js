import { BasePage } from './base.page.js';
import { parseUsdToCents } from '../utils/currency.js';

export class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.productNames = page.getByTestId('inventory-item-name');
    this.productPrices = page.getByTestId('inventory-item-price');
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  getProductCard(name) {
    return this.items.filter({
      has: this.page.getByTestId('inventory-item-name').filter({ hasText: name }),
    });
  }

  async addProduct(name) {
    const product = this.getProductCard(name);
    await product.getByRole('button', { name: 'Add to cart', exact: true }).click();
  }

  async addAllProducts() {
    for (const card of await this.items.all()) {
      await card.getByRole('button', { name: 'Add to cart', exact: true }).click();
    }
  }

  async sortByNameDescending() {
    await this.sortDropdown.selectOption({ label: 'Name (Z to A)' });
  }

  async sortByPriceAscending() {
    await this.sortDropdown.selectOption({ label: 'Price (low to high)' });
  }

  async sortByPriceDescending() {
    await this.sortDropdown.selectOption({ label: 'Price (high to low)' });
  }

  async getPrices() {
    const prices = await this.productPrices.allTextContents();
    return prices.map((price) => parseUsdToCents(price) / 100);
  }
}
