import { expect, test } from '@playwright/test';

test.describe('Deployed Live Smoke Test', () => {
  test('should load the homepage and check basic layout elements', async ({ page }) => {
    await page.goto('/');
    
    // Check main brand logo/link
    const brand = page.locator('.brand');
    await expect(brand).toBeVisible();
    await expect(brand).toContainText('ArenaFlow');

    // Check presence of the two persona entry cards
    await expect(page.locator('text=For fans')).toBeVisible();
    await expect(page.locator('text=For organizers')).toBeVisible();

    // Check main navigation link presence
    await expect(page.locator('nav a:has-text("Fan Assistant")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Operations")')).toBeVisible();
  });
});
