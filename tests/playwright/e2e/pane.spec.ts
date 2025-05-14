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
