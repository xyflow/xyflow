import { test, expect, type Page } from '@playwright/test';

import { FRAMEWORK } from './constants';
import { getTransform } from './utils';

async function startTransition(page: Page, transition: string) {
  const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);
  const transformBefore = await getTransform(viewport);

  await page.getByRole('button', { name: transition, exact: true }).click();
  await expect(page.getByTestId('transition-status')).toHaveText(`${transition}: pending`);
  await expect.poll(() => getTransform(viewport)).not.toEqual(transformBefore);
}

async function scrollPane(page: Page) {
  const paneBox = await page.locator(`.${FRAMEWORK}-flow__pane`).boundingBox();

  await page.mouse.move(paneBox!.x + 10, paneBox!.y + 10);
  await page.mouse.wheel(0, 100);
}

test.describe('Viewport transitions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/generic/viewport/transitions');

    await page.waitForSelector('[data-id="transitions"]', { timeout: 5000 });
  });

  for (const transition of ['fit view', 'set center', 'zoom to', 'zoom in']) {
    test(`${transition} settles when a scroll interrupts it`, async ({ page }) => {
      await startTransition(page, transition);
      await scrollPane(page);

      // The transition runs for 5 seconds, so it only settles this early if the scroll stopped it
      await expect(page.getByTestId('transition-status')).toHaveText(`${transition}: settled`, { timeout: 2000 });
    });
  }

  test('a transition settles when a viewport change cancels it before it starts', async ({ page }) => {
    await page.getByRole('button', { name: 'set center then set viewport', exact: true }).click();

    await expect(page.getByTestId('transition-status')).toHaveText('set center then set viewport: settled', {
      timeout: 2000,
    });
  });

  test('fit view called again during its transition settles when the last fit ends', async ({ page }) => {
    const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);

    await page.getByRole('button', { name: 'fit view twice', exact: true }).click();
    await expect(page.getByTestId('transition-status')).toHaveText('fit view twice: settled');

    // Both calls share one promise, so once it settles the second fit no longer moves the viewport
    const transformWhenSettled = await getTransform(viewport);
    await page.waitForTimeout(300);
    expect(await getTransform(viewport)).toEqual(transformWhenSettled);
  });

  test('an interrupted fit view does not run again when a node is dragged', async ({ page }) => {
    const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);

    await startTransition(page, 'fit view');
    await scrollPane(page);

    const statusBox = await page.getByTestId('transition-status').boundingBox();
    await page.mouse.move(statusBox!.x + 5, statusBox!.y + 5);
    await page.mouse.down();
    await page.mouse.move(statusBox!.x + 30, statusBox!.y + 30, { steps: 5 });
    await page.mouse.up();

    const transformAfterDrag = await getTransform(viewport);
    await page.waitForTimeout(300);
    expect(await getTransform(viewport)).toEqual(transformAfterDrag);
  });
});
