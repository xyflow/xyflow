import { test, expect, type Locator, type Page } from '@playwright/test';

import { FRAMEWORK } from './constants';
import { getTransform } from './utils';

type Point = { x: number; y: number };

async function getPaneDragPoints(pane: Locator) {
  const bounds = await pane.boundingBox();
  if (!bounds) {
    throw new Error('Could not measure the pane for the drag gesture.');
  }

  const start = { x: bounds.x + bounds.width * 0.75, y: bounds.y + bounds.height * 0.75 };
  return { start, end: { x: start.x - 80, y: start.y - 80 } };
}

async function withTouchDrag(page: Page, start: Point, end: Point, assertions: () => Promise<void>) {
  const client = await page.context().newCDPSession(page);

  try {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ ...start, id: 0 }],
    });

    for (let step = 1; step <= 4; step++) {
      const progress = step / 4;
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [
          {
            x: start.x + (end.x - start.x) * progress,
            y: start.y + (end.y - start.y) * progress,
            id: 0,
          },
        ],
      });
    }

    await assertions();
  } finally {
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await client.detach();
  }
}

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

    test.describe('touch input', () => {
      // Model a hybrid touchscreen computer without switching to a mobile browser profile.
      test.use({ hasTouch: true });

      test('touch drag pans when primary mouse drag is reserved for selection', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'CDP touch input is only available in Chromium.');

        const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
        const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);
        const selection = page.locator(`.${FRAMEWORK}-flow__selection`);

        await expect(pane).toBeAttached();

        const { start, end } = await getPaneDragPoints(pane);
        const transformBefore = await getTransform(viewport);

        await withTouchDrag(page, start, end, async () => {
          await expect.poll(async () => (await getTransform(viewport)).translateX).not.toBe(transformBefore.translateX);
          await expect(selection).toHaveCount(0);
        });
      });

      test('selection key keeps touch drag in selection mode', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'CDP touch input is only available in Chromium.');

        const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
        const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);
        const selection = page.locator(`.${FRAMEWORK}-flow__selection`);

        await expect(pane).toBeAttached();

        const { start, end } = await getPaneDragPoints(pane);
        const transformBefore = await getTransform(viewport);

        await page.keyboard.down('Shift');
        await expect(pane).toHaveClass(/selection/);

        try {
          await withTouchDrag(page, start, end, async () => {
            await expect(selection).toBeVisible();
            expect(await getTransform(viewport)).toEqual(transformBefore);
          });
        } finally {
          await page.keyboard.up('Shift');
        }
      });
    });

    test('primary mouse drag still creates a selection marquee', async ({ page }) => {
      const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
      const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);
      const selection = page.locator(`.${FRAMEWORK}-flow__selection`);

      await expect(pane).toBeAttached();

      const { start, end } = await getPaneDragPoints(pane);
      const transformBefore = await getTransform(viewport);

      await page.mouse.move(start.x, start.y);
      await page.mouse.down();

      try {
        await page.mouse.move(end.x, end.y, { steps: 4 });
        await expect(selection).toBeVisible();
        expect(await getTransform(viewport)).toEqual(transformBefore);
      } finally {
        await page.mouse.up();
      }
    });
  });
});

test.describe('Pane activation keys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/generic/pane/activation-keys');
    await page.waitForSelector('[data-id="first-edge"]', { timeout: 5000 });
  });

  test('Control and primary-button drag pans the pane', async ({ page }) => {
    const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
    const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);
    const paneBox = await pane.boundingBox();
    const transformsBefore = await getTransform(viewport);
    const movementPx = 100;

    await page.keyboard.down('Control');
    await pane.hover();
    await page.mouse.down();
    await page.mouse.move(
      paneBox!.x + paneBox!.width * 0.5 + movementPx,
      paneBox!.y + paneBox!.height * 0.5 + movementPx
    );
    await page.mouse.up();
    await page.keyboard.up('Control');

    const transformsAfter = await getTransform(viewport);

    expect(movementPx - Math.floor(transformsAfter.translateX - transformsBefore.translateX)).toBeLessThan(1);
    expect(movementPx - Math.floor(transformsAfter.translateY - transformsBefore.translateY)).toBeLessThan(1);
  });
});
