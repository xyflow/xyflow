import { test, expect } from '@playwright/test';
import { FRAMEWORK } from './constants';

type Position = 'top' | 'right' | 'bottom' | 'left';
const positions: Position[] = ['top', 'right', 'bottom', 'left'];

type Alignment = 'start' | 'center' | 'end';
const alignments: Alignment[] = ['start', 'center', 'end'];
type Permutation = {
  id: string;
  position: Position;
  align: Alignment;
};
const permutations: Permutation[] = [];

positions.forEach((position) => {
  alignments.forEach((align) => {
    permutations.push({
      id: `node-${align}-${position}`,
      position,
      align,
    });
  });
});

test.describe('Node Toolbar', async () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('/tests/generic/node-toolbar/general');
    // Wait till the edges are rendered
    await page.waitForSelector('[data-id="first-edge"]', { timeout: 5000 });
  });

  test('all toolbars are positioned correctly', async ({ page }) => {
    const tests = permutations.map((permutation) => async () => {
      const toolbar = page
        .locator(`[data-id="${permutation.id}"]`)
        .and(page.locator(`.${FRAMEWORK}-flow__node-toolbar`));
      const node = page.locator(`[data-id="${permutation.id}"]`).and(page.locator(`.${FRAMEWORK}-flow__node`));

      await expect(toolbar).toBeAttached({ timeout: 5000 });
      await expect(node).toBeAttached({ timeout: 5000 });

      const toolbarBox = await toolbar.boundingBox();
      const nodeBox = await node.boundingBox();

      switch (permutation.position) {
        case 'top':
          expect(toolbarBox!.y).toBeLessThan(nodeBox!.y);
          break;
        case 'right':
          expect(toolbarBox!.x).toBeGreaterThan(nodeBox!.x);
          break;
        case 'bottom':
          expect(toolbarBox!.y).toBeGreaterThan(nodeBox!.y);
          break;
        case 'left':
          expect(toolbarBox!.x).toBeLessThan(nodeBox!.x);
          break;
      }

      const dimension = permutation.position === 'top' || permutation.position === 'bottom' ? 'x' : 'y';
      const extent = permutation.position === 'top' || permutation.position === 'bottom' ? 'width' : 'height';

      switch (permutation.align) {
        case 'start':
          expect(Math.floor(toolbarBox![dimension])).toBe(Math.floor(nodeBox![dimension]));
          break;
        case 'center':
          expect(Math.floor(toolbarBox![dimension] + toolbarBox![extent] * 0.5)).toBe(
            Math.floor(nodeBox![dimension] + nodeBox![extent] * 0.5)
          );
          break;
        case 'end':
          expect(Math.floor(toolbarBox![dimension] + toolbarBox![extent])).toBe(
            Math.floor(nodeBox![dimension] + nodeBox![extent])
          );
          break;
      }
    });
    await Promise.all(tests.map((t) => t()));
  });

  test('toolbar default behaviour', async ({ page }) => {
    const node = page.locator('[data-id="default-node"]').and(page.locator(`.${FRAMEWORK}-flow__node`));
    const toolbar = page.locator('[data-id="default-node"]').and(page.locator(`.${FRAMEWORK}-flow__node-toolbar`));

    await expect(node).toBeAttached();
    await expect(toolbar).not.toBeAttached();

    await node.click();
    await expect(toolbar).toBeAttached();
  });
});
