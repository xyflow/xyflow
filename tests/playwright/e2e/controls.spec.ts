import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';
import { getTransform } from './utils';

test.describe('Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/generic/controls/general');
    await page.waitForSelector('[data-id="first-edge"]', { timeout: 5000 });
  });

  test('zoom controls update the viewport', async ({ page }) => {
    const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);
    const zoomIn = page.locator(`.${FRAMEWORK}-flow__controls-zoomin`);
    const zoomOut = page.locator(`.${FRAMEWORK}-flow__controls-zoomout`);

    await expect(zoomIn).toBeAttached();
    await expect(zoomOut).toBeAttached();

    const before = await getTransform(viewport);

    await zoomIn.click();
    await expect
      .poll(async () => (await getTransform(viewport)).scale)
      .toBeGreaterThan(before.scale);

    const zoomedIn = await getTransform(viewport);

    await zoomOut.click();
    await expect
      .poll(async () => (await getTransform(viewport)).scale)
      .toBeLessThan(zoomedIn.scale);
  });

  test('interactive control disables node dragging', async ({ page }) => {
    const interactive = page.locator(`.${FRAMEWORK}-flow__controls-interactive`);
    const node = page.locator('[data-id="2"]');

    await expect(interactive).toBeAttached();
    await expect(node).toBeAttached();
    await expect(interactive).toHaveAttribute('aria-pressed', 'false');
    await expect(interactive).toHaveAttribute('aria-label', 'lock interactivity');

    const transformBefore = await node.evaluate((element) => (element as HTMLElement).style.transform);
    const nodeBox = await node.boundingBox();

    await interactive.click();
    await expect(interactive).toHaveAttribute('aria-pressed', 'true');
    await expect(interactive).toHaveAttribute('aria-label', 'unlock interactivity');
    await expect(interactive).toHaveClass(/is-locked/);
    await page.mouse.move(nodeBox!.x + nodeBox!.width / 2, nodeBox!.y + nodeBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(nodeBox!.x + nodeBox!.width / 2 + 100, nodeBox!.y + nodeBox!.height / 2 + 100);
    await page.mouse.up();

    const transformAfter = await node.evaluate((element) => (element as HTMLElement).style.transform);

    expect(transformAfter).toBe(transformBefore);
  });

  test('custom control buttons render in the controls panel', async ({ page }) => {
    test.skip(FRAMEWORK !== 'ember', 'The parity sample route is currently implemented for EmberFlow.');

    await page.goto('/examples/parity/viewport-controls');

    const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);
    const customButton = page
      .locator(`.${FRAMEWORK}-flow__controls-button`)
      .and(page.locator('[aria-label="center origin"]'));

    await expect(customButton).toBeAttached();
    await expect(customButton.locator('svg')).toBeAttached();

    await customButton.click();
    await expect.poll(async () => (await getTransform(viewport)).scale).toBeCloseTo(1, 1);
  });

  test('viewport helper buttons update the viewport', async ({ page }) => {
    test.skip(FRAMEWORK !== 'ember', 'The parity sample route is currently implemented for EmberFlow.');

    await page.goto('/examples/parity/viewport-controls');

    const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);
    await expect(page.locator('[data-id="pan"]')).toBeAttached();

    await page.getByRole('button', { name: 'zoomTo 2' }).click();
    await expect.poll(async () => (await getTransform(viewport)).scale).toBeGreaterThan(1.8);

    await page.getByRole('button', { name: 'setViewport' }).click();
    await expect.poll(async () => (await getTransform(viewport)).scale).toBeCloseTo(0.75, 2);

    await page.getByRole('button', { name: 'fitBounds' }).click();
    await expect.poll(async () => (await getTransform(viewport)).scale).toBeGreaterThan(0.75);
  });
});
