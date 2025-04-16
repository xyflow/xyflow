import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('Props', () => {
  test.describe('colorMode', async () => {
    test('render default light color mode', async ({ page }) => {
      await page.goto('/examples/color-mode');

      await expect(page.locator(`.${FRAMEWORK}-flow__node`).first()).toHaveCSS('visibility', 'visible');

      await expect(page.locator(`.${FRAMEWORK}-flow`)).not.toHaveClass(/dark/);
    });

    test('render dark color mode', async ({ page }) => {
      await page.goto('/examples/color-mode');
      await expect(page.locator(`.${FRAMEWORK}-flow__node`).first()).toHaveCSS('visibility', 'visible');

      await page.getByTestId('colormode-select').selectOption({ label: 'dark' });

      await expect(page.locator(`.${FRAMEWORK}-flow`)).toHaveClass(/dark/);
    });
  });
});
