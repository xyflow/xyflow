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
      const expectAligned = (actual: number, expected: number) => {
        expect(Math.abs(actual - expected)).toBeLessThanOrEqual(1);
      };

      switch (permutation.align) {
        case 'start':
          expectAligned(toolbarBox![dimension], nodeBox![dimension]);
          break;
        case 'center':
          expectAligned(
            toolbarBox![dimension] + toolbarBox![extent] * 0.5,
            nodeBox![dimension] + nodeBox![extent] * 0.5
          );
          break;
        case 'end':
          expectAligned(toolbarBox![dimension] + toolbarBox![extent], nodeBox![dimension] + nodeBox![extent]);
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

  test('toolbar follows node drag', async ({ page }) => {
    const node = page.locator('[data-id="node-start-top"]').and(page.locator(`.${FRAMEWORK}-flow__node`));
    const toolbar = page
      .locator('[data-id="node-start-top"]')
      .and(page.locator(`.${FRAMEWORK}-flow__node-toolbar`));

    await expect(node).toBeAttached();
    await expect(toolbar).toBeAttached();

    const nodeBefore = await node.boundingBox();
    const toolbarBefore = await toolbar.boundingBox();

    await page.mouse.move(nodeBefore!.x + nodeBefore!.width / 2, nodeBefore!.y + nodeBefore!.height / 2);
    await page.mouse.down();
    await page.mouse.move(nodeBefore!.x + nodeBefore!.width / 2 + 90, nodeBefore!.y + nodeBefore!.height / 2 + 55, {
      steps: 4,
    });
    await page.mouse.up();

    const nodeAfter = await node.boundingBox();
    const toolbarAfter = await toolbar.boundingBox();
    const nodeDelta = {
      x: nodeAfter!.x - nodeBefore!.x,
      y: nodeAfter!.y - nodeBefore!.y,
    };
    const toolbarDelta = {
      x: toolbarAfter!.x - toolbarBefore!.x,
      y: toolbarAfter!.y - toolbarBefore!.y,
    };

    expect(Math.abs(toolbarDelta.x - nodeDelta.x)).toBeLessThan(1);
    expect(Math.abs(toolbarDelta.y - nodeDelta.y)).toBeLessThan(1);
    expect(toolbarAfter!.y).toBeLessThan(nodeAfter!.y);
  });
});

test.describe('Node adornments', () => {
  test('app-owned tile menu is positioned by NodeToolbar and can call the store', async ({ page }) => {
    await page.goto('/examples/parity/node-adornments');

    const strategyNode = page.locator('[data-id="strategy"]').and(page.locator(`.${FRAMEWORK}-flow__node`));
    const adornment = page.locator('.parity-adornment-menu--tile');

    await expect(strategyNode).toBeAttached();
    await expect(adornment).toBeAttached();
    await expect(page.getByRole('toolbar', { name: 'Tile adornment actions' })).toBeVisible();

    const nodeBefore = await strategyNode.boundingBox();
    const toolbarBefore = await adornment.boundingBox();

    await page.getByRole('button', { name: 'promote' }).click();
    await expect(page.getByLabel('Adornment log')).toContainText('promoted strategy from NodeToolbar');
    await expect(strategyNode).toContainText('Polished tile');

    await page.mouse.move(nodeBefore!.x + nodeBefore!.width / 2, nodeBefore!.y + nodeBefore!.height / 2);
    await page.mouse.down();
    await page.mouse.move(nodeBefore!.x + nodeBefore!.width / 2 + 80, nodeBefore!.y + nodeBefore!.height / 2 + 48, {
      steps: 5,
    });
    await page.mouse.up();

    const nodeAfter = await strategyNode.boundingBox();
    const toolbarAfter = await adornment.boundingBox();

    expect(Math.abs((toolbarAfter!.x - toolbarBefore!.x) - (nodeAfter!.x - nodeBefore!.x))).toBeLessThan(1);
    expect(Math.abs((toolbarAfter!.y - toolbarBefore!.y) - (nodeAfter!.y - nodeBefore!.y))).toBeLessThan(1);
  });

  test('external Ember UI can retarget tile adornments', async ({ page }) => {
    await page.goto('/examples/parity/node-adornments');

    const designNode = page.locator('[data-id="design"]').and(page.locator(`.${FRAMEWORK}-flow__node`));
    const adornment = page.locator('.parity-adornment-menu--tile');

    await page.getByRole('button', { name: 'select design' }).click();
    await expect(page.getByLabel('Adornment log')).toContainText('selected design');
    await expect(adornment).toContainText('design');

    const designBox = await designNode.boundingBox();
    const adornmentBox = await adornment.boundingBox();

    expect(adornmentBox!.y).toBeLessThan(designBox!.y);
  });

  test('passive artboard labels are always visible and track their tiles', async ({ page }) => {
    await page.goto('/examples/parity/node-adornments');

    const strategyNode = page.locator('[data-id="strategy"]').and(page.locator(`.${FRAMEWORK}-flow__node`));
    const label = page.getByLabel('Artboard label').filter({ hasText: 'Strategy tile' });

    await expect(label).toBeVisible();
    await expect(page.getByLabel('Artboard label')).toHaveCount(3);

    const nodeBefore = await strategyNode.boundingBox();
    const labelBefore = await label.boundingBox();

    await page.mouse.move(nodeBefore!.x + nodeBefore!.width / 2, nodeBefore!.y + nodeBefore!.height / 2);
    await page.mouse.down();
    await page.mouse.move(nodeBefore!.x + nodeBefore!.width / 2 + 72, nodeBefore!.y + nodeBefore!.height / 2 + 36, {
      steps: 5,
    });
    await page.mouse.up();

    const nodeAfter = await strategyNode.boundingBox();
    const labelAfter = await label.boundingBox();

    expect(Math.abs((labelAfter!.x - labelBefore!.x) - (nodeAfter!.x - nodeBefore!.x))).toBeLessThan(1);
    expect(Math.abs((labelAfter!.y - labelBefore!.y) - (nodeAfter!.y - nodeBefore!.y))).toBeLessThan(1);
  });
});
