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

  test('tracks viewport pan', async ({ page }) => {
    const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
    const pattern = page.locator(`.${FRAMEWORK}-flow__background pattern`);

    await expect(pattern).toBeAttached();
    const xBefore = await pattern.getAttribute('x');
    const yBefore = await pattern.getAttribute('y');
    const paneBox = await pane.boundingBox();

    await page.mouse.move(paneBox!.x + paneBox!.width / 2, paneBox!.y + paneBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(paneBox!.x + paneBox!.width / 2 + 37, paneBox!.y + paneBox!.height / 2 + 41);
    await page.mouse.up();

    await expect(pattern).not.toHaveAttribute('x', xBefore ?? '');
    await expect(pattern).not.toHaveAttribute('y', yBefore ?? '');
  });
});
