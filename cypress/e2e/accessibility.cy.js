describe('Accessibility Basics', () => {
  it('homepage has proper document structure', () => {
    cy.visit('/');

    // Check for proper HTML lang attribute
    cy.get('html').should('have.attr', 'lang', 'en');

    // Check for main content area
    cy.get('main').should('be.visible');

    // Check for header
    cy.get('header').should('be.visible');

    // Check for footer
    cy.get('footer').should('be.visible');
  });

  it('navigation has proper aria attributes', () => {
    cy.visit('/');
    cy.get('nav').should('have.attr', 'aria-label', 'navigation');
  });

  it('images have alt attributes', () => {
    cy.visit('/about/');

    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'alt');
    });
  });

  it('page has meta viewport for mobile', () => {
    cy.visit('/');
    cy.get('meta[name="viewport"]')
      .should('have.attr', 'content')
      .and('include', 'width=device-width');
  });

  it('page has meta description', () => {
    cy.visit('/');
    cy.get('meta[name="description"]').should('exist');
  });
});
