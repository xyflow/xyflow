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

  test('resize uses snap grid deltas', async ({ page }) => {
    await page.goto('/tests/generic/node-resizer/snap');
    await page.waitForSelector('[data-id="snap-resizable"]', { timeout: 5000 });

    const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="snap-resizable"]'));
    const handle = node.locator(`.${FRAMEWORK}-flow__resize-control.handle.bottom.right`);

    await expect(handle).toBeInViewport();

    const beforeBox = await node.boundingBox();
    const handleBox = await handle.boundingBox();

    await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(handleBox!.x + handleBox!.width / 2 + 62, handleBox!.y + handleBox!.height / 2 + 62, {
      steps: 8,
    });
    await page.mouse.up();

    const afterBox = await node.boundingBox();

    expect(afterBox!.width - beforeBox!.width).toBeGreaterThan(42);
    expect(afterBox!.width - beforeBox!.width).toBeLessThan(58);
    expect(afterBox!.height - beforeBox!.height).toBeGreaterThan(42);
    expect(afterBox!.height - beforeBox!.height).toBeLessThan(58);
  });

  test('resizing sample supports real mouse drag on the visible handle', async ({ page }) => {
    await page.goto('/examples/parity/resizing');
    await page.waitForSelector('[data-id="layout-publish"]', { timeout: 5000 });

    const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="layout"]'));
    const handle = node.locator(`.${FRAMEWORK}-flow__resize-control.handle.bottom.right`);
    const controls = page.locator(`.${FRAMEWORK}-flow__resize-control`);
    const edgePath = page
      .locator(`.${FRAMEWORK}-flow__edge`)
      .and(page.locator('[data-id="layout-publish"]'))
      .locator(`.${FRAMEWORK}-flow__edge-path`);

    await expect(node).toHaveClass(/selected/);
    await expect(controls).toHaveCount(8);
    await expect(handle).toBeInViewport();

    const beforeBox = await node.boundingBox();
    const beforePath = await edgePath.getAttribute('d');
    const handleBox = await handle.boundingBox();

    await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(handleBox!.x + handleBox!.width / 2 + 90, handleBox!.y + handleBox!.height / 2 + 55, {
      steps: 8,
    });
    await page.mouse.up();

    const afterBox = await node.boundingBox();
    const afterPath = await edgePath.getAttribute('d');

    expect(afterBox!.width).toBeGreaterThan(beforeBox!.width + 50);
    expect(afterBox!.height).toBeGreaterThan(beforeBox!.height + 30);
    expect(afterPath).not.toBe(beforePath);

    const nextHandleBox = await handle.boundingBox();

    await page.mouse.move(nextHandleBox!.x + nextHandleBox!.width / 2, nextHandleBox!.y + nextHandleBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(nextHandleBox!.x + nextHandleBox!.width / 2 + 45, nextHandleBox!.y + nextHandleBox!.height / 2 + 35, {
      steps: 8,
    });
    await page.mouse.up();

    const secondAfterBox = await node.boundingBox();

    expect(secondAfterBox!.width).toBeGreaterThan(afterBox!.width + 20);
    expect(secondAfterBox!.height).toBeGreaterThan(afterBox!.height + 15);
  });

  test('resizing continues while auto-panning near the viewport edge', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 700 });
    await page.goto('/examples/parity/resizing');
    await page.waitForSelector('[data-id="layout-publish"]', { timeout: 5000 });

    const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="layout"]'));
    const handle = node.locator(`.${FRAMEWORK}-flow__resize-control.handle.bottom.right`);
    const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);

    await expect(handle).toBeInViewport();

    const handleBox = await handle.boundingBox();
    const beforeTransform = await viewport.getAttribute('style');

    await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(892, 692, { steps: 10 });

    const edgeBox = await node.boundingBox();

    await page.waitForTimeout(350);

    const afterHoldBox = await node.boundingBox();
    const afterTransform = await viewport.getAttribute('style');

    await page.mouse.up();

    expect(afterTransform).not.toBe(beforeTransform);
    expect(afterHoldBox!.width).toBeGreaterThan(edgeBox!.width + 5);
    expect(afterHoldBox!.height).toBeGreaterThan(edgeBox!.height + 5);
  });

  test('group resize preserves child absolute placement from top-left handle', async ({ page }) => {
    await page.goto('/tests/generic/node-resizer/group');
    await page.waitForSelector('[data-id="group-child"]', { timeout: 5000 });

    const child = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="group-child"]'));
    const group = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="group"]'));
    const handle = group.locator(`.${FRAMEWORK}-flow__resize-control.handle.top.left`);

    await expect(handle).toBeInViewport();

    const childBefore = await child.boundingBox();
    const groupBefore = await group.boundingBox();
    const handleBox = await handle.boundingBox();

    await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(handleBox!.x + handleBox!.width / 2 - 90, handleBox!.y + handleBox!.height / 2 - 55, {
      steps: 8,
    });
    await page.mouse.up();

    const childAfter = await child.boundingBox();
    const groupAfter = await group.boundingBox();

    expect(groupAfter!.x).toBeLessThan(groupBefore!.x - 40);
    expect(groupAfter!.y).toBeLessThan(groupBefore!.y - 25);
    expect(Math.abs(childAfter!.x - childBefore!.x)).toBeLessThan(4);
    expect(Math.abs(childAfter!.y - childBefore!.y)).toBeLessThan(4);
  });

  test('group resize is constrained by child extent', async ({ page }) => {
    await page.goto('/tests/generic/node-resizer/group');
    await page.waitForSelector('[data-id="group-child"]', { timeout: 5000 });

    const child = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="group-child"]'));
    const group = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="group"]'));
    const handle = group.locator(`.${FRAMEWORK}-flow__resize-control.handle.bottom.right`);

    await expect(handle).toBeInViewport();

    const handleBox = await handle.boundingBox();

    await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(handleBox!.x + handleBox!.width / 2 - 220, handleBox!.y + handleBox!.height / 2 - 150, {
      steps: 10,
    });
    await page.mouse.up();

    const childBox = await child.boundingBox();
    const groupBox = await group.boundingBox();

    expect(groupBox!.x + groupBox!.width).toBeGreaterThanOrEqual(childBox!.x + childBox!.width - 1);
    expect(groupBox!.y + groupBox!.height).toBeGreaterThanOrEqual(childBox!.y + childBox!.height - 1);
  });

  test('resizing sample can deselect the initially selected node', async ({ page }) => {
    await page.goto('/examples/parity/resizing');

    const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="layout"]'));
    const controls = page.locator(`.${FRAMEWORK}-flow__resize-control`);

    await expect(node).toHaveClass(/selected/);
    await expect(controls).toHaveCount(8);

    const paneBox = await page.locator(`.${FRAMEWORK}-flow__pane`).boundingBox();

    await page.mouse.click(paneBox!.x + paneBox!.width / 2, paneBox!.y + paneBox!.height - 80);

    await expect(node).not.toHaveClass(/selected/);
    await expect(controls).toHaveCount(0);
  });
});
