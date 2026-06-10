import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';
import { getTransform } from './utils';

test.describe('Pane default', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('/tests/generic/pane/general');

    // Wait till the edges are rendered
    await page.waitForSelector('[data-id="first-edge"]', { timeout: 5000 });
  });

  test.describe('pan & zoom', () => {
    test('panning the pane moves it', async ({ page }) => {
      const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
      const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);

      await expect(pane).toBeAttached();

      const paneBox = await pane.boundingBox();
      const transformsBefore = await getTransform(viewport);
      const movementPx = 100;

      await pane.hover();
      await page.mouse.down();
      // Move pane by 100, 100
      await page.mouse.move(
        paneBox!.x + paneBox!.width * 0.5 + movementPx,
        paneBox!.y + paneBox!.height * 0.5 + movementPx
      );

      const transformsAfter = await getTransform(viewport);

      expect(movementPx - Math.floor(transformsAfter.translateX - transformsBefore.translateX)).toBeLessThan(1);
      expect(movementPx - Math.floor(transformsAfter.translateY - transformsBefore.translateY)).toBeLessThan(1);
    });

    test('scrolling the default pane zooms it', async ({ page }) => {
      const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
      const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);

      await expect(pane).toBeAttached();

      const transformsBefore = await getTransform(viewport);

      await pane.hover();
      await page.mouse.wheel(0, 100);

      const transformsAfter = await getTransform(viewport);

      expect(transformsAfter.scale).not.toBe(transformsBefore.scale);
    });
  });

  test.describe('minZoom & maxZoom', () => {
    test('minZoom', async ({ page }) => {
      const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
      const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);

      await expect(pane).toBeAttached();

      await pane.hover();

      // Zoom out
      await page.mouse.wheel(5000, 5000);

      const transformsMinZoom = await getTransform(viewport);
      expect(transformsMinZoom.scale).toBe(0.25);
    });

    test('maxZoom', async ({ page }) => {
      const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
      const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);

      await expect(pane).toBeAttached();

      await pane.hover();

      // Zoom in
      await page.mouse.wheel(-5000, -5000);

      const transformsMaxZoom = await getTransform(viewport);
      expect(transformsMaxZoom.scale).toBe(4);
    });
  });

  test.describe('autoPan', () => {
    test('autoPanOnNodeDrag', async ({ page }) => {
      const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);
      const node = page.locator('[data-id="1"]');

      await expect(node).toBeAttached();

      const transformBefore = await getTransform(viewport);

      await node.hover();
      await page.mouse.down();
      await page.mouse.move(0, 0);
      await page.waitForTimeout(500);
      await page.mouse.move(2000, 2000, { steps: 100 });
      await page.mouse.up();

      const transformAfter = await getTransform(viewport);

      await expect(transformAfter.translateX).not.toEqual(transformBefore.translateX);
      await expect(transformAfter.translateY).not.toEqual(transformBefore.translateY);
    });

    test('autoPanOnConnect', async ({ page }) => {
      const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);
      const handle = page.locator(`[data-id="1"] .${FRAMEWORK}-flow__handle`);

      await expect(handle).toBeAttached();

      const transformBefore = await getTransform(viewport);

      await handle.hover();
      await page.mouse.down();
      await page.mouse.move(0, 0);
      await page.waitForTimeout(500);
      await page.mouse.move(100, 100, { steps: 100 });

      const transformAfter = await getTransform(viewport);

      await expect(transformAfter.translateX).not.toEqual(transformBefore.translateX);
      await expect(transformAfter.translateY).not.toEqual(transformBefore.translateY);
    });
  });
});

// https://github.com/xyflow/xyflow/issues/5757 — `onPaneClick` was being fired
// when the user ended a connection drag on the pane background (or close to but
// not exactly on top of) a handle. The click event that the browser synthesises
// from the mousedown/mouseup pair leaks to the pane's `onClick` handler because
// `connectionInProgress` has already been reset to `false` by the time the
// handler runs, so the early-return inside the handler doesn't fire.
test.describe('Pane connection drag', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/generic/pane/connection-drag');
    await page.waitForSelector('[data-id="first-edge"]', { timeout: 5000 });
    await page.evaluate(() => {
      (window as unknown as { __paneClicks?: number }).__paneClicks = 0;
    });
  });

  test('dragging a connection onto the pane background does not fire onPaneClick', async ({ page }) => {
    const sourceHandle = page.locator(`[data-id="source"] .${FRAMEWORK}-flow__handle.source`);
    const pane = page.locator(`.${FRAMEWORK}-flow__pane`);

    await expect(sourceHandle).toBeAttached();
    await expect(pane).toBeAttached();

    const paneBox = await pane.boundingBox();
    if (!paneBox) throw new Error('pane has no bounding box');

    // Drag from the source handle to an empty area in the bottom-right
    // quadrant of the pane. The empty area is far from both nodes so the
    // pointer ends up on the pane background, which is exactly the case the
    // reporter's video shows.
    await sourceHandle.hover();
    await page.mouse.down();
    await page.mouse.move(paneBox.x + paneBox.width - 40, paneBox.y + paneBox.height - 40, { steps: 20 });
    await page.mouse.up();

    // Give React a tick to flush the click event that the browser synthesises
    // from the mousedown/mouseup pair.
    await page.waitForTimeout(50);

    const paneClicks = await page.evaluate(() => (window as unknown as { __paneClicks?: number }).__paneClicks);
    expect(paneClicks).toBe(0);
  });

  test('a real click on the pane background still fires onPaneClick', async ({ page }) => {
    const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
    await expect(pane).toBeAttached();

    const paneBox = await pane.boundingBox();
    if (!paneBox) throw new Error('pane has no bounding box');

    await page.mouse.click(paneBox.x + paneBox.width - 40, paneBox.y + paneBox.height - 40);
    await page.waitForTimeout(50);

    const paneClicks = await page.evaluate(() => (window as unknown as { __paneClicks?: number }).__paneClicks);
    expect(paneClicks).toBe(1);
  });
});

test.describe('Pane non-default', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('/tests/generic/pane/non-defaults');

    // Wait till the edges are rendered
    await page.waitForSelector('[data-id="first-edge"]', { timeout: 5000 });
  });

  test.describe('pan & zoom', () => {
    test('panOnScroll pans the pane on scrolling', async ({ page }) => {
      const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
      const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);

      await expect(pane).toBeAttached();

      const transformsBefore = await getTransform(viewport);

      await pane.hover();
      await page.mouse.wheel(100, 100);

      const transformsAfter = await getTransform(viewport);

      expect(transformsAfter.translateX).not.toBe(transformsBefore.translateX);
      expect(transformsAfter.translateY).not.toBe(transformsBefore.translateY);
    });

    test('intialViewport', async ({ page }) => {
      const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
      const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);

      await expect(pane).toBeAttached();

      const viewportTransform = await getTransform(viewport);

      expect(viewportTransform.translateX).toBe(1.23);
      expect(viewportTransform.translateY).toBe(9.87);
      expect(viewportTransform.scale).toBe(1.234);
    });
  });
});

// test.describe('Pane activation keys', () => {
//   test.beforeEach(async ({ page }) => {
//     // Go to the starting url before each test.
//     await page.goto('/tests/generic/pane/activation-keys');

//     // Wait till the edges are rendered
//     await page.waitForSelector('[data-id="first-edge"]', { timeout: 5000 });
//   });
// });
