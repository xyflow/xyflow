import { test, expect, Locator } from '@playwright/test';

import { FRAMEWORK } from './constants';
import { getTransform } from './utils';

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
      const nodeSelection = page.locator(
        FRAMEWORK === 'svelte' ? '.svelte-flow__selection' : `.${FRAMEWORK}-flow__nodesselection`,
      );
      const selection = page.locator(
        FRAMEWORK === 'svelte' ? '.svelte-flow__selection' : `.${FRAMEWORK}-flow__selection`,
      );

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

      await expect(nodeSelection).toBeInViewport();
    });

    test('panning from a multi-selection rectangle with the middle mouse button', async ({ page }) => {
      test.skip(FRAMEWORK !== 'react', 'The React selection rectangle has its own drag handler');

      const nodes = page.locator('.react-flow__node');
      const selection = page.locator('.react-flow__nodesselection-rect');
      const viewport = page.locator('.react-flow__viewport');

      await expect(nodes.first()).toHaveCSS('visibility', 'visible');
      const nodeBox = await nodes.first().boundingBox();

      await page.keyboard.down('Shift');
      await page.mouse.move(nodeBox!.x - 150, nodeBox!.y - 25);
      await page.mouse.down();
      await page.mouse.move(nodeBox!.x + 275, nodeBox!.y + 200);
      await page.mouse.up();
      await page.keyboard.up('Shift');

      await expect(selection).toBeInViewport();
      const selectionBox = await selection.boundingBox();
      const transformsBefore = await getTransform(viewport);
      const selectionCenter = {
        x: selectionBox!.x + selectionBox!.width / 2,
        y: selectionBox!.y + selectionBox!.height / 2,
      };

      await page.mouse.move(selectionCenter.x, selectionCenter.y);
      await page.mouse.down({ button: 'middle' });
      await page.mouse.move(selectionCenter.x + 100, selectionCenter.y + 100);
      await page.mouse.up({ button: 'middle' });

      const transformsAfter = await getTransform(viewport);

      expect(transformsAfter.translateX).not.toBe(transformsBefore.translateX);
      expect(transformsAfter.translateY).not.toBe(transformsBefore.translateY);
    });

    test('selectable=false prevents selection', async ({ page }) => {
      const locator = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="notSelectable"]'));
      await expect(page.locator(`.${FRAMEWORK}-flow__node`).first()).toHaveCSS('visibility', 'visible');
      await locator.click();

      await expect(locator).not.toHaveClass(/selected/);
    });

    test('selection box remains active while dragging the selected nodes', async ({ page }) => {
      test.skip(FRAMEWORK !== 'react', 'The React selection rectangle has its own drag handler');

      const nodes = page.locator('.react-flow__node');
      const selection = page.locator('.react-flow__nodesselection-rect');

      await expect(nodes.first()).toBeVisible();
      const nodeBox = await nodes.first().boundingBox();
      expect(nodeBox).not.toBeNull();

      // 1. Marquee select multiple nodes
      await page.keyboard.down('Shift');
      await page.mouse.move(nodeBox!.x - 150, nodeBox!.y - 25);
      await page.mouse.down();
      await page.mouse.move(nodeBox!.x + 275, nodeBox!.y + 200);
      await page.mouse.up();
      await page.keyboard.up('Shift');

      await expect(nodes.first()).toHaveClass(/selected/);
      await expect(nodes.nth(1)).toHaveClass(/selected/);
      await expect(selection).toBeVisible();

      const boxBeforeDrag = await selection.boundingBox();
      expect(boxBeforeDrag).not.toBeNull();

      const selectionCenter = {
        x: boxBeforeDrag!.x + boxBeforeDrag!.width / 2,
        y: boxBeforeDrag!.y + boxBeforeDrag!.height / 2,
      };

      // 2. Drag the selection box
      await page.mouse.move(selectionCenter.x, selectionCenter.y);
      await page.mouse.down();
      await page.mouse.move(selectionCenter.x + 80, selectionCenter.y + 60);

      // 3. Verify selection box remains visible and mounted during active drag
      await expect(selection).toBeVisible();
      const boxDuringDrag = await selection.boundingBox();
      expect(boxDuringDrag).not.toBeNull();
      expect(boxDuringDrag!.x).toBeGreaterThan(boxBeforeDrag!.x);
      expect(boxDuringDrag!.y).toBeGreaterThan(boxBeforeDrag!.y);

      // 4. Release drag and verify selection box remains visible at final position
      await page.mouse.up();
      await expect(selection).toBeVisible();
      const boxAfterDrag = await selection.boundingBox();
      expect(boxAfterDrag).not.toBeNull();
      expect(boxAfterDrag!.x).toBeGreaterThan(boxBeforeDrag!.x);
      expect(boxAfterDrag!.y).toBeGreaterThan(boxBeforeDrag!.y);
    });

    test('resets stale selection bounding box when selected nodes are replaced programmatically (#6156)', async ({
      page,
    }) => {
      test.skip(FRAMEWORK !== 'react', 'Issue #6156 specific to React Flow NodesSelection bounding box');

      await page.goto('/examples/node-selection-bug');

      const initialNode = page.locator('.react-flow__node').first();
      await expect(initialNode).toBeVisible();

      const box = await initialNode.boundingBox();
      expect(box).not.toBeNull();

      // 1. Marquee select initial node
      await page.keyboard.down('Shift');
      await page.mouse.move(box!.x - 50, box!.y - 50);
      await page.mouse.down();
      await page.mouse.move(box!.x + box!.width + 50, box!.y + box!.height + 50);
      await page.mouse.up();
      await page.keyboard.up('Shift');

      await expect(initialNode).toHaveClass(/selected/);
      const selectionRect = page.locator('.react-flow__nodesselection-rect');
      await expect(selectionRect).toBeVisible();

      // 2. Programmatically replace selected nodes with newly pasted nodes (without canvas click)
      await page.getByRole('button', { name: 'Click me to add nodes that are already selected.' }).click();

      // 3. Verify new nodes are added and marked selected
      const nodes = page.locator('.react-flow__node');
      await expect(nodes).toHaveCount(3);
      await expect(nodes.nth(1)).toHaveClass(/selected/);
      await expect(nodes.nth(2)).toHaveClass(/selected/);
      await expect(nodes.first()).not.toHaveClass(/selected/);

      // 4. Verify selection bounding box no longer exists around new nodes (#6156)
      await expect(selectionRect).not.toBeVisible();
      await expect(selectionRect).toHaveCount(0);
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

    test('dragging one node of a selection moves the whole selection', async ({ page }) => {
      const nodes = page.locator(`.${FRAMEWORK}-flow__node`);
      await expect(nodes.first()).toHaveCSS('visibility', 'visible');
      const nodeBox = (await nodes.first().boundingBox())!;

      await page.keyboard.down('Shift');
      await page.mouse.move(nodeBox.x - 150, nodeBox.y - 25);
      await page.mouse.down();
      await page.mouse.move(nodeBox.x + 275, nodeBox.y + 200);
      await page.mouse.up();
      await page.keyboard.up('Shift');

      await expect(nodes.first()).toHaveClass(/selected/);
      await expect(nodes.nth(1)).toHaveClass(/selected/);

      const transforms = () => nodes.evaluateAll((elements: HTMLElement[]) => elements.map((element) => element.style.transform));
      const transformsBeforeMove = await transforms();

      await page.mouse.move(nodeBox.x + nodeBox.width / 2, nodeBox.y + nodeBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(nodeBox.x + nodeBox.width / 2 + 80, nodeBox.y + nodeBox.height / 2 + 60, { steps: 5 });
      await page.mouse.up();

      const transformsAfterMove = await transforms();
      const moved = transformsBeforeMove.filter((transform, index) => transform !== transformsAfterMove[index]);

      expect(moved.length).toBeGreaterThan(1);
    });

    test.describe('touch', () => {
      test.use({ hasTouch: true });

      test('dragging a node with a touch gesture', async ({ page, context, browserName }) => {
        test.skip(browserName !== 'chromium', 'touch gestures are dispatched through CDP');

        const node = page.locator(`.${FRAMEWORK}-flow__node`).first();
        await expect(node).toHaveCSS('visibility', 'visible');

        const transformBeforeMove = await node.evaluate((element) => element.style.transform);

        const box = (await node.boundingBox())!;
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;

        const cdp = await context.newCDPSession(page);
        const touch = (type: string, pointerX: number, pointerY: number) =>
          cdp.send('Input.dispatchTouchEvent', {
            type,
            touchPoints: type === 'touchEnd' ? [] : [{ x: pointerX, y: pointerY, id: 1, radiusX: 10, radiusY: 10, force: 1 }],
          });

        await touch('touchStart', x, y);
        for (let step = 1; step <= 6; step++) {
          await touch('touchMove', x + step * 12, y + step * 8);
        }
        await touch('touchEnd', x + 72, y + 48);

        const transformAfterMove = await node.evaluate((element) => element.style.transform);

        expect(transformBeforeMove).not.toMatch(transformAfterMove);
      });
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
  });

  test.describe('keyboard', () => {
    test('moving a selected node with arrow keys announces its new position', async ({ page }) => {
      const node = page.locator(`.${FRAMEWORK}-flow__node`).and(page.locator('[data-id="Node-1"]'));
      const liveRegion = page.locator(`[id^="${FRAMEWORK}-flow__aria-live"]`);

      await node.focus();
      await page.keyboard.press('Enter');
      await expect(node).toHaveClass(/selected/);

      await page.keyboard.press('ArrowRight');
      await expect(liveRegion).toHaveText('Moved selected node right. New position, x: 5, y: 0');

      await page.keyboard.press('ArrowDown');
      await expect(liveRegion).toHaveText('Moved selected node down. New position, x: 5, y: 5');
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
