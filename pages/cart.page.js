import { BasePage } from './base.page.js';

export class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartList = page.getByTestId('cart-list');
    this.items = this.cartList.getByTestId('inventory-item');
    this.productNames = this.cartList.getByTestId('inventory-item-name');
    this.removeBackpackButton = this.cartList.getByTestId('remove-sauce-labs-backpack');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async removeBackpack() {
    await this.removeBackpackButton.click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async removeProduct(name) {
    const item = this.items.filter({
      has: this.page.getByText(name, { exact: true }),
    });
    await item.getByRole('button', { name: 'Remove', exact: true }).click();
  }
}
