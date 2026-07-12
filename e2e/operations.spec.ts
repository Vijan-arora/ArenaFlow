import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Operations Command Center', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/operations');
  });

  test('should pass basic accessibility scans', async ({ page }) => {
    // Wait for the operations data to load before scan
    await expect(page.locator('h2:has-text("Zone crowd density")')).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('should load live operational metrics and generate AI briefing', async ({ page }) => {
    // Assert crowd density and incidents containers are loaded
    await expect(page.locator('h2:has-text("Zone crowd density")')).toBeVisible();
    await expect(page.locator('h2:has-text("Incidents")')).toBeVisible();
    await expect(page.locator('h2:has-text("Sustainability")')).toBeVisible();

    // Verify incident list container is visible
    await expect(page.locator('.incident-list')).toBeVisible();

    // Generate AI briefing
    const briefingBtn = page.locator('button:has-text("Generate AI briefing")');
    await expect(briefingBtn).toBeVisible();
    await briefingBtn.click();

    // Check loading indicator shows up or briefing displays
    const briefingText = page.locator('.briefing');
    await expect(briefingText).toBeVisible({ timeout: 10000 });
    await expect(briefingText).not.toBeEmpty();
  });
});
