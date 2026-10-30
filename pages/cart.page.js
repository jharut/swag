export class CartPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.cartList = page.getByTestId('cart-list');
    this.items = this.cartList.getByTestId('inventory-item');
    this.productNames = this.cartList.getByTestId('inventory-item-name');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
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
