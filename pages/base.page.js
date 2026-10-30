// Shared locators are available to every page object. They are only resolved
// when used, so a page does not need to display all of them.
export class BasePage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.errorMessage = page.getByTestId('error');
    this.errorButton = page.getByTestId('error-button');
  }

  async openCart() {
    await this.cartLink.click();
  }

  async dismissError() {
    await this.errorButton.click();
  }
}
