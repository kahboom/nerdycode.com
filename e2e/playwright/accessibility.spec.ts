import { test, expect } from '@playwright/test';

test.describe('Accessibility Basics', () => {
  test('homepage has proper document structure', async ({ page }) => {
    await page.goto('/');

    // Check for proper HTML lang attribute
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');

    // Check for main content area
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Check for header/nav
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check for footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('navigation has proper aria attributes', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav');
    await expect(nav).toHaveAttribute('aria-label', 'navigation');
  });

  test('images have alt attributes', async ({ page }) => {
    await page.goto('/about/');

    // Check that images have alt text
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('page has meta viewport for mobile', async ({ page }) => {
    await page.goto('/');

    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  test('page has meta description', async ({ page }) => {
    await page.goto('/');

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveCount(1);
  });
});
