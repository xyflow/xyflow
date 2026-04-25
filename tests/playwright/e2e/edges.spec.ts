import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('Edges', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('/tests/generic/edges/general');

    // Timeout gets ignored and tests timeout after 200ms ???
    // page.waitForSelector('[data-id="edge-with-class"]', { timeout: 5000 });
  });

  test.describe('selection', () => {
    test('selecting an edge by click', async ({ page }) => {
      const edge = page.locator(`[data-id="edge-with-class"]`);

      await expect(edge).toBeAttached();
      await edge.click();
      await expect(edge).toHaveClass(/selected/);
    });

    test('selecting multiple edges by meta-click', async ({ page }) => {
      const edge1 = page.locator('[data-id="edge-with-class"]');
      const edge2 = page.locator('[data-id="edge-with-style"]');

      await expect(edge1).toBeAttached();
      await expect(edge2).toBeAttached();

      await edge1.click();
      await expect(edge1).toHaveClass(/selected/);

      // we are using "s" here because Meta doesn't work for some reason
      await page.keyboard.down('s');
      await edge2.click();
      await page.keyboard.up('s');

      await expect(edge2).toHaveClass(/selected/);
      await expect(edge1).toHaveClass(/selected/);
    });
  });

  test.describe('properties', () => {
    test('classes get applied', async ({ page }) => {
      const edge = page.locator('[data-id="edge-with-class"]');

      await expect(edge).toHaveClass(/edge-class-test/);
    });

    test('styles get applied', async ({ page }) => {
      const edge = page.locator('[data-id="edge-with-style"]').locator(`.${FRAMEWORK}-flow__edge-path`);

      await expect(edge).toHaveCSS('stroke', 'rgb(255, 0, 0)');
    });

    test('hidden=true hides edge', async ({ page }) => {
      const edge = page.locator('#hidden-edge');

      await expect(edge).not.toBeVisible();
    });

    test('animated=true add "animated" class', async ({ page }) => {
      const edge = page.locator('[data-id="animated-edge"]');

      await expect(edge).toHaveClass(/animated/);
    });

    test('selectable=false prevents selecting of edges', async ({ page }) => {
      const edge = page.locator('[data-id="not-selectable-edge"]');

      await expect(edge).toBeAttached();
      await expect(edge).not.toHaveClass(/selected/);

      // For some reason these commands do not work
      // await expect(edge).toBeInViewport();
      // await edge.click();

      const edgeBox = await edge.boundingBox();

      await page.mouse.move(edgeBox!.x + edgeBox!.width * 0.5, edgeBox!.y + edgeBox!.height * 0.5);
      await page.mouse.down();
      await page.mouse.up();

      await expect(edge).not.toHaveClass(/selected/);
    });

    test('deleting edges is possible', async ({ page }) => {
      const edge = page.locator('[data-id="edge-with-class"]');

      await expect(edge).toBeAttached();

      await edge.click();
      await expect(edge).toHaveClass(/selected/);

      await page.keyboard.press('d');

      await expect(edge).not.toBeAttached();
    });

    test('deletable=false prevents deleting of edges', async ({ page }) => {
      const edge = page.locator('[data-id="not-deletable"]');

      await expect(edge).toBeAttached();

      // For some reason these commands do not work
      // await expect(edge).toBeInViewport();
      // await edge.click();

      const edgeBox = await edge.boundingBox();

      await page.mouse.move(edgeBox!.x + edgeBox!.width * 0.5, edgeBox!.y + edgeBox!.height * 0.5);
      await page.mouse.down();
      await page.mouse.up();

      await expect(edge).toHaveClass(/selected/);

      await page.keyboard.press('d');
      await expect(edge).toBeAttached();
    });

    test('zIndex sets z-index of edge svgs', async ({ page }) => {
      const svg = page.locator('svg', { has: page.locator('[data-id="z-index"]') });

      await expect(svg).toBeAttached();
      await expect(svg).toHaveCSS('z-index', '3141592');
    });

    test('aria-lable is working', async ({ page }) => {
      const edge = page.locator('[data-id="aria-label"]');

      await expect(edge).toHaveAttribute('aria-label', 'aria-label-test');
    });

    test('interactionWidth is working', async ({ page }) => {
      const edge = page.locator('[data-id="interaction-width"]');

      await expect(edge).toBeAttached();

      const edgeBox = await edge.boundingBox();

      await page.mouse.move(edgeBox!.x + edgeBox!.width * 0.5 + 21, edgeBox!.y + edgeBox!.height * 0.5);
      await page.mouse.down();
      await page.mouse.up();

      await expect(edge).toHaveClass(/selected/);
    });

    test('marker-start, marker-end set markers', async ({ page }) => {
      const edge = page.locator('[data-id="markers"]').locator(`.${FRAMEWORK}-flow__edge-path`);

      await expect(edge).toBeAttached();

      await expect(edge).toHaveAttribute('marker-start', "url('#1__type=arrowclosed')");
      await expect(edge).toHaveAttribute('marker-end', "url('#1__type=arrow')");
    });

    test('defaultEdgeOptions apply to rendered edges', async ({ page }) => {
      test.skip(FRAMEWORK !== 'ember', 'This fixture tracks Ember defaultEdgeOptions parity during porting');

      await page.goto('/tests/generic/edges/default-options');

      const edge = page.locator('[data-id="defaulted-edge"]');
      const path = edge.locator(`.${FRAMEWORK}-flow__edge-path`);
      const label = page
        .locator(`.${FRAMEWORK}-flow__edge-text, .${FRAMEWORK}-flow__edge-label`)
        .filter({ hasText: 'default edge' });

      await expect(edge).toHaveClass(/animated/);
      await expect(path).toHaveCSS('stroke', 'rgb(180, 0, 180)');
      await expect(path).toHaveAttribute('marker-end', "url('#1__type=arrowclosed')");
      await expect(label).toBeVisible();
    });

    test('label renders regular edge text', async ({ page }) => {
      const label = page
        .locator(`.${FRAMEWORK}-flow__edge-text, .${FRAMEWORK}-flow__edge-label`)
        .filter({ hasText: 'animated' });

      await expect(label).toBeVisible();
    });

    test('clicking a regular edge label selects the edge', async ({ page }) => {
      const edge = page.locator('[data-id="animated-edge"]');
      const label = page
        .locator(`.${FRAMEWORK}-flow__edge-textwrapper, .${FRAMEWORK}-flow__edge-label`)
        .filter({ hasText: 'animated' });

      await expect(edge).toBeAttached();
      await expect(label).toBeVisible();

      await label.click();

      await expect(edge).toHaveClass(/selected/);
    });

    test('built-in straight, step, smoothstep, and simplebezier edge types render distinct paths', async ({ page }) => {
      const straightPath = page.locator('[data-id="straight-edge"]').locator(`.${FRAMEWORK}-flow__edge-path`);
      const stepPath = page.locator('[data-id="step-edge"]').locator(`.${FRAMEWORK}-flow__edge-path`);
      const smoothStepPath = page.locator('[data-id="smoothstep-edge"]').locator(`.${FRAMEWORK}-flow__edge-path`);
      const simpleBezierPath = page
        .locator('[data-id="simplebezier-edge"]')
        .locator(`.${FRAMEWORK}-flow__edge-path`);

      await expect(straightPath).toBeAttached();
      await expect(stepPath).toBeAttached();
      await expect(smoothStepPath).toBeAttached();
      await expect(simpleBezierPath).toBeAttached();

      const straightD = await straightPath.getAttribute('d');
      const stepD = await stepPath.getAttribute('d');
      const smoothStepD = await smoothStepPath.getAttribute('d');
      const simpleBezierD = await simpleBezierPath.getAttribute('d');

      expect(straightD).toContain('L');
      expect(straightD).not.toContain('C');
      expect(stepD).toContain('L');
      expect(stepD).not.toContain('C');
      expect(smoothStepD).toContain('L');
      expect(simpleBezierD).toContain('C');
      expect(smoothStepD).not.toEqual(straightD);
      expect(smoothStepD).not.toEqual(stepD);
      expect(simpleBezierD).not.toEqual(smoothStepD);
    });

    test('custom Ember edge components render through edgeTypes', async ({ page }) => {
      test.skip(FRAMEWORK !== 'ember', 'Ember custom edge component parity sample');

      await page.goto('/examples/parity/edges');

      const customEdge = page.locator('[data-id="animated-marker"]');
      const customEdgeComponent = page.getByTestId('custom-status-edge');

      await expect(customEdgeComponent).toBeVisible();
      await expect(customEdgeComponent.locator(`.${FRAMEWORK}-flow__edge-path`)).toHaveCSS(
        'stroke',
        'rgb(219, 39, 119)',
      );
      await expect(
        page.locator(`.${FRAMEWORK}-flow__edge-text, .${FRAMEWORK}-flow__edge-label`).filter({ hasText: 'custom edge' }),
      ).toBeVisible();

      await customEdge.click();
      await expect(customEdge).toHaveClass(/selected/);
    });

    test('custom Ember connection line component renders while connecting', async ({ page }) => {
      test.skip(FRAMEWORK !== 'ember', 'Ember custom connection-line component parity sample');

      await page.goto('/tests/generic/nodes/custom-connection-line');

      const source = page.locator('[data-nodeid="source"][data-handletype="source"]');
      const sourceBox = await source.boundingBox();

      await page.mouse.move(sourceBox!.x + sourceBox!.width / 2, sourceBox!.y + sourceBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(sourceBox!.x + 160, sourceBox!.y + 80, { steps: 4 });

      const line = page.getByTestId('custom-connection-line');
      await expect(line).toBeVisible();
      await expect(line).toHaveCSS('stroke', 'rgb(15, 118, 110)');

      await page.mouse.up();
      await expect(line).toBeHidden();
    });

    test('selected edge affordance follows node drag', async ({ page }) => {
      test.skip(FRAMEWORK !== 'ember', 'Ember selection halo is an Ember-specific affordance');

      const edge = page.locator('[data-id="edge-with-class"]');
      const edgePath = edge.locator('.ember-flow__edge-path');
      const selectionPath = edge.locator('.ember-flow__edge-selection');
      const sourceNode = page.locator('.ember-flow__node[data-id="1"]');

      await expect(edge).toBeAttached();
      await edge.click();
      await expect(selectionPath).toBeAttached();

      const before = await selectionPath.getAttribute('d');
      const sourceBox = await sourceNode.boundingBox();

      await page.mouse.move(sourceBox!.x + sourceBox!.width / 2, sourceBox!.y + sourceBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(sourceBox!.x + sourceBox!.width / 2 + 80, sourceBox!.y + sourceBox!.height / 2 + 20);
      await page.mouse.up();

      const after = await selectionPath.getAttribute('d');
      const visiblePath = await edgePath.getAttribute('d');

      expect(after).not.toEqual(before);
      expect(after).toEqual(visiblePath);
    });

    test('z-index', async ({ page }) => {
      const svg = page.locator('svg', { has: page.locator('[data-id="edge-with-class"]') });

      await expect(svg).toBeAttached();
      await expect(svg).toHaveCSS('z-index', '0');
    });

    test('sub flow: normal node to child node, z-index', async ({ page }) => {
      const svg = page.locator('svg', { has: page.locator('[data-id="subflow-edge"]') });

      await expect(svg).toBeAttached();
      await expect(svg).toHaveCSS('z-index', '1');
    });

    test('sub flow: child node to child node, z-index', async ({ page }) => {
      const svg = page.locator('svg', { has: page.locator('[data-id="subflow-edge-2"]') });

      await expect(svg).toBeAttached();
      await expect(svg).toHaveCSS('z-index', '1');
    });

    test('sub flow children and edges track parent drag before drop', async ({ page }) => {
      test.skip(FRAMEWORK !== 'ember', 'EmberFlow live subflow drag parity.');

      const parent = page.locator(`.${FRAMEWORK}-flow__node[data-id="12"]`);
      const child = page.locator(`.${FRAMEWORK}-flow__node[data-id="12-a"]`);
      const edgePath = page.locator('[data-id="subflow-edge-2"]').locator(`.${FRAMEWORK}-flow__edge-path`);

      await expect(parent).toBeVisible();
      await expect(child).toBeVisible();

      const parentBox = await parent.boundingBox();
      const childBefore = await child.boundingBox();
      const edgeBefore = await edgePath.getAttribute('d');
      const start = {
        x: parentBox!.x + Math.min(parentBox!.width - 20, 80),
        y: parentBox!.y + Math.min(parentBox!.height - 20, 20),
      };

      await page.mouse.move(start.x, start.y);
      await page.mouse.down();
      await page.mouse.move(start.x + 90, start.y + 50, {
        steps: 6,
      });

      const childDuring = await child.boundingBox();
      const edgeDuring = await edgePath.getAttribute('d');

      expect(childDuring!.x - childBefore!.x).toBeGreaterThan(70);
      expect(childDuring!.y - childBefore!.y).toBeGreaterThan(35);
      expect(edgeDuring).not.toEqual(edgeBefore);

      await page.mouse.up();
    });
  });
});
