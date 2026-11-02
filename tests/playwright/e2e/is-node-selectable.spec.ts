import { test, expect, type Page } from '@playwright/test';

import { FRAMEWORK } from './constants';

async function boxSelectAllNodes(page: Page) {
  const keepA = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="keep-a"]'));
  const keepB = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="keep-b"]'));

  await expect(keepA).toHaveCSS('visibility', 'visible');
  await expect(keepB).toHaveCSS('visibility', 'visible');

  const a = await keepA.boundingBox();
  const b = await keepB.boundingBox();

  await page.keyboard.down('Shift');
  await page.mouse.move(Math.min(a!.x, b!.x) - 20, Math.min(a!.y, b!.y) - 20);
  await page.mouse.down();
  await page.mouse.move(
    Math.max(a!.x + a!.width, b!.x + b!.width) + 20,
    Math.max(a!.y + a!.height, b!.y + b!.height) + 20
  );
  await page.mouse.up();
  await page.keyboard.up('Shift');
}

test.describe('isNodeSelectable box/lasso filter', () => {
  test('default (omitted) selects every node inside the rect', async ({ page }) => {
    await page.goto('/tests/generic/nodes/is-node-selectable-default');

    const keepA = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="keep-a"]'));
    const skip = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="skip"]'));
    const keepB = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="keep-b"]'));

    await boxSelectAllNodes(page);

    await expect(keepA).toHaveClass(/selected/);
    await expect(skip).toHaveClass(/selected/);
    await expect(keepB).toHaveClass(/selected/);
  });

  test('filter excludes nodes for which the predicate returns false', async ({ page }) => {
    await page.goto('/tests/generic/nodes/is-node-selectable-filter');

    const keepA = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="keep-a"]'));
    const skip = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="skip"]'));
    const keepB = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="keep-b"]'));

    await boxSelectAllNodes(page);

    await expect(keepA).toHaveClass(/selected/);
    await expect(skip).not.toHaveClass(/selected/);
    await expect(keepB).toHaveClass(/selected/);
  });

  test('passthrough predicate preserves default box selection', async ({ page }) => {
    await page.goto('/tests/generic/nodes/is-node-selectable-passthrough');

    const keepA = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="keep-a"]'));
    const skip = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="skip"]'));
    const keepB = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="keep-b"]'));

    await boxSelectAllNodes(page);

    await expect(keepA).toHaveClass(/selected/);
    await expect(skip).toHaveClass(/selected/);
    await expect(keepB).toHaveClass(/selected/);
  });

  test('filter does not prevent click selection', async ({ page }) => {
    await page.goto('/tests/generic/nodes/is-node-selectable-filter');

    const skip = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="skip"]'));
    await expect(skip).toHaveCSS('visibility', 'visible');

    await skip.click();

    await expect(skip).toHaveClass(/selected/);
  });
});
