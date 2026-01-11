import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('can navigate to About page', async ({ page }) => {
    await page.goto('/');

    // Click on About link in navigation
    await page.click('a[href="/about/"]');

    // Verify we're on the About page
    await expect(page).toHaveURL(/\/about\/?/);
    await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible();
  });

  test('can navigate to Posts page', async ({ page }) => {
    await page.goto('/');

    // Click on Posts/Blog link
    await page.click('a[href="/posts/"]');

    // Verify we're on the Posts page
    await expect(page).toHaveURL(/\/posts\/?/);
  });

  test('can navigate to Contact page', async ({ page }) => {
    // Contact page isn't in the main navigation, so navigate directly
    await page.goto('/contact/');

    // Verify we're on the Contact page
    await expect(page).toHaveURL(/\/contact\/?/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('brand logo links to homepage', async ({ page }) => {
    await page.goto('/about/');

    // Click on the brand/logo
    await page.click('.navbar-brand a');

    // Verify we're back on the homepage
    await expect(page).toHaveURL('/');
  });

  test('can navigate to a blog post from homepage', async ({ page }) => {
    await page.goto('/');

    // Find and click on a post link in the Latest Ramblings section
    const postLink = page.locator('.home--latest-ramblings a').first();

    if (await postLink.isVisible()) {
      const href = await postLink.getAttribute('href');
      await postLink.click();

      // Verify navigation occurred
      if (href) {
        await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      }
    }
  });
});
