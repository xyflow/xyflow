import { expect, test, type Locator, type Page } from '@playwright/test';

import { FRAMEWORK } from './constants';

async function dragAnchorToHandle(page: Page, anchor: Locator, handle: Locator) {
  await anchor.hover();
  const target = (await handle.boundingBox())!;

  await page.mouse.down();
  try {
    await page.mouse.move(target.x + target.width / 2, target.y + target.height / 2, { steps: 10 });
    await expect(page.locator('.react-flow__connection')).toBeAttached();
  } finally {
    await page.mouse.up();
  }
}

test.describe('Custom reconnection anchors', () => {
  test.skip(FRAMEWORK !== 'react', 'This example uses the React reconnection anchor.');

  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/reconnect-edge');
  });

  test('reconnects an edge from its midpoint', async ({ page }) => {
    const anchor = page.getByTitle('Drag to reconnect the target');
    const newTarget = page.locator('[data-id="5"] .react-flow__handle.target');

    await dragAnchorToHandle(page, anchor, newTarget);

    await expect(page.locator('.react-flow__edge[data-id="e2-4"]')).toHaveCount(0);
    await expect(page.locator('.react-flow__edge[data-id="xy-edge__2-5"]')).toBeAttached();
    await expect(anchor).toBeVisible();
  });

  test('preserves reconnection from a built-in endpoint', async ({ page }) => {
    const anchor = page.locator('[data-id="e1-3"] .react-flow__edgeupdater-source');
    const newSource = page.locator('[data-id="5"] .react-flow__handle.source');

    await dragAnchorToHandle(page, anchor, newSource);

    await expect(page.locator('.react-flow__edge[data-id="e1-3"]')).toHaveCount(0);
    await expect(page.locator('.react-flow__edge[data-id="xy-edge__5-3"]')).toBeAttached();
  });
});
