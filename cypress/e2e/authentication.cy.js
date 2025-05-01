/// <reference types="cypress" />

describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.fixture('users.json').as('userData');
    // Clear any existing authentication
    cy.window().then((win) => {
      win.localStorage.removeItem('accessToken');
      win.localStorage.removeItem('refreshToken');
      win.localStorage.removeItem('user');
    });
    cy.reload();
  });

  it('should allow users to register a new account', () => {
    cy.get('@userData').then((userData) => {
      const { testUser } = userData;
      
      // Generate unique email to avoid conflicts
      const uniqueEmail = `test${Date.now()}@example.com`;
      
      // Visit registration page
      cy.visit('/register');
      cy.get('[data-testid=register-form]').should('be.visible');
      
      // Fill out registration form
      cy.get('[data-testid=firstName-input]').type(testUser.firstName);
      cy.get('[data-testid=lastName-input]').type(testUser.lastName);
      cy.get('[data-testid=email-input]').type(uniqueEmail);
      cy.get('[data-testid=password-input]').type(testUser.password);
      cy.get('[data-testid=confirm-password-input]').type(testUser.password);
      
      // Submit form
      cy.get('[data-testid=register-button]').click();
      
      // Verify successful registration
      cy.url().should('not.include', '/register');
      
      // Should redirect to home page or dashboard
      cy.get('[data-testid=user-menu]').should('be.visible');
      
      // Verify user data is stored in localStorage
      cy.window().then((win) => {
        expect(win.localStorage.getItem('accessToken')).to.exist;
        expect(win.localStorage.getItem('user')).to.exist;
        
        // Verify user data contents
        const user = JSON.parse(win.localStorage.getItem('user'));
        expect(user.firstName).to.equal(testUser.firstName);
        expect(user.lastName).to.equal(testUser.lastName);
        expect(user.email).to.equal(uniqueEmail);
      });
    });
  });

  it('should enforce password complexity requirements during registration', () => {
    cy.visit('/register');
    
    // Fill out form with valid data except for weak password
    cy.get('[data-testid=firstName-input]').type('Test');
    cy.get('[data-testid=lastName-input]').type('User');
    cy.get('[data-testid=email-input]').type('weak-password@example.com');
    
    // Try a weak password
    cy.get('[data-testid=password-input]').type('weak');
    cy.get('[data-testid=confirm-password-input]').type('weak');
    
    // Try to submit form
    cy.get('[data-testid=register-button]').click();
    
    // Should see validation error
    cy.get('[data-testid=password-error]').should('be.visible');
    cy.get('[data-testid=password-error]').should('contain', 'Password must');
    
    // URL should not change - still on register page
    cy.url().should('include', '/register');
  });

  it('should allow users to login with valid credentials', () => {
    cy.get('@userData').then((userData) => {
      const { testUser } = userData;
      
      // First create an account
      const uniqueEmail = `login${Date.now()}@example.com`;
      cy.createAccount(testUser.firstName, testUser.lastName, uniqueEmail, testUser.password);
      
      // Logout
      cy.get('[data-testid=user-menu]').click();
      cy.get('[data-testid=logout-button]').click();
      
      // Now try to login
      cy.visit('/login');
      cy.get('[data-testid=login-form]').should('be.visible');
      
      // Fill out login form
      cy.get('[data-testid=email-input]').type(uniqueEmail);
      cy.get('[data-testid=password-input]').type(testUser.password);
      
      // Submit form
      cy.get('[data-testid=login-button]').click();
      
      // Verify successful login
      cy.url().should('not.include', '/login');
      
      // Should see user menu
      cy.get('[data-testid=user-menu]').should('be.visible');
      
      // Verify user data is stored in localStorage
      cy.window().then((win) => {
        expect(win.localStorage.getItem('accessToken')).to.exist;
        expect(win.localStorage.getItem('user')).to.exist;
        
        const user = JSON.parse(win.localStorage.getItem('user'));
        expect(user.email).to.equal(uniqueEmail);
      });
    });
  });

  it('should prevent login with invalid credentials', () => {
    // Try to login with invalid credentials
    cy.visit('/login');
    
    // Fill out login form with incorrect data
    cy.get('[data-testid=email-input]').type('wrong@example.com');
    cy.get('[data-testid=password-input]').type('wrongpassword');
    
    // Submit form
    cy.get('[data-testid=login-button]').click();
    
    // Should see error message
    cy.get('[data-testid=login-error]').should('be.visible');
    cy.get('[data-testid=login-error]').should('contain', 'Invalid');
    
    // URL should not change - still on login page
    cy.url().should('include', '/login');
  });

  it('should allow users to logout', () => {
    cy.get('@userData').then((userData) => {
      const { testUser } = userData;
      
      // Login first
      cy.login(testUser.email, testUser.password);
      
      // Verify logged in state
      cy.get('[data-testid=user-menu]').should('be.visible');
      
      // Logout
      cy.get('[data-testid=user-menu]').click();
      cy.get('[data-testid=logout-button]').click();
      
      // Verify logged out state
      cy.get('[data-testid=login-link]').should('be.visible');
      
      // Verify localStorage tokens are cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('accessToken')).to.be.null;
        expect(win.localStorage.getItem('user')).to.be.null;
      });
    });
  });
});
