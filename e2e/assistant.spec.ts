import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Fan Assistant', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/assistant');
  });

  test('should pass basic accessibility scans', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('should ask a question and render the grounded response', async ({ page }) => {
    const questionInput = page.locator('#assistant-question');
    await questionInput.fill('Where is the accessible entrance?');
    await page.click('button[type="submit"]');

    // Wait for the response to render in the conversation log
    const answer = page.locator('.chat-message--assistant .chat-message__body').last();
    await expect(answer).toBeVisible();
    await expect(answer).toContainText('Mock answer grounded in venue data');
  });

  test('should trigger a quick action and render response', async ({ page }) => {
    // Click on the first quick action chip
    const firstQuickAction = page.locator('.quick-actions .chip').first();
    await expect(firstQuickAction).toBeVisible();
    await firstQuickAction.click();

    const answer = page.locator('.chat-message--assistant .chat-message__body').last();
    await expect(answer).toBeVisible();
    await expect(answer).toContainText('Mock answer grounded in venue data');
  });

  test('should render dir="auto" and correct lang with RTL for Arabic content', async ({ page }) => {
    // Select Arabic language
    const languageSelect = page.locator('#assistant-language');
    await languageSelect.selectOption('ar');

    const questionInput = page.locator('#assistant-question');
    await questionInput.fill('اين بوابة 6؟');
    await page.click('button[type="submit"]');

    const answer = page.locator('.chat-message--assistant .chat-message__body').last();
    await expect(answer).toBeVisible();
    
    // Assert lang attribute is ar
    await expect(answer).toHaveAttribute('lang', 'ar');

    // Assert computed direction is rtl
    const computedDir = await answer.evaluate((el) => window.getComputedStyle(el).direction);
    expect(computedDir).toBe('rtl');
  });

  test('should navigate via keyboard only', async ({ page }) => {
    // Focus the language select dropdown
    const languageSelect = page.locator('#assistant-language');
    await languageSelect.focus();
    await expect(languageSelect).toBeFocused();

    // Tab to the first quick action chip
    await page.keyboard.press('Tab');
    const firstChip = page.locator('.quick-actions .chip').first();
    await expect(firstChip).toBeFocused();

    // Tab through the remaining 4 quick actions to get to the input
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }
    const input = page.locator('#assistant-question');
    await expect(input).toBeFocused();

    // Type a question
    await page.keyboard.type('Where is gate 1?');

    // Tab to the submit button and hit enter
    await page.keyboard.press('Tab');
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeFocused();
    await page.keyboard.press('Enter');

    // Wait for the response in chat
    const answer = page.locator('.chat-message--assistant .chat-message__body').last();
    await expect(answer).toBeVisible();
  });
});
