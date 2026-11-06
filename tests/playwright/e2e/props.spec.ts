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
      await expect(page.locator(`.${FRAMEWORK}-flow`)).toHaveCSS('color-scheme', 'dark');
    });

    test('forceColorMode overrides the page theme', async ({ page }) => {
      await page.goto('/examples/color-mode');
      await expect(page.locator(`.${FRAMEWORK}-flow__node`).first()).toHaveCSS('visibility', 'visible');

      const flow = page.locator(`.${FRAMEWORK}-flow`);

      await page.getByTestId('colormode-select').selectOption({ label: 'light' });
      await page.getByTestId('force-colormode-select').selectOption({ label: 'dark' });
      await expect(flow).toHaveClass(/\bdark\b/);
      await expect(flow).toHaveCSS('color-scheme', 'dark');

      await page.getByTestId('colormode-select').selectOption({ label: 'dark' });
      await page.getByTestId('force-colormode-select').selectOption({ label: 'light' });
      await expect(flow).toHaveCSS('color-scheme', 'light');
    });
  });
});
