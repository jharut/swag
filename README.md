# Swag Labs Playwright automation

JavaScript end-to-end tests for https://www.saucedemo.com using page objects and test-scoped fixtures.

## Structure

```text
├── data/                    # Accounts and product data
├── fixtures/base.test.js    # Shared test foundation and authenticated setup
├── pages/                   # Locators and reusable UI actions
├── utils/                   # USD parsing/formatting and array sorting helpers
├── tests/
│   ├── auth/login.spec.js   # Successful and rejected login
│   ├── inventory/inventory.spec.js # Product lists, sorting, and adding items
│   ├── cart/cart.spec.js    # Cart contents and removal
│   └── checkout/checkout.spec.js # Totals, validation, and completed orders
├── playwright.config.js    # Browsers, retries, reporting, artifacts
├── package.json            # Dependencies and commands
└── package-lock.json       # Exact dependency versions after installation
```

Tests describe business scenarios and own their assertions. Page objects own locators and UI actions. Fixtures construct page objects and prepare an isolated authenticated session when requested. Data files hold reusable inputs. Each test receives a fresh browser context; tests can run independently and in parallel.

## Test scenarios

- **TC-01:** Successful login.
- **TC-02:** Locked-out user error.
- **TC-03:** Login validation and error dismissal (3 cases).
- **TC-04:** Exact list of six product names.
- **TC-05:** Product name sorting A–Z and Z–A.
- **TC-06:** Price sorting low–high and high–low.
- **TC-07:** Find a product card by name, check its price, and add it.
- **TC-08:** Add all six products in a loop.
- **TC-09:** Cart contains the selected products, each with quantity one.
- **TC-10:** Remove products and verify the empty-cart badge disappears.
- **TC-11:** Calculate and verify checkout subtotal, tax, and total.
- **TC-12:** Checkout required-field validation (3 cases).
- **TC-13:** Complete an order and return to the catalog.
- **Smoke:** Add one product and verify it in the cart.

18 tests per browser; 54 runs across Chromium, Firefox, and WebKit.

## Setup

Use Node.js 22 or newer:

```sh
npm install
npx playwright install
npm run test:chromium
```

Once a lockfile exists, use `npm ci` for reproducible installs. On Linux CI, install browser system dependencies with `npx playwright install --with-deps`.

## Commands

```sh
npm test                 # Chromium, Firefox, and WebKit
npm run test:chromium    # Chromium only
npm run test:headed      # Visible Chromium browser
npm run test:ui          # Interactive runner
npm run test:debug       # Debug Chromium tests
npm run test:smoke       # Tests tagged @smoke across all browsers
npm run test:list        # Discover tests without launching a browser
npm run report           # Open the last HTML report
```

Failures save screenshots, videos, and traces under `test-results/`; the HTML report is under `playwright-report/`. CI enables two retries and rejects committed `test.only` calls.

## Configuration

The default URL and public demo credentials work without configuration. Override them through shell environment variables:

```sh
BASE_URL=https://www.saucedemo.com SWAG_USERNAME=standard_user SWAG_PASSWORD=secret_sauce npm run test:chromium
```

Environment variables are read directly from the process; `.env` files are not loaded automatically. The locked-out account and inventory expectations are specific to Sauce Demo. Update the page objects, data, and assertions when targeting another application.

## Adding coverage

1. Add page-specific locators and actions to `pages/`. Page objects extend `BasePage` and call `super(page)` to reuse the page reference, title, cart link and badge, error locators, and shared `openCart()` / `dismissError()` actions from `pages/base.page.js`.
2. Expose a new page object in `fixtures/base.test.js` when needed. Import `test` and `expect` from this base test in every spec. Playwright fixtures provide shared setup instead of test-class inheritance; `authenticatedInventory` logs in only for tests that request it.
3. Add independent scenarios under `tests/<feature>/`, importing `test` and `expect` from the custom fixture.
4. Use Playwright locator assertions and automatic waiting. Avoid fixed sleeps and dependencies on test execution order.

Reference: [Playwright fixtures](https://playwright.dev/docs/test-fixtures).
