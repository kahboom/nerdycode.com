import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/NerdyCode/);
  });

  test('displays the NerdyCode logo/brand in navbar', async ({ page }) => {
    // Use more specific selector to avoid matching the hamburger menu
    const brand = page.locator('.navbar-brand a.navbar-item');
    await expect(brand).toBeVisible();
    await expect(brand.locator('svg')).toBeVisible();
  });

  test('displays introduction text', async ({ page }) => {
    // Text appears in both mobile and desktop layouts - target the desktop version
    await expect(page.locator('.landing .typing')).toBeVisible();
  });

  test('has working navigation links', async ({ page }) => {
    // Check that navbar menu exists
    const navMenu = page.locator('.navbar-menu');
    await expect(navMenu).toBeVisible();

    // Check for navigation items
    const navItems = page.locator('.navbar-item.is-nav-link');
    await expect(navItems).not.toHaveCount(0);
  });

  test('displays Latest Ramblings section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Latest Ramblings/i })).toBeVisible();
  });

  test('has theme toggle component', async ({ page }) => {
    const themeToggle = page.locator('theme-toggle');
    await expect(themeToggle).toBeVisible();
  });

  test('has footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
