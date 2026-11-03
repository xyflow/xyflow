import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('Props', () => {
  test.describe('colorMode', async () => {
    test('render without forced theme on the flow wrapper', async ({ page }) => {
      await page.goto('/examples/color-mode');

      await expect(page.locator(`.${FRAMEWORK}-flow__node`).first()).toHaveCSS('visibility', 'visible');

      await expect(page.locator(`.${FRAMEWORK}-flow`)).not.toHaveAttribute('data-theme');
    });

    test('render dark page theme via html data-theme', async ({ page }) => {
      await page.goto('/examples/color-mode');
      await expect(page.locator(`.${FRAMEWORK}-flow__node`).first()).toHaveCSS('visibility', 'visible');

      await page.getByTestId('colormode-select').selectOption({ label: 'dark' });

      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    });
  });
});
