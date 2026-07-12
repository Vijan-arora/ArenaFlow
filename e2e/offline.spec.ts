import { expect, test } from '@playwright/test';

test.describe('Offline Fallback Mode', () => {
  test('should display offline banner and serve local assistant answers when offline', async ({ page }) => {
    // 1. Visit online first to seed/cache venue data and operations snapshot
    await page.goto('/assistant');
    await page.waitForTimeout(1000); // Allow time to fetch and cache venue data

    await page.goto('/operations');
    await page.waitForSelector('h2:has-text("Zone crowd density")'); // Wait for snapshot load and cache
    await page.waitForTimeout(500);

    // Go back to assistant while online
    await page.goto('/assistant');
    await page.waitForTimeout(500);

    // 2. Put context offline
    await page.context().setOffline(true);
    
    // Trigger window offline event or wait a brief moment for status to update
    await page.waitForTimeout(500);

    // 3. Check assistant page offline behavior
    const assistantBanner = page.locator('.offline-banner');
    await expect(assistantBanner).toBeVisible();
    await expect(assistantBanner).toContainText('Offline — showing last known data');

    const questionInput = page.locator('#assistant-question');
    await questionInput.fill('Where is the accessible gate?');
    await page.click('button[type="submit"]');

    const answer = page.locator('.chat-message--assistant .chat-message__body').last();
    await expect(answer).toBeVisible();
    await expect(answer).toContainText('Offline: Entry gates at Estadio Azteca are Gates 1 to 6');

    // 4. Click navigation link to go to Operations page client-side (no reload)
    const operationsLink = page.locator('nav a:has-text("Operations")');
    await operationsLink.click();

    // Verify operations page offline behavior
    const operationsBanner = page.locator('.offline-banner');
    await expect(operationsBanner).toBeVisible();
    await expect(operationsBanner).toContainText('Offline — showing last known data');

    // Dashboard features should still show cached data
    await expect(page.locator('h2:has-text("Zone crowd density")')).toBeVisible();
    await expect(page.locator('h2:has-text("Incidents")')).toBeVisible();
    await expect(page.locator('h2:has-text("Sustainability")')).toBeVisible();
  });
});
