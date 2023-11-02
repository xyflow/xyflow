import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('PANE', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('/tests/pane');
  });

  test.describe('pan', () => {
    test('panning the pane', async ({ page }) => {
      const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
      const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);

      await expect(pane).toBeAttached();

      const paneBox = await pane.boundingBox();

      const viewportTransformBeforePan = await viewport.evaluate((element) => {
        return element.style.transform;
      });

      await pane.hover();
      await page.mouse.down();
      await page.mouse.move(paneBox!.x + 150, paneBox!.y + 100);
      await page.mouse.up();

      const viewportTransformAfterPan = await viewport.evaluate((element) => {
        return element.style.transform;
      });

      expect(viewportTransformBeforePan).toBe(viewportTransformAfterPan);
    });
  });
});
