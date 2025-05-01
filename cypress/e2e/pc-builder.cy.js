/// <reference types="cypress" />

describe('PC Builder Component', () => {
  beforeEach(() => {
    cy.fixture('products.json').as('productData');
    // Start fresh each time
    cy.clearCart();
  });

  it('should allow users to select components and check compatibility', () => {
    cy.get('@productData').then((productData) => {
      // Navigate to PC Builder
      cy.visit('/pc-builder');
      cy.get('[data-testid=pc-builder-container]').should('be.visible');
      cy.get('[data-testid=pc-builder-title]').should('contain', 'PC Builder');

      // Verify initial state with empty component slots
      cy.get('[data-testid=cpu-empty]').should('exist');
      cy.get('[data-testid=gpu-empty]').should('exist');
      cy.get('[data-testid=motherboard-empty]').should('exist');
      cy.get('[data-testid=ram-empty]').should('exist');
      cy.get('[data-testid=storage-empty]').should('exist');
      cy.get('[data-testid=psu-empty]').should('exist');

      // Select compatible components from our fixture (AMD platform)
      const { compatible_build } = productData;

      // Select CPU
      cy.get('[data-testid=cpu-select-button]').click();
      cy.get(`[data-testid=component-${compatible_build.cpu}]`).click();
      cy.get('[data-testid=cpu-component]').should('not.contain', 'Select CPU');

      // Select Motherboard
      cy.get('[data-testid=motherboard-select-button]').click();
      cy.get(`[data-testid=component-${compatible_build.motherboard}]`).click();
      cy.get('[data-testid=motherboard-component]').should('not.contain', 'Select Motherboard');

      // Verify compatibility status is shown and is compatible
      cy.get('[data-testid=compatibility-status]').should('contain', 'Compatible');

      // Add more components
      cy.get('[data-testid=ram-select-button]').click();
      cy.get(`[data-testid=component-${compatible_build.ram}]`).click();

      cy.get('[data-testid=gpu-select-button]').click();
      cy.get(`[data-testid=component-${compatible_build.gpu}]`).click();

      cy.get('[data-testid=storage-select-button]').click();
      cy.get(`[data-testid=component-${compatible_build.storage}]`).click();

      cy.get('[data-testid=psu-select-button]').click();
      cy.get(`[data-testid=component-${compatible_build.psu}]`).click();

      // Verify all components are selected
      cy.get('[data-testid=empty-component]').should('not.exist');
      
      // Verify price display shows the correct currency symbol ($)
      cy.get('[data-testid=total-price]').invoke('text').should('include', '$');

      // Verify "Add All to Cart" button is enabled
      cy.get('[data-testid=add-all-to-cart]').should('be.enabled');
      
      // Add all components to cart
      cy.get('[data-testid=add-all-to-cart]').click();
      
      // Verify we got a success notification
      cy.get('[data-testid=cart-notification]').should('be.visible');
      cy.get('[data-testid=cart-notification]').should('contain', 'added to cart');
    });
  });

  it('should warn users about incompatible components', () => {
    cy.get('@productData').then((productData) => {
      // Navigate to PC Builder
      cy.visit('/pc-builder');
      
      // Select incompatible components from our fixture (AM5 CPU with LGA1700 motherboard)
      const { incompatible_build } = productData;

      // Select CPU (AM5 socket)
      cy.get('[data-testid=cpu-select-button]').click();
      cy.get(`[data-testid=component-${incompatible_build.cpu}]`).click();
      
      // Select incompatible motherboard (LGA1700 socket)
      cy.get('[data-testid=motherboard-select-button]').click();
      cy.get(`[data-testid=component-${incompatible_build.motherboard}]`).click();
      
      // Verify compatibility warning is shown
      cy.get('[data-testid=compatibility-status]').should('contain', 'Incompatible');
      cy.get('[data-testid=compatibility-warning]').should('be.visible');
      
      // Verify the specific incompatibility is mentioned
      cy.get('[data-testid=compatibility-warning]').should('contain', 'socket');
    });
  });

  it('should display performance metrics based on selected components', () => {
    cy.get('@productData').then((productData) => {
      // Navigate to PC Builder
      cy.visit('/pc-builder');
      
      // Select CPU and GPU to trigger performance metrics
      const { pc_components } = productData;
      
      // Select high-end CPU
      cy.get('[data-testid=cpu-select-button]').click();
      cy.get(`[data-testid=component-${pc_components.cpu.id}]`).click();
      
      // Select high-end GPU
      cy.get('[data-testid=gpu-select-button]').click();
      cy.get(`[data-testid=component-${pc_components.gpu.id}]`).click();
      
      // Verify performance metrics are shown
      cy.get('[data-testid=performance-metrics]').should('be.visible');
      cy.get('[data-testid=gaming-performance]').should('be.visible');
      
      // The high-end components should show good performance indicators
      cy.get('[data-testid=gaming-performance]').should('not.contain', 'Low');
    });
  });

  it('should suggest compatible components based on current selection', () => {
    // Navigate to PC Builder
    cy.visit('/pc-builder');
    
    // Select a CPU with AM4 socket
    cy.get('[data-testid=cpu-select-button]').click();
    // Find and select Ryzen 5 5600X (AM4 socket)
    cy.get('[data-testid=component-3]').click(); 
    
    // Open motherboard selection to see suggestions
    cy.get('[data-testid=motherboard-select-button]').click();
    
    // Verify suggestion section is visible
    cy.get('[data-testid=suggestions-section]').should('be.visible');
    
    // Should suggest compatible AM4 motherboards
    cy.get('[data-testid=suggestions-section]').should('contain', 'AM4');
  });
});
