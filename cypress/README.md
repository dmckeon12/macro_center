# MacroCenter E2E Testing with Cypress

This directory contains end-to-end tests for the MacroCenter e-commerce platform using Cypress.

## Test Structure

The tests are organized into three main user journeys:

1. **PC Builder Component** (`pc-builder.cy.js`)
   - Component selection and compatibility checking
   - Performance metrics display
   - Compatible component suggestions
   - Adding components to cart

2. **Authentication Flow** (`authentication.cy.js`)
   - User registration
   - Password validation
   - Login with valid/invalid credentials
   - User logout

3. **Checkout Process** (`checkout.cy.js`)
   - Cart management (add, remove, update quantities)
   - Guest checkout flow
   - Logged-in user checkout flow
   - Payment validation

## Test Data

The test fixtures in the `fixtures` directory contain:
- Sample user data, addresses, and payment information
- PC component data for testing the PC Builder
- Compatible and incompatible component combinations for testing

## Running the Tests

You can run the tests using the following npm commands:

```
# Open Cypress Test Runner (interactive mode)
npm run cypress:open

# Run all tests in headless mode
npm run cypress:run

# Run tests with both frontend and backend servers running
npm run test:e2e
```

## Prerequisites

Before running the tests, make sure:
1. The database is seeded with initial data (`npm run seed:db`)
2. Both frontend and backend servers are running or use `npm run test:e2e` to start both

## Custom Commands

The tests use several custom Cypress commands defined in `support/commands.js`:
- `login()` - Log in a user with given credentials
- `createAccount()` - Register a new user account
- `addProductToCart()` - Add a specific product to the cart
- `selectComponent()` - Select a component in the PC Builder
- `completeCheckout()` - Complete the entire checkout process
