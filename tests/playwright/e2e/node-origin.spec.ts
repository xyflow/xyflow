import { test, expect, type Locator, type Page } from '@playwright/test';

import { FRAMEWORK } from './constants';

const getNode = (page: Page, id: string) => page.locator(`.${FRAMEWORK}-flow__node[data-id="${id}"]`);

async function getPosition(node: Locator) {
  return node.evaluate((element) => {
    const transform = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return { x: transform.m41, y: transform.m42 };
  });
}

async function dragNode(page: Page, node: Locator, dx: number, dy: number) {
  const box = await node.boundingBox();
  const x = box!.x + box!.width / 2;
  const y = box!.y + box!.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 5 });
  await page.mouse.up();
}

test.describe('Node origin snapping', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/generic/nodes/snap-origin');
    await expect(getNode(page, 'center')).toHaveCSS('visibility', 'visible');
  });

  for (const { id, expected } of [
    { id: 'center', expected: { x: -30, y: -15 } },
    { id: 'top-left', expected: { x: 220, y: 0 } },
    { id: 'bottom-right', expected: { x: 320, y: -30 } },
    { id: 'odd-size', expected: { x: -30.5, y: 144.5 } },
  ]) {
    test(`dragging snaps the ${id} origin`, async ({ page }) => {
      const node = getNode(page, id);
      await dragNode(page, node, 12, 0);
      await expect.poll(() => getPosition(node)).toEqual(expected);
    });

    test(`keyboard movement snaps the ${id} origin`, async ({ page }) => {
      const node = getNode(page, id);
      await node.click();
      await node.press('ArrowRight');
      await expect.poll(() => getPosition(node)).toEqual(expected);
    });
  }

  test('negative movement keeps the center on the grid', async ({ page }) => {
    const node = getNode(page, 'center');
    await dragNode(page, node, -12, -12);
    await expect.poll(() => getPosition(node)).toEqual({ x: -70, y: -35 });
  });

  test('a selection keeps fractional positions and spacing between differently sized nodes', async ({ page }) => {
    const first = getNode(page, 'odd-size');
    const second = getNode(page, 'other');
    await first.click();
    await page.keyboard.down('s');
    await second.click();
    await page.keyboard.up('s');
    await expect(first).toHaveClass(/selected/);
    await expect(second).toHaveClass(/selected/);

    await dragNode(page, first, 12, 0);

    await expect.poll(() => getPosition(first)).toEqual({ x: -30.5, y: 144.5 });
    await expect.poll(() => getPosition(second)).toEqual({ x: 180, y: 145 });
  });

  test('child nodes snap their absolute origin and stay inside the parent', async ({ page }) => {
    const node = getNode(page, 'child');
    await dragNode(page, node, 12, 0);
    await expect.poll(() => getPosition(node)).toEqual({ x: 490, y: 245 });

    await dragNode(page, node, 200, 0);
    await expect.poll(() => getPosition(node)).toEqual({ x: 525, y: 245 });
  });
});
