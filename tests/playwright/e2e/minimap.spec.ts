import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';
import { getTransform } from './utils';

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

  test('sample minimap can pan and zoom the viewport', async ({ page }) => {
    test.skip(FRAMEWORK !== 'ember', 'The parity sample route is currently implemented for EmberFlow.');

    await page.goto('/examples/parity/minimap');

    const minimapSvg = page.locator(`.${FRAMEWORK}-flow__minimap-svg`);
    const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);

    await expect(minimapSvg).toBeVisible();
    await expect(page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="center"]'))).toBeVisible();

    const beforePan = await getTransform(viewport);
    const minimapBox = await minimapSvg.boundingBox();

    await page.mouse.move(minimapBox!.x + minimapBox!.width / 2, minimapBox!.y + minimapBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(minimapBox!.x + minimapBox!.width / 2 + 35, minimapBox!.y + minimapBox!.height / 2 + 20, {
      steps: 6,
    });
    await page.mouse.up();

    await expect
      .poll(async () => {
        const next = await getTransform(viewport);
        return Math.abs(next.translateX - beforePan.translateX) + Math.abs(next.translateY - beforePan.translateY);
      })
      .toBeGreaterThan(5);

    const beforeZoom = await getTransform(viewport);
    await minimapSvg.hover();
    await page.mouse.wheel(0, -240);

    await expect.poll(async () => (await getTransform(viewport)).scale).toBeGreaterThan(beforeZoom.scale);
  });
});
