/// <reference types="cypress" />

describe('Checkout Process', () => {
  beforeEach(() => {
    cy.fixture('users.json').as('userData');
    cy.fixture('products.json').as('productData');
    // Clear cart and login for each test
    cy.clearCart();
    cy.visit('/');
  });

  it('should allow adding products to cart and viewing cart', () => {
    // Visit a specific product page
    cy.visit('/products/1'); // Ryzen 9 7950X
    
    // Verify product details are displayed
    cy.get('[data-testid=product-name]').should('be.visible');
    cy.get('[data-testid=product-price]').should('be.visible');
    cy.get('[data-testid=product-price]').should('contain', '$');
    
    // Add product to cart
    cy.get('[data-testid=add-to-cart-button]').click();
    
    // Verify success notification
    cy.get('[data-testid=cart-notification]').should('be.visible');
    cy.get('[data-testid=cart-notification]').should('contain', 'added to cart');
    
    // Visit cart page
    cy.get('[data-testid=cart-icon]').click();
    cy.url().should('include', '/cart');
    
    // Verify product is in cart
    cy.get('[data-testid=cart-items]').should('be.visible');
    cy.get('[data-testid=cart-item]').should('have.length.at.least', 1);
    
    // Verify cart shows correct currency symbol ($)
    cy.get('[data-testid=cart-total]').should('contain', '$');
  });

  it('should allow increasing and decreasing product quantity in cart', () => {
    // Add product to cart
    cy.visit('/products/1'); // Ryzen 9 7950X
    cy.get('[data-testid=add-to-cart-button]').click();
    
    // Visit cart page
    cy.get('[data-testid=cart-icon]').click();
    
    // Get initial quantity and price
    cy.get('[data-testid=cart-item-quantity]').invoke('text').as('initialQuantity');
    cy.get('[data-testid=cart-total]').invoke('text').as('initialTotal');
    
    // Increase quantity
    cy.get('[data-testid=increase-quantity]').click();
    
    // Verify quantity increased
    cy.get('@initialQuantity').then((initialQuantity) => {
      const initialValue = parseInt(initialQuantity);
      cy.get('[data-testid=cart-item-quantity]').should('contain', initialValue + 1);
    });
    
    // Verify total price increased
    cy.get('@initialTotal').then((initialTotal) => {
      const initialValue = parseFloat(initialTotal.replace(/[^0-9.]/g, ''));
      cy.get('[data-testid=cart-total]').invoke('text').then((newTotal) => {
        const newValue = parseFloat(newTotal.replace(/[^0-9.]/g, ''));
        expect(newValue).to.be.greaterThan(initialValue);
      });
    });
    
    // Decrease quantity
    cy.get('[data-testid=decrease-quantity]').click();
    
    // Verify quantity decreased back to original
    cy.get('@initialQuantity').then((initialQuantity) => {
      cy.get('[data-testid=cart-item-quantity]').should('contain', initialQuantity);
    });
  });

  it('should allow removing products from cart', () => {
    // Add product to cart
    cy.visit('/products/1'); // Ryzen 9 7950X
    cy.get('[data-testid=add-to-cart-button]').click();
    
    // Visit cart page
    cy.get('[data-testid=cart-icon]').click();
    
    // Verify product is in cart
    cy.get('[data-testid=cart-item]').should('have.length.at.least', 1);
    
    // Remove product from cart
    cy.get('[data-testid=remove-item]').click();
    
    // Verify cart is empty
    cy.get('[data-testid=empty-cart-message]').should('be.visible');
    cy.get('[data-testid=cart-item]').should('not.exist');
  });

  it('should complete the checkout process with guest checkout', () => {
    cy.get('@userData').then((userData) => {
      const { testAddress, testPayment } = userData;
      
      // Add product to cart
      cy.visit('/products/1'); // Ryzen 9 7950X
      cy.get('[data-testid=add-to-cart-button]').click();
      
      // Visit cart page
      cy.get('[data-testid=cart-icon]').click();
      
      // Proceed to checkout
      cy.get('[data-testid=checkout-button]').click();
      
      // Continue as guest if prompted
      cy.url().then((url) => {
        if (url.includes('/login-checkout')) {
          cy.get('[data-testid=guest-checkout]').click();
        }
      });
      
      // Verify on shipping address page
      cy.url().should('include', '/checkout/shipping');
      
      // Fill out shipping address
      cy.get('[data-testid=fullName-input]').type(testAddress.fullName);
      cy.get('[data-testid=street-input]').type(testAddress.street);
      cy.get('[data-testid=city-input]').type(testAddress.city);
      cy.get('[data-testid=state-input]').type(testAddress.state);
      cy.get('[data-testid=zipCode-input]').type(testAddress.zipCode);
      cy.get('[data-testid=phone-input]').type(testAddress.phone);
      
      // Continue to payment
      cy.get('[data-testid=address-continue-button]').click();
      
      // Verify on payment page
      cy.url().should('include', '/checkout/payment');
      
      // Select credit card payment
      cy.get('[data-testid=credit_card-payment]').click();
      
      // Fill out credit card details
      cy.get('[data-testid=card-number-input]').type(testPayment.cardNumber);
      cy.get('[data-testid=card-expiry-input]').type(testPayment.expiry);
      cy.get('[data-testid=card-cvc-input]').type(testPayment.cvc);
      cy.get('[data-testid=cardholder-name-input]').type(testPayment.name);
      
      // Continue to review
      cy.get('[data-testid=payment-continue-button]').click();
      
      // Verify on review page
      cy.url().should('include', '/checkout/review');
      
      // Verify order summary is displayed
      cy.get('[data-testid=order-summary]').should('be.visible');
      cy.get('[data-testid=order-total]').should('contain', '$');
      
      // Place order
      cy.get('[data-testid=place-order-button]').click();
      
      // Verify order success page
      cy.url().should('include', '/order-success');
      cy.get('[data-testid=order-success-message]').should('be.visible');
      cy.get('[data-testid=order-number]').should('be.visible');
    });
  });

  it('should complete the checkout process with a logged-in user', () => {
    cy.get('@userData').then((userData) => {
      const { testUser, testAddress, testPayment } = userData;
      
      // Login first
      const uniqueEmail = `checkout${Date.now()}@example.com`;
      cy.createAccount(testUser.firstName, testUser.lastName, uniqueEmail, testUser.password);
      
      // Add product to cart
      cy.visit('/products/1'); // Ryzen 9 7950X
      cy.get('[data-testid=add-to-cart-button]').click();
      
      // Visit cart page
      cy.get('[data-testid=cart-icon]').click();
      
      // Proceed to checkout
      cy.get('[data-testid=checkout-button]').click();
      
      // Since user is logged in, should go directly to shipping page
      cy.url().should('include', '/checkout/shipping');
      
      // Fill out shipping address (might be pre-filled if user has saved addresses)
      cy.get('[data-testid=fullName-input]').clear().type(testAddress.fullName);
      cy.get('[data-testid=street-input]').clear().type(testAddress.street);
      cy.get('[data-testid=city-input]').clear().type(testAddress.city);
      cy.get('[data-testid=state-input]').clear().type(testAddress.state);
      cy.get('[data-testid=zipCode-input]').clear().type(testAddress.zipCode);
      cy.get('[data-testid=phone-input]').clear().type(testAddress.phone);
      
      // Save address for future use
      cy.get('[data-testid=save-address]').check();
      
      // Continue to payment
      cy.get('[data-testid=address-continue-button]').click();
      
      // Verify on payment page
      cy.url().should('include', '/checkout/payment');
      
      // Select credit card payment
      cy.get('[data-testid=credit_card-payment]').click();
      
      // Fill out credit card details
      cy.get('[data-testid=card-number-input]').type(testPayment.cardNumber);
      cy.get('[data-testid=card-expiry-input]').type(testPayment.expiry);
      cy.get('[data-testid=card-cvc-input]').type(testPayment.cvc);
      cy.get('[data-testid=cardholder-name-input]').type(testPayment.name);
      
      // Save card for future use
      cy.get('[data-testid=save-payment-method]').check();
      
      // Continue to review
      cy.get('[data-testid=payment-continue-button]').click();
      
      // Verify on review page
      cy.url().should('include', '/checkout/review');
      
      // Place order
      cy.get('[data-testid=place-order-button]').click();
      
      // Verify order success page
      cy.url().should('include', '/order-success');
      cy.get('[data-testid=order-success-message]').should('be.visible');
      
      // Check if order appears in user's order history
      cy.get('[data-testid=view-orders-button]').click();
      cy.url().should('include', '/orders');
      cy.get('[data-testid=order-item]').should('be.visible');
    });
  });

  it('should validate payment information during checkout', () => {
    cy.get('@userData').then((userData) => {
      const { testAddress } = userData;
      
      // Add product to cart
      cy.visit('/products/1'); // Ryzen 9 7950X
      cy.get('[data-testid=add-to-cart-button]').click();
      
      // Visit cart page and proceed to checkout
      cy.get('[data-testid=cart-icon]').click();
      cy.get('[data-testid=checkout-button]').click();
      
      // Continue as guest if prompted
      cy.url().then((url) => {
        if (url.includes('/login-checkout')) {
          cy.get('[data-testid=guest-checkout]').click();
        }
      });
      
      // Fill out shipping address
      cy.get('[data-testid=fullName-input]').type(testAddress.fullName);
      cy.get('[data-testid=street-input]').type(testAddress.street);
      cy.get('[data-testid=city-input]').type(testAddress.city);
      cy.get('[data-testid=state-input]').type(testAddress.state);
      cy.get('[data-testid=zipCode-input]').type(testAddress.zipCode);
      cy.get('[data-testid=phone-input]').type(testAddress.phone);
      cy.get('[data-testid=address-continue-button]').click();
      
      // Select credit card payment
      cy.get('[data-testid=credit_card-payment]').click();
      
      // Enter invalid credit card number
      cy.get('[data-testid=card-number-input]').type('1111111111111111');
      cy.get('[data-testid=card-expiry-input]').type('12/28');
      cy.get('[data-testid=card-cvc-input]').type('123');
      cy.get('[data-testid=cardholder-name-input]').type('Test User');
      
      // Try to continue
      cy.get('[data-testid=payment-continue-button]').click();
      
      // Should show validation error
      cy.get('[data-testid=card-error]').should('be.visible');
      
      // URL should still be at payment page
      cy.url().should('include', '/checkout/payment');
    });
  });
});
