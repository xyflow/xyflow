import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

function readTranslate(transform: string) {
  let match = /translate\((-?\d+(?:\.\d+)?)px,\s*(-?\d+(?:\.\d+)?)px\)/.exec(transform);

  if (!match) {
    throw new Error(`Could not parse node transform: ${transform}`);
  }

  return {
    x: Number(match[1]),
    y: Number(match[2]),
  };
}

test.describe('Placement', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/generic/placement/general');
  });

  test('per-node origin offsets rendered node position', async ({ page }) => {
    const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="origin-node"]'));
    await expect(node).toHaveCSS('visibility', 'visible');

    const transform = await node.evaluate((element) => element.style.transform);

    expect(readTranslate(transform)).toEqual({ x: 350, y: 170 });
  });

  test('snapToGrid snaps node dragging', async ({ page }) => {
    const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="snap-node"]'));
    await expect(node).toHaveCSS('visibility', 'visible');

    const box = await node.boundingBox();
    await page.mouse.move(box!.x + 10, box!.y + 10);
    await page.mouse.down();
    await page.mouse.move(box!.x + 43, box!.y + 54);
    await page.mouse.up();

    const transform = await node.evaluate((element) => element.style.transform);

    expect(readTranslate(transform)).toEqual({ x: 150, y: 150 });
  });

  test('node extent clamps node dragging', async ({ page }) => {
    const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="extent-node"]'));
    await expect(node).toHaveCSS('visibility', 'visible');

    const box = await node.boundingBox();
    await page.mouse.move(box!.x + 10, box!.y + 10);
    await page.mouse.down();
    await page.mouse.move(box!.x + 260, box!.y + 260);
    await page.mouse.up();

    const transform = await node.evaluate((element) => element.style.transform);

    expect(readTranslate(transform)).toEqual({ x: 210, y: 320 });
  });
});
