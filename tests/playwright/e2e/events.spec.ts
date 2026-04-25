import { test, expect, Page } from '@playwright/test';

import { FRAMEWORK } from './constants';

async function getEvents(page: Page) {
  return page.evaluate(() => (window as any).__emberFlowEvents ?? []);
}

test.describe('Events', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).__emberFlowEvents = [];
    });
    await page.goto('/tests/generic/events/general');
    await page.waitForSelector('[data-id="event-a"]', { timeout: 5000 });
  });

  test('emits init and viewport callbacks', async ({ page }) => {
    const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
    const box = await pane.boundingBox();

    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.wheel(0, -120);
    await page.waitForFunction(() =>
      ((window as any).__emberFlowEvents ?? []).some((event: { type: string }) => event.type === 'viewport-end'),
    );

    expect(await getEvents(page)).toEqual(
      expect.arrayContaining([
        { type: 'init', id: '2:1' },
        expect.objectContaining({ type: 'viewport-start' }),
        expect.objectContaining({ type: 'viewport-change' }),
        expect.objectContaining({ type: 'viewport-end' }),
      ]),
    );
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

  test('emits selection drag lifecycle callbacks', async ({ page }) => {
    const nodeA = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="event-a"]'));
    const nodeB = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="event-b"]'));

    const boxA = await nodeA.boundingBox();
    const boxB = await nodeB.boundingBox();

    await page.keyboard.down('Shift');
    await page.mouse.move(boxA!.x - 20, boxA!.y - 20);
    await page.mouse.down();
    await page.mouse.move(boxB!.x + boxB!.width + 20, boxB!.y + boxB!.height + 20, { steps: 8 });
    await page.mouse.up();
    await page.keyboard.up('Shift');

    await expect(nodeA).toHaveClass(/selected/);
    await expect(nodeB).toHaveClass(/selected/);

    const selectedBox = await nodeA.boundingBox();
    await page.mouse.move(selectedBox!.x + 20, selectedBox!.y + 20);
    await page.mouse.down();
    await page.mouse.move(selectedBox!.x + 90, selectedBox!.y + 80, { steps: 8 });
    await page.mouse.up();

    expect(await getEvents(page)).toEqual(
      expect.arrayContaining([
        { type: 'selection-start' },
        { type: 'selection-end' },
        { type: 'selection-drag-start', nodes: ['event-a', 'event-b'] },
        { type: 'selection-drag', nodes: ['event-a', 'event-b'] },
        { type: 'selection-drag-stop', nodes: ['event-a', 'event-b'] },
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

  test('emits extended pane, node, and edge pointer callbacks', async ({ page }) => {
    const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="event-a"]'));
    const edge = page.locator(`.${FRAMEWORK}-flow__edge`).and(page.locator('[data-id="event-edge"]'));
    const pane = page.locator(`.${FRAMEWORK}-flow__pane`);

    await expect(node).toBeVisible();
    await node.dblclick();
    await node.click({ button: 'right' });

    await expect(edge).toBeAttached();
    await edge.dispatchEvent('mouseenter', { bubbles: false });
    await edge.dispatchEvent('mousemove', { bubbles: true });
    await edge.dispatchEvent('dblclick', { bubbles: true });
    await edge.dispatchEvent('contextmenu', { bubbles: true });
    await edge.dispatchEvent('mouseleave', { bubbles: false });

    await pane.dispatchEvent('mousemove', { bubbles: true });
    await page.mouse.wheel(0, 20);
    await pane.dispatchEvent('contextmenu', { bubbles: true });

    await expect.poll(async () => getEvents(page)).toEqual(
      expect.arrayContaining([
        { type: 'node-double-click', id: 'event-a' },
        { type: 'node-context-menu', id: 'event-a' },
        { type: 'edge-double-click', id: 'event-edge' },
        { type: 'edge-context-menu', id: 'event-edge' },
        { type: 'edge-mouse-enter', id: 'event-edge' },
        { type: 'edge-mouse-move', id: 'event-edge' },
        { type: 'edge-mouse-leave', id: 'event-edge' },
        { type: 'pane-mouse-move' },
        { type: 'pane-scroll' },
        { type: 'pane-context-menu' },
      ]),
    );
  });

  test('supports keyboard selection for focusable nodes and edges', async ({ page }) => {
    const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="event-a"]'));
    const edge = page.locator(`.${FRAMEWORK}-flow__edge`).and(page.locator('[data-id="event-edge"]'));

    await expect(node).toHaveAttribute('tabindex', '0');
    await expect(node).toHaveAttribute('aria-roledescription', 'node');
    await expect(edge).toHaveAttribute('tabindex', '0');
    await expect(edge).toHaveAttribute('aria-roledescription', 'edge');
    await expect(edge).toHaveAttribute('aria-label', 'Edge from event-a to event-b');

    await node.focus();
    await page.keyboard.press('Enter');
    await expect(node).toHaveClass(/selected/);

    await page.keyboard.press('Escape');
    await expect(node).not.toHaveClass(/selected/);

    await edge.focus();
    await page.keyboard.press('Space');
    await expect(edge).toHaveClass(/selected/);

    await page.keyboard.press('Escape');
    await expect(edge).not.toHaveClass(/selected/);
  });

  test('respects focusable=false on nodes and edges', async ({ page }) => {
    await page.goto('/tests/generic/events/focusable-options');

    const focusableNode = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="focusable-node"]'));
    const unfocusableNode = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="unfocusable-node"]'));
    const focusableEdge = page.locator(`.${FRAMEWORK}-flow__edge`).and(page.locator('[data-id="focusable-edge"]'));
    const unfocusableEdge = page.locator(`.${FRAMEWORK}-flow__edge`).and(page.locator('[data-id="unfocusable-edge"]'));

    await expect(focusableNode).toHaveAttribute('tabindex', '0');
    await expect(unfocusableNode).not.toHaveAttribute('tabindex');
    await expect(focusableEdge).toHaveAttribute('tabindex', '0');
    await expect(unfocusableEdge).not.toHaveAttribute('tabindex');
    await expect(unfocusableEdge).toHaveAttribute('role', 'img');
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
        { type: 'connect-end-state', id: 'true:event-a' },
      ]),
    );
  });

  test('emits delete lifecycle callbacks', async ({ page }) => {
    const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="event-a"]'));

    await node.click();
    await page.keyboard.press('d');

    await expect(node).toHaveCount(0);
    expect(await getEvents(page)).toEqual(
      expect.arrayContaining([
        { type: 'before-delete', nodes: ['event-a'], edges: ['event-edge'] },
        { type: 'edges-delete', edges: ['event-edge'] },
        { type: 'nodes-delete', nodes: ['event-a'] },
        { type: 'delete', nodes: ['event-a'], edges: ['event-edge'] },
      ]),
    );
  });
});
