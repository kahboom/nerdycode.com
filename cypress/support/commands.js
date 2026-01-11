// ***********************************************
// Custom commands for Cypress
// https://on.cypress.io/custom-commands
// ***********************************************

// Example: cy.checkAccessibility()
Cypress.Commands.add('checkPageLoads', () => {
  cy.get('header').should('be.visible');
  cy.get('main').should('be.visible');
  cy.get('footer').should('be.visible');
});

// Example: Check if navigation works
Cypress.Commands.add('navigateTo', (path, expectedTitle) => {
  cy.visit(path);
  if (expectedTitle) {
    cy.title().should('include', expectedTitle);
  }
  cy.checkPageLoads();
});
