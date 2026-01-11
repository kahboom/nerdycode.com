describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads successfully', () => {
    cy.checkPageLoads();
  });

  it('has correct title', () => {
    cy.title().should('include', 'NerdyCode');
  });

  it('displays the NerdyCode brand/logo', () => {
    cy.get('.navbar-brand a').should('be.visible');
    cy.get('.navbar-brand svg').should('exist');
  });

  it('displays introduction text', () => {
    cy.contains("Hello, world. I'm Rachel.").should('be.visible');
  });

  it('has navigation menu', () => {
    cy.get('.navbar-menu').should('be.visible');
    cy.get('.navbar-item.is-nav-link').should('have.length.at.least', 1);
  });

  it('displays Latest Ramblings section', () => {
    cy.contains('h2', /Latest Ramblings/i).should('be.visible');
  });

  it('has theme toggle', () => {
    cy.get('theme-toggle').should('exist');
  });

  it('has footer', () => {
    cy.get('footer').should('be.visible');
  });
});
