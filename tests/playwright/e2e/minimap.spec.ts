import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('MiniMap', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/generic/minimap/general');
  });

  test('renders nodes and viewport mask', async ({ page }) => {
    const minimap = page.locator(`.${FRAMEWORK}-flow__minimap`);
    const nodes = page.locator(`.${FRAMEWORK}-flow__minimap-node`);
    const mask = page.locator(`.${FRAMEWORK}-flow__minimap-mask`);

    await expect(minimap).toBeAttached();
    await expect(minimap.locator('title')).toHaveText('Test minimap');
    await expect(nodes).toHaveCount(2);
    await expect(mask).toBeAttached();
  });
});
