// Custom commands for Cypress tests

// Login command
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('[data-testid=email-input]').type(email);
  cy.get('[data-testid=password-input]').type(password);
  cy.get('[data-testid=login-button]').click();
  cy.url().should('not.include', '/login');
  cy.wait(1000); // Wait for login to complete
});

// Navigate to PC Builder
Cypress.Commands.add('navigateToPCBuilder', () => {
  cy.visit('/');
  cy.get('[data-testid=pc-builder-link]').click();
  cy.url().should('include', '/pc-builder');
  cy.get('[data-testid=pc-builder-container]').should('be.visible');
});

// Add product to cart
Cypress.Commands.add('addProductToCart', (productId) => {
  cy.visit(`/products/${productId}`);
  cy.get('[data-testid=add-to-cart-button]').click();
  cy.get('[data-testid=cart-notification]').should('be.visible');
});

// Clear cart
Cypress.Commands.add('clearCart', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('localCart', JSON.stringify([]));
  });
  cy.reload();
});

// Create user account
Cypress.Commands.add('createAccount', (firstName, lastName, email, password) => {
  cy.visit('/register');
  cy.get('[data-testid=firstName-input]').type(firstName);
  cy.get('[data-testid=lastName-input]').type(lastName);
  cy.get('[data-testid=email-input]').type(email);
  cy.get('[data-testid=password-input]').type(password);
  cy.get('[data-testid=confirm-password-input]').type(password);
  cy.get('[data-testid=register-button]').click();
  cy.url().should('not.include', '/register');
});

// Select component in PC Builder
Cypress.Commands.add('selectComponent', (category, componentId) => {
  cy.get(`[data-testid=${category}-select-button]`).click();
  cy.get(`[data-testid=component-${componentId}]`).click();
  cy.get(`[data-testid=${category}-component]`).should('contain', componentId);
});

// Check compatibility in PC Builder
Cypress.Commands.add('checkCompatibility', () => {
  cy.get('[data-testid=compatibility-status]').should('be.visible');
});

// Add all components to cart
Cypress.Commands.add('addAllToCart', () => {
  cy.get('[data-testid=add-all-to-cart]').click();
  cy.get('[data-testid=cart-notification]').should('be.visible');
});

// Complete checkout
Cypress.Commands.add('completeCheckout', (address, payment) => {
  cy.visit('/cart');
  cy.get('[data-testid=checkout-button]').click();
  
  // Fill shipping address
  cy.get('[data-testid=fullName-input]').type(address.fullName);
  cy.get('[data-testid=street-input]').type(address.street);
  cy.get('[data-testid=city-input]').type(address.city);
  cy.get('[data-testid=state-input]').type(address.state);
  cy.get('[data-testid=zipCode-input]').type(address.zipCode);
  cy.get('[data-testid=phone-input]').type(address.phone);
  cy.get('[data-testid=address-continue-button]').click();
  
  // Select payment method
  cy.get(`[data-testid=${payment.method}-payment]`).click();
  
  if (payment.method === 'credit_card') {
    cy.get('[data-testid=card-number-input]').type(payment.cardNumber);
    cy.get('[data-testid=card-expiry-input]').type(payment.expiry);
    cy.get('[data-testid=card-cvc-input]').type(payment.cvc);
    cy.get('[data-testid=cardholder-name-input]').type(payment.name);
  }
  
  cy.get('[data-testid=payment-continue-button]').click();
  
  // Review and place order
  cy.get('[data-testid=place-order-button]').click();
  
  // Verify success page
  cy.url().should('include', '/order-success');
});
