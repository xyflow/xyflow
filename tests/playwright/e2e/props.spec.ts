import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('Props', () => {
  test.describe('colorMode', async () => {
    test('render default light color mode', async ({ page }) => {
      await page.goto('/examples/color-mode');
      const locator = page.locator(`.${FRAMEWORK}-flow`);

      await expect(locator).not.toHaveClass(/dark/);
    });

    test('render dark color mode', async ({ page }) => {
      await page.goto('/examples/color-mode');
      const locator = page.locator(`.${FRAMEWORK}-flow`);
      await page.getByTestId('colormode-select').selectOption({ label: 'dark' });

      await expect(locator).toHaveClass(/dark/);
    });
  });
});
