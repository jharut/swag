# Swag Labs Playwright automation

JavaScript end-to-end tests for https://www.saucedemo.com using page objects and test-scoped fixtures.

## Structure

```text
├── data/                    # Accounts and product data
├── fixtures/test.js         # Page objects and authenticated setup
├── pages/                   # Locators and reusable UI actions
├── tests/
│   ├── auth/login.spec.js   # Successful and rejected login
│   └── cart/cart.spec.js    # Add-to-cart scenario
├── playwright.config.js    # Browsers, retries, reporting, artifacts
├── package.json            # Dependencies and commands
└── package-lock.json       # Exact dependency versions after installation
```

Tests describe business scenarios and own their assertions. Page objects own locators and UI actions. Fixtures construct page objects and prepare an isolated authenticated session when requested. Data files hold reusable inputs. Each test receives a fresh browser context; tests can run independently and in parallel.

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

1. Add page-specific locators and actions to `pages/`.
2. Expose a new page object in `fixtures/test.js` when needed.
3. Add independent scenarios under `tests/<feature>/`, importing `test` and `expect` from the custom fixture.
4. Use Playwright locator assertions and automatic waiting. Avoid fixed sleeps and dependencies on test execution order.

Reference: [Playwright fixtures](https://playwright.dev/docs/test-fixtures).
