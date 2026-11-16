import { test, expect, type Page } from '@playwright/test';

import { FRAMEWORK } from './constants';
import { getTransform } from './utils';

function getStatus(page: Page) {
  return page.locator('[data-id="transitions"]').getByRole('status');
}

async function startTransition(page: Page, transition: string) {
  const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);
  const transformBefore = await getTransform(viewport);

  await page.getByRole('button', { name: transition, exact: true }).click();
  await expect(getStatus(page)).toHaveText(`${transition}: pending`);
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
    test(`${transition} resolves with false when a scroll interrupts it`, async ({ page }) => {
      await startTransition(page, transition);
      await scrollPane(page);

      // The transition runs for 5 seconds, so it only settles this early if the scroll stopped it
      await expect(getStatus(page)).toHaveText(`${transition}: interrupted`, {
        timeout: 2000,
      });
    });
  }

  test('a transition that runs to the end resolves with true', async ({ page }) => {
    await page.getByRole('button', { name: 'set center briefly', exact: true }).click();

    await expect(getStatus(page)).toHaveText('set center briefly: ended');
  });

  test('a transition resolves with false when a viewport change cancels it before it starts', async ({ page }) => {
    await page.getByRole('button', { name: 'set center then set viewport', exact: true }).click();

    await expect(getStatus(page)).toHaveText('set center then set viewport: interrupted', {
      timeout: 2000,
    });
  });

  test('fit view called again during its transition settles when the last fit ends', async ({ page }) => {
    test.skip(FRAMEWORK === 'vue', 'Vue Flow gives every fitView call its own promise');

    const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);

    await page.getByRole('button', { name: 'fit view twice', exact: true }).click();
    await expect(getStatus(page)).toHaveText('fit view twice: ended');

    // Both calls share one promise, so once it settles the second fit no longer moves the viewport
    const transformWhenSettled = await getTransform(viewport);
    await page.waitForTimeout(300);
    expect(await getTransform(viewport)).toEqual(transformWhenSettled);
  });

  test('fit view called again during its transition interrupts the first fit', async ({ page }) => {
    test.skip(FRAMEWORK !== 'vue', 'React Flow and Svelte Flow share one promise between fitView calls');

    await page.getByRole('button', { name: 'fit view twice', exact: true }).click();

    await expect(getStatus(page)).toHaveText('fit view twice: interrupted', { timeout: 2000 });
  });

  test('an interrupted fit view does not run again when a node is dragged', async ({ page }) => {
    const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);
    const node = page.locator('[data-id="transitions"]');

    await startTransition(page, 'fit view');
    await scrollPane(page);
    await expect(getStatus(page)).toHaveText('fit view: interrupted', { timeout: 2000 });

    const getNodeTransform = () => node.evaluate((element) => (element as HTMLElement).style.transform);
    const nodeTransformBefore = await getNodeTransform();
    const statusBox = await getStatus(page).boundingBox();
    await page.mouse.move(statusBox!.x + 5, statusBox!.y + 5);
    await page.mouse.down();
    await page.mouse.move(statusBox!.x + 30, statusBox!.y + 30, { steps: 5 });
    await page.mouse.up();
    expect(await getNodeTransform()).not.toEqual(nodeTransformBefore);

    const transformAfterDrag = await getTransform(viewport);
    await page.waitForTimeout(300);
    expect(await getTransform(viewport)).toEqual(transformAfterDrag);
  });
});
