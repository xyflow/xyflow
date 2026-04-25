import { test, expect, Page } from '@playwright/test';

import { FRAMEWORK } from './constants';

async function getEvents(page: Page) {
  return page.evaluate(() => (window as any).__emberFlowEvents ?? []);
}

test.describe('Events', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/generic/events/general');
    await page.evaluate(() => {
      (window as any).__emberFlowEvents = [];
    });
  });

  test('emits node click and selection change callbacks', async ({ page }) => {
    const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="event-a"]'));

    await expect(node).toHaveCSS('visibility', 'visible');
    await node.click();

    expect(await getEvents(page)).toEqual(
      expect.arrayContaining([
        { type: 'node-click', id: 'event-a' },
        { type: 'selection-change', nodes: ['event-a'], edges: [] },
      ]),
    );
  });

  test('emits node drag lifecycle callbacks', async ({ page }) => {
    const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="event-a"]'));
    const box = await node.boundingBox();

    await page.mouse.move(box!.x + 10, box!.y + 10);
    await page.mouse.down();
    await page.mouse.move(box!.x + 80, box!.y + 80);
    await page.mouse.up();

    expect(await getEvents(page)).toEqual(
      expect.arrayContaining([
        { type: 'node-drag-start', id: 'event-a' },
        { type: 'node-drag', id: 'event-a' },
        { type: 'node-drag-stop', id: 'event-a' },
      ]),
    );
  });

  test('emits edge and pane click callbacks', async ({ page }) => {
    const edge = page.locator(`.${FRAMEWORK}-flow__edge`).and(page.locator('[data-id="event-edge"]'));

    await expect(edge).toBeInViewport();
    await edge.click();
    await page.mouse.click(20, 20);

    expect(await getEvents(page)).toEqual(
      expect.arrayContaining([
        { type: 'edge-click', id: 'event-edge' },
        { type: 'pane-click' },
      ]),
    );
  });

  test('emits connection lifecycle callbacks', async ({ page }) => {
    const source = page.locator('[data-nodeid="event-b"][data-handletype="source"]');
    const target = page.locator('[data-nodeid="event-a"][data-handletype="target"]');

    const sourceBox = await source.boundingBox();
    const targetBox = await target.boundingBox();

    await page.mouse.move(sourceBox!.x + sourceBox!.width / 2, sourceBox!.y + sourceBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(targetBox!.x + targetBox!.width / 2, targetBox!.y + targetBox!.height / 2, { steps: 8 });
    await page.mouse.up();

    expect(await getEvents(page)).toEqual(
      expect.arrayContaining([
        { type: 'connect-start', id: 'event-b:source' },
        { type: 'valid-connection', id: 'event-b->event-a' },
        { type: 'connect', id: 'event-b->event-a' },
        { type: 'connect-end' },
      ]),
    );
  });
});
