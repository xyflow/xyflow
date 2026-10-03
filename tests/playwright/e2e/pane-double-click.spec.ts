import { test, expect, type Locator } from '@playwright/test';
import { FRAMEWORK } from './constants';

async function getViewportTransform(viewport: Locator) {
  return viewport.evaluate((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return { translateX: matrix.e, translateY: matrix.f, scale: matrix.a };
  });
}

test.describe('Pane double click', () => {
  test.skip(FRAMEWORK !== 'svelte', 'Svelte Flow event API');
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/PaneDoubleClick');
    await expect(page.locator('[data-id="edge"]')).toBeAttached();
  });

  test('reports the native event once without zooming when zoom is disabled', async ({ page }) => {
    const pane = page.locator('.svelte-flow__pane');
    const viewport = page.locator('.svelte-flow__viewport');
    const before = await getViewportTransform(viewport);
    await pane.dblclick({ position: { x: 600, y: 450 } });
    await expect(page.getByTestId('pane-double-clicks')).toHaveText('1');
    await expect(page.getByTestId('pane-last-event')).toHaveText('dblclick:2');
    expect(await getViewportTransform(viewport)).toEqual(before);
  });

  test('retains double-click zoom when the callback is present', async ({ page }) => {
    await page.getByLabel('Double-click zoom').check();
    const viewport = page.locator('.svelte-flow__viewport');
    const before = await getViewportTransform(viewport);
    await page.locator('.svelte-flow__pane').dblclick({ position: { x: 600, y: 450 } });
    await expect(page.getByTestId('pane-double-clicks')).toHaveText('1');
    await expect.poll(async () => (await getViewportTransform(viewport)).scale).toBeGreaterThan(before.scale);
  });

  test('does not report double clicks on nodes, edges or controls', async ({ page }) => {
    await page.locator('[data-id="1"]').dblclick();
    const edge = page.locator('[data-id="edge"] .svelte-flow__edge-interaction');
    const point = await edge.evaluate((element: SVGPathElement) => {
      const point = element.getPointAtLength(element.getTotalLength() / 2);
      const matrix = element.getScreenCTM()!;
      return { x: point.x * matrix.a + matrix.e, y: point.y * matrix.d + matrix.f };
    });
    await page.mouse.dblclick(point.x, point.y);
    await page.getByLabel('Double-click zoom').dblclick();
    await expect(page.getByTestId('pane-double-clicks')).toHaveText('0');
  });

  test('does not report drag selection and accepts a later pane double click', async ({ page }) => {
    await page.getByLabel('Drag selection').check();
    const pane = page.locator('.svelte-flow__pane');
    const bounds = await pane.boundingBox();
    if (!bounds) throw new Error('Pane was not rendered');
    await page.mouse.move(bounds.x + 50, bounds.y + 50);
    await page.mouse.down();
    await page.mouse.move(bounds.x + 450, bounds.y + 400, { steps: 8 });
    await page.mouse.up();
    await expect(page.locator('.svelte-flow__node.selected')).toHaveCount(2);
    await expect(page.getByTestId('pane-double-clicks')).toHaveText('0');
    await pane.dblclick({ position: { x: 600, y: 450 } });
    await expect(page.getByTestId('pane-double-clicks')).toHaveText('1');
  });
});
