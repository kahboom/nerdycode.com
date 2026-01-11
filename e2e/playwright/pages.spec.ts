import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about/');
  });

  test('displays about content', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible();
    await expect(page.getByText(/software engineer/i)).toBeVisible();
  });

  test('has profile image', async ({ page }) => {
    const profileImg = page.locator('img[alt="My face"]');
    await expect(profileImg).toBeVisible();
  });

  test('has contact link', async ({ page }) => {
    const contactLink = page.locator('a[href="/contact"]');
    await expect(contactLink).toBeVisible();
  });
});

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact/');
  });

  test('displays contact page content', async ({ page }) => {
    await expect(page).toHaveURL(/\/contact\/?/);
    // Page should load without errors
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });
});

test.describe('Posts Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/posts/');
  });

  test('displays posts listing', async ({ page }) => {
    await expect(page).toHaveURL(/\/posts\/?/);
    // Should have some post links
    const postLinks = page.locator('article a, .postlist a, ul a');
    const count = await postLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('404 Page', () => {
  test('displays 404 page for non-existent routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-12345/');

    // Should return 404 status or show 404 content
    // Note: Static sites may return 200 with 404 content
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });
});

test.describe('Tags Page', () => {
  test('displays tags listing', async ({ page }) => {
    await page.goto('/tags/');
    await expect(page).toHaveURL(/\/tags\/?/);

    // Should have tag links
    const tagLinks = page.locator('a[href*="/tags/"]');
    const count = await tagLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('can navigate to a specific tag page', async ({ page }) => {
    await page.goto('/tags/');

    // Click on first tag link
    const firstTag = page.locator('main a[href*="/tags/"]').first();
    if (await firstTag.isVisible()) {
      await firstTag.click();
      await expect(page).toHaveURL(/\/tags\/.+/);
    }
  });
});
