import { test, expect, Locator } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('Nodes', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('/tests/generic/nodes/general');
  });

  test.describe('selection', () => {
    test('selecting a node by click', async ({ page }) => {
      const locator = page.locator(`.${FRAMEWORK}-flow__node`).first();
      await locator.click();

      await expect(locator).toHaveClass(/selected/);
    });

    test('selecting multiple nodes with shift drag', async ({ page }) => {
      let nodeSelection = page.locator(
        FRAMEWORK === 'react' ? '.react-flow__nodesselection' : '.svelte-flow__selection-wrapper'
      );
      let selection = page.locator(FRAMEWORK === 'react' ? '.react-flow__selection' : `.${FRAMEWORK}-flow__selection`);

      const nodes = page.locator(`.${FRAMEWORK}-flow__node`);

      await expect(nodes.first()).toHaveCSS('visibility', 'visible');
      await expect(nodes.nth(1)).toHaveCSS('visibility', 'visible');
      await expect(nodes.nth(2)).toHaveCSS('visibility', 'visible');
      const box = await nodes.first().boundingBox();

      await page.keyboard.down('Shift');
      await page.mouse.move(box!.x - 150, box!.y - 25);
      await page.mouse.down();
      await page.mouse.move(box!.x + 275, box!.y + 200);

      await expect(selection).toBeInViewport();
      await page.mouse.up();
      await page.keyboard.up('Shift');

      await expect(nodes.first()).toHaveClass(/selected/);
      await expect(nodes.nth(1)).toHaveClass(/selected/);
      await expect(nodes.nth(2)).toHaveClass(/selected/);

      if (FRAMEWORK === 'ember') {
        await expect(selection).toHaveCSS('opacity', '0');
      } else {
        await expect(nodeSelection).toBeInViewport();
      }
    });

    test('selectable=false prevents selection', async ({ page }) => {
      const locator = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="notSelectable"]'));
      await expect(page.locator(`.${FRAMEWORK}-flow__node`).first()).toHaveCSS('visibility', 'visible');
      await locator.click();

      await expect(locator).not.toHaveClass(/selected/);
    });
  });

  test.describe('dragging', () => {
    test('dragging a node', async ({ page }) => {
      const node = page.locator(`.${FRAMEWORK}-flow__node`).first();

      await expect(node).toHaveCSS('visibility', 'visible');

      const transformBeforeMove = await node.evaluate((element) => {
        return element.style.transform;
      });

      await node.hover();
      await page.mouse.down();
      await page.mouse.move(500, 500);
      await page.mouse.up();

      const transformAfterMove = await node.evaluate((element) => {
        return element.style.transform;
      });

      expect(transformBeforeMove).not.toMatch(transformAfterMove);
    });

    test('draggable=false prevents dragging', async ({ page }) => {
      const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="notDraggable"]'));
      await expect(node).toHaveCSS('visibility', 'visible');

      const transformBeforeMove = await node.evaluate((element) => {
        return element.style.transform;
      });

      await node.hover();
      await page.mouse.down();
      await page.mouse.move(500, 500);
      await page.mouse.up();

      const transformAfterMove = await node.evaluate((element) => {
        return element.style.transform;
      });

      expect(transformBeforeMove).toMatch(transformAfterMove);
    });

    test('custom drag handle works', async ({ page }) => {
      const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="drag-handle"]'));
      await expect(node).toHaveCSS('visibility', 'visible');
      const dragHandle = page.locator('.custom-drag-handle');

      const transformBeforeMove = await node.evaluate((element) => {
        return element.style.transform;
      });

      const nodeBox = await node.boundingBox();

      await page.mouse.move(nodeBox!.x + 10, nodeBox!.y + 10);
      await page.mouse.down();
      await page.mouse.move(500, 500);
      await page.mouse.up();

      const transformAfterMove = await node.evaluate((element) => {
        return element.style.transform;
      });

      expect(transformBeforeMove).toMatch(transformAfterMove);

      await dragHandle.hover();
      await page.mouse.down();
      await page.mouse.move(500, 500);
      await page.mouse.up();

      const transformAfterDragHandleMove = await node.evaluate((element) => {
        return element.style.transform;
      });

      expect(transformBeforeMove).not.toMatch(transformAfterDragHandleMove);
    });

    test('dragging a selected node moves the selected node group', async ({ page }) => {
      test.skip(FRAMEWORK !== 'ember', 'EmberFlow implements selected-node group drag in the adapter layer');

      const firstNode = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="Node-1"]'));
      const secondNode = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="Node-2"]'));

      await expect(firstNode).toBeVisible();
      await expect(secondNode).toBeVisible();

      const firstBox = await firstNode.boundingBox();

      await page.keyboard.down('Shift');
      await page.mouse.move(firstBox!.x - 150, firstBox!.y - 25);
      await page.mouse.down();
      await page.mouse.move(firstBox!.x + 275, firstBox!.y + 200);
      await page.mouse.up();
      await page.keyboard.up('Shift');

      await expect(firstNode).toHaveClass(/selected/);
      await expect(secondNode).toHaveClass(/selected/);

      const secondTransformBefore = await secondNode.evaluate((element) => (element as HTMLElement).style.transform);
      const dragBox = await firstNode.boundingBox();

      await page.mouse.move(dragBox!.x + dragBox!.width / 2, dragBox!.y + dragBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(dragBox!.x + dragBox!.width / 2 + 90, dragBox!.y + dragBox!.height / 2 + 35);
      await page.mouse.up();

      const secondTransformAfter = await secondNode.evaluate((element) => (element as HTMLElement).style.transform);

      expect(secondTransformAfter).not.toEqual(secondTransformBefore);
    });

    test('selected nodes move with arrow keys and shift-arrow acceleration', async ({ page }) => {
      test.skip(FRAMEWORK !== 'ember', 'EmberFlow handles keyboard movement in the adapter layer');

      const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="Node-1"]'));
      const edgePath = page
        .locator(`.${FRAMEWORK}-flow__edge`)
        .and(page.locator('[data-id="1-2"]'))
        .locator(`.${FRAMEWORK}-flow__edge-path`);

      await expect(node).toBeVisible();
      await node.click();
      await expect(node).toHaveClass(/selected/);

      const beforeBox = await node.boundingBox();
      const beforePath = await edgePath.getAttribute('d');

      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('Shift+ArrowDown');

      const afterBox = await node.boundingBox();
      const afterPath = await edgePath.getAttribute('d');

      expect(afterBox!.x).toBeGreaterThan(beforeBox!.x + 3);
      expect(afterBox!.y).toBeGreaterThan(beforeBox!.y + 15);
      expect(afterPath).not.toEqual(beforePath);
    });

    test('arrow keys do not move draggable=false nodes', async ({ page }) => {
      test.skip(FRAMEWORK !== 'ember', 'EmberFlow handles keyboard movement in the adapter layer');

      const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="notDraggable"]'));

      await expect(node).toBeVisible();
      await node.click();
      await expect(node).toHaveClass(/selected/);

      const beforeBox = await node.boundingBox();

      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('Shift+ArrowDown');

      const afterBox = await node.boundingBox();

      expect(afterBox!.x).toEqual(beforeBox!.x);
      expect(afterBox!.y).toEqual(beforeBox!.y);
    });
  });

  test.describe('deleting', () => {
    test('deleting a node and its edges', async ({ page }) => {
      const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="Node-1"]'));
      await expect(node).toHaveCSS('visibility', 'visible');

      await node.click();
      await page.keyboard.press('d');

      await expect(node).not.toBeAttached();

      const edges = await page.locator(`.${FRAMEWORK}-flow__edge`).all();
      expect(edges).toHaveLength(0);
    });

    test('deletable=false prevents deletion', async ({ page }) => {
      const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="notDeletable"]'));
      await expect(node).toHaveCSS('visibility', 'visible');

      await expect(node).toBeAttached();

      await node.click();
      // pressing backspace breaks webkit
      await page.keyboard.press('d');

      await expect(node).toBeAttached();
    });
  });

  test.describe('connecting', () => {
    test('connecting two nodes', async ({ page }) => {
      let connectionLine = page.locator(`.${FRAMEWORK}-flow__connectionline`);
      const outputSourceHandle = page.locator(`.${FRAMEWORK}-flow__handle`).and(page.locator('[data-nodeid="Node-1"]'));
      const inputSourceHandle = page.locator(`.${FRAMEWORK}-flow__handle`).and(page.locator('[data-nodeid="Node-4"]'));

      await expect(page.locator(`.${FRAMEWORK}-flow__node`).first()).toHaveCSS('visibility', 'visible');
      await expect(outputSourceHandle).toBeInViewport();
      await expect(inputSourceHandle).toBeInViewport();

      await expect(page.locator(`.${FRAMEWORK}-flow__edge`)).toHaveCount(2);

      await outputSourceHandle.hover();
      await page.mouse.down();
      await inputSourceHandle.hover();
      await expect(connectionLine).toBeInViewport();
      await page.mouse.up();

      await expect(connectionLine).not.toBeInViewport();

      await expect(page.locator('[data-id="xy-edge__Node-1-Node-4"]')).toBeInViewport();

      await expect(page.locator(`.${FRAMEWORK}-flow__edge`)).toHaveCount(3);
    });

    test('connection line stays anchored while auto-panning near the viewport edge', async ({ page }) => {
      test.skip(FRAMEWORK !== 'ember', 'EmberFlow keeps connection drag off Ember tracked state');

      await page.goto('/tests/generic/nodes/connection-autopan');

      const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
      const connectionLine = page.locator(`.${FRAMEWORK}-flow__connectionline`);
      const connectionPath = page.locator(`.${FRAMEWORK}-flow__connection-path`);
      const outputSourceHandle = page.locator(`.${FRAMEWORK}-flow__handle`).and(page.locator('[data-nodeid="source"]'));

      await expect(outputSourceHandle).toBeInViewport();

      const handleBox = await outputSourceHandle.boundingBox();
      const paneBox = await pane.boundingBox();

      await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(paneBox!.x + paneBox!.width - 8, handleBox!.y + handleBox!.height / 2, { steps: 8 });

      await expect(connectionLine).toBeInViewport();
      const before = await connectionPath.getAttribute('d');

      await expect.poll(async () => connectionPath.getAttribute('d'), { timeout: 2500 }).not.toEqual(before);

      await page.mouse.up();
      await expect(connectionLine).not.toBeInViewport();
    });

    test('connection line type and styles are applied while dragging', async ({ page }) => {
      test.skip(FRAMEWORK !== 'ember', 'This fixture tracks Ember connectionLine prop parity during porting');

      await page.goto('/tests/generic/nodes/connection-line');

      const connectionLine = page.locator(`.${FRAMEWORK}-flow__connectionline`);
      const connectionPath = page.locator(`.${FRAMEWORK}-flow__connection-path`);
      const outputSourceHandle = page.locator(`.${FRAMEWORK}-flow__handle`).and(page.locator('[data-nodeid="source"]'));

      await expect(outputSourceHandle).toBeInViewport();

      const handleBox = await outputSourceHandle.boundingBox();

      await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(handleBox!.x + 260, handleBox!.y + 140, { steps: 8 });

      await expect(connectionLine).toBeInViewport();
      await expect(connectionLine).toHaveCSS('opacity', '0.75');
      await expect(connectionPath).toHaveCSS('stroke', 'rgb(0, 128, 128)');
      await expect(connectionPath).toHaveCSS('stroke-width', '3px');

      const path = await connectionPath.getAttribute('d');
      expect(path).toContain('L');
      expect(path).not.toContain('C');

      await page.mouse.up();
    });

    test('connecting two output handles does not work', async ({ page }) => {
      let connectionLine = page.locator(`.${FRAMEWORK}-flow__connectionline`);
      const firstOutputHandle = page.locator(`.${FRAMEWORK}-flow__handle`).and(page.locator('[data-nodeid="Node-2"]'));
      const secondOutputHandle = page.locator(`.${FRAMEWORK}-flow__handle`).and(page.locator('[data-nodeid="Node-4"]'));

      await expect(page.locator(`.${FRAMEWORK}-flow__node`).first()).toHaveCSS('visibility', 'visible');
      await expect(firstOutputHandle).toBeInViewport();
      await expect(secondOutputHandle).toBeInViewport();

      await expect(page.locator(`.${FRAMEWORK}-flow__edge`)).toHaveCount(2);

      await firstOutputHandle.hover();
      await page.mouse.down();

      // await secondOutputHandle.hover();
      // Does not work in SvelteFlow for whatever reason!?
      // but the following works...
      const box = await secondOutputHandle.boundingBox();
      await page.mouse.move(box!.x + 2, box!.y + 2);

      await expect(connectionLine).toBeInViewport();
      await page.mouse.up();

      await expect(connectionLine).not.toBeInViewport();

      await expect(page.locator(`.${FRAMEWORK}-flow__edge`)).toHaveCount(2);
    });

    test('connecting two input handles does not work', async ({ page }) => {
      let connectionLine = page.locator(`.${FRAMEWORK}-flow__connectionline`);
      const firstInputHandle = page.locator(`.${FRAMEWORK}-flow__handle`).and(page.locator('[data-nodeid="Node-1"]'));
      const secondInputHandle = page
        .locator(`.${FRAMEWORK}-flow__handle`)
        .and(page.locator('[data-nodeid="Node-3"]'))
        .and(page.locator('.source'));

      await expect(page.locator(`.${FRAMEWORK}-flow__node`).first()).toHaveCSS('visibility', 'visible');
      await expect(firstInputHandle).toBeInViewport();
      await expect(secondInputHandle).toBeInViewport();

      await expect(page.locator(`.${FRAMEWORK}-flow__edge`)).toHaveCount(2);

      await firstInputHandle.hover();
      await page.mouse.down();

      // await secondInputHandle.hover();
      // Does not work in SvelteFlow for whatever reason!?
      // but the following works...
      const box = await secondInputHandle.boundingBox();
      await page.mouse.move(box!.x + 2, box!.y + 2);

      await expect(connectionLine).toBeInViewport();
      await page.mouse.up();

      await expect(connectionLine).not.toBeInViewport();

      await expect(page.locator(`.${FRAMEWORK}-flow__edge`)).toHaveCount(2);
    });

    test('connectable=false prevents connections', async ({ page }) => {
      const outputHandle = page.locator(`.${FRAMEWORK}-flow__handle`).and(page.locator('[data-nodeid="Node-1"]'));
      const notConnectableHandle = page
        .locator(`.${FRAMEWORK}-flow__handle`)
        .and(page.locator('[data-nodeid="notConnectable"]'));

      const notConnectableBox = await notConnectableHandle.boundingBox();

      await expect(page.locator(`.${FRAMEWORK}-flow__node`).first()).toHaveCSS('visibility', 'visible');
      await expect(outputHandle).toBeInViewport();
      await expect(notConnectableHandle).toBeInViewport();

      await expect(page.locator(`.${FRAMEWORK}-flow__edge`)).toHaveCount(2);

      await outputHandle.hover();
      await page.mouse.down();
      await page.mouse.move(notConnectableBox!.x + 2, notConnectableBox!.y + 2);
      await page.mouse.up();

      await expect(page.locator(`.${FRAMEWORK}-flow__edge`)).toHaveCount(2);
    });
  });

  test('hidden=true hides the node', async ({ page }) => {
    const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="hidden"]'));

    await expect(node).not.toBeInViewport();
  });

  test('onlyRenderVisibleElements filters offscreen nodes while keeping visible crossing edges', async ({ page }) => {
    test.skip(FRAMEWORK !== 'ember', 'This fixture tracks Ember onlyRenderVisibleElements parity during porting');

    await page.goto('/tests/generic/nodes/only-render-visible');

    await expect(page.locator(`.${FRAMEWORK}-flow__node[data-id="visible"]`)).toBeVisible();
    await expect(page.locator(`.${FRAMEWORK}-flow__node[data-id="offscreen"]`)).not.toBeAttached();
    await expect(page.locator('[data-id="visible-crossing-edge"]')).toBeAttached();
    await expect(page.locator('[data-id="offscreen-edge"]')).not.toBeAttached();
  });

  test('classes get applied', async ({ page }) => {
    const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="Node-1"]'));
    await expect(node).toHaveCSS('visibility', 'visible');

    await expect(node).toHaveClass(/playwright-test-class-123/);
  });

  test('styles get applied', async ({ page }) => {
    const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="Node-1"]'));
    await expect(node).toHaveCSS('visibility', 'visible');

    await expect(node).toHaveCSS('background-color', 'rgb(255, 0, 0)');
  });
});
