import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('Node Resizer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/generic/node-resizer/general');
    await page.waitForSelector('[data-id="resizable-target"]', { timeout: 5000 });
  });

  test('renders resize controls for selected custom node', async ({ page }) => {
    const controls = page.locator(`.${FRAMEWORK}-flow__resize-control`);

    await expect(controls).toHaveCount(8);
    await expect(controls.and(page.locator('.handle'))).toHaveCount(4);
    await expect(controls.and(page.locator('.line'))).toHaveCount(4);
  });

  test('dragging a resize handle changes node dimensions and connected edge path', async ({ page }) => {
    const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="resizable"]'));
    const handle = page.locator(`.${FRAMEWORK}-flow__resize-control.handle.bottom.right`);
    const edgePath = page
      .locator(`.${FRAMEWORK}-flow__edge`)
      .and(page.locator('[data-id="resizable-target"]'))
      .locator(`.${FRAMEWORK}-flow__edge-path`);

    await expect(node).toBeInViewport();
    await expect(handle).toBeInViewport();

    const beforeBox = await node.boundingBox();
    const beforePath = await edgePath.getAttribute('d');
    const handleBox = await handle.boundingBox();

    await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(handleBox!.x + handleBox!.width / 2 + 80, handleBox!.y + handleBox!.height / 2 + 50);
    await page.mouse.up();

    const afterBox = await node.boundingBox();
    const afterPath = await edgePath.getAttribute('d');

    expect(afterBox!.width).toBeGreaterThan(beforeBox!.width + 40);
    expect(afterBox!.height).toBeGreaterThan(beforeBox!.height + 20);
    expect(afterPath).not.toBe(beforePath);
  });
});
