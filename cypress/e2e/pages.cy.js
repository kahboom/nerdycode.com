describe('About Page', () => {
  beforeEach(() => {
    cy.visit('/about/');
  });

  it('loads successfully', () => {
    cy.checkPageLoads();
  });

  it('displays about content', () => {
    cy.contains('h1', 'About Me').should('be.visible');
    cy.contains(/software engineer/i).should('be.visible');
  });

  it('has profile image', () => {
    cy.get('img[alt="My face"]').should('be.visible');
  });

  it('has contact link', () => {
    cy.get('a[href="/contact"]').should('be.visible');
  });
});

describe('Contact Page', () => {
  beforeEach(() => {
    cy.visit('/contact/');
  });

  it('loads successfully', () => {
    cy.checkPageLoads();
  });
});

describe('Posts Page', () => {
  beforeEach(() => {
    cy.visit('/posts/');
  });

  it('loads successfully', () => {
    cy.checkPageLoads();
  });

  it('displays posts listing', () => {
    cy.get('article a, .postlist a, ul a').should('have.length.at.least', 1);
  });
});

describe('Tags Page', () => {
  beforeEach(() => {
    cy.visit('/tags/');
  });

  it('loads successfully', () => {
    cy.checkPageLoads();
  });

  it('displays tag links', () => {
    cy.get('a[href*="/tags/"]').should('have.length.at.least', 1);
  });

  it('can navigate to a specific tag page', () => {
    cy.get('main a[href*="/tags/"]').first().click();
    cy.url().should('match', /\/tags\/.+/);
  });
});
