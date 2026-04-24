import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('Background', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/generic/background/general');
  });

  test('renders configured background variant', async ({ page }) => {
    const background = page.locator(`.${FRAMEWORK}-flow__background`);
    const pattern = background.locator(`.${FRAMEWORK}-flow__background-pattern.cross`);

    await expect(background).toBeAttached();
    await expect(pattern).toBeAttached();
    await expect(pattern).toHaveClass(/background-test-pattern/);
    await expect(pattern).toHaveAttribute('stroke-width', '2');
  });
});
