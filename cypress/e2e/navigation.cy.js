describe('Navigation', () => {
  it('can navigate to About page', () => {
    cy.visit('/');
    cy.get('a[href="/about/"]').first().click();
    cy.url().should('include', '/about');
    cy.contains('h1', 'About Me').should('be.visible');
  });

  it('can navigate to Posts page', () => {
    cy.visit('/');
    cy.get('a[href="/posts/"]').first().click();
    cy.url().should('include', '/posts');
  });

  it('can navigate to Contact page', () => {
    cy.visit('/');
    cy.get('a[href="/contact/"]').first().click();
    cy.url().should('include', '/contact');
  });

  it('brand logo links to homepage', () => {
    cy.visit('/about/');
    cy.get('.navbar-brand a').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('can navigate to a blog post from homepage', () => {
    cy.visit('/');
    cy.get('.home--latest-ramblings a').first().then(($link) => {
      const href = $link.attr('href');
      cy.wrap($link).click();
      cy.url().should('include', href);
    });
  });
});
