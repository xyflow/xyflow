import { expect, test } from '@playwright/test';

import { FRAMEWORK } from './constants';
import { getTransform } from './utils';

test.describe('auto-pan with a parent extent', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto('/tests/generic/nodes/parent-extent-autopan');
  });

  test('only pans in the direction a child can still move', async ({ page }) => {
    const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
    const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);
    const parent = page.locator('[data-id="parent"]');
    const child = page.locator('[data-id="child"]');

    await child.hover();
    const paneBounds = (await pane.boundingBox())!;
    const before = await getTransform(viewport);

    await page.mouse.down();
    try {
      await page.mouse.move(paneBounds.x + paneBounds.width - 5, paneBounds.y + paneBounds.height - 5, {
        steps: 8,
      });

      // The child has hit the right side of its parent but still has room below.
      await expect.poll(async () => (await getTransform(viewport)).translateY).not.toBe(before.translateY);
      expect((await getTransform(viewport)).translateX).toBe(before.translateX);

      const parentBounds = (await parent.boundingBox())!;
      const childBounds = (await child.boundingBox())!;
      expect(childBounds.x + childBounds.width).toBeCloseTo(parentBounds.x + parentBounds.width);
    } finally {
      await page.mouse.up();
    }
  });

  test('still auto-pans when dragging the parent', async ({ page }) => {
    const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
    const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);
    const parent = page.locator('[data-id="parent"]');

    await parent.hover({ position: { x: 20, y: 20 } });
    const paneBounds = (await pane.boundingBox())!;
    const before = await getTransform(viewport);

    await page.mouse.down();
    try {
      await page.mouse.move(paneBounds.x + paneBounds.width - 5, paneBounds.y + 80, { steps: 8 });
      await expect.poll(async () => (await getTransform(viewport)).translateX).not.toBe(before.translateX);
    } finally {
      await page.mouse.up();
    }
  });
});
