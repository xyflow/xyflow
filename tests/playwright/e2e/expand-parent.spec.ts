import { test, expect, type Page } from '@playwright/test';
import { FRAMEWORK } from './constants';

type Bounds = { x: number; y: number; width: number; height: number };

async function bounds(page: Page, id: string): Promise<Bounds> {
  const result = await page.locator(`.react-flow__node[data-id="${id}"]`).boundingBox();
  expect(result).not.toBeNull();
  return result!;
}

function expectEnclosure(parent: Bounds, child: Bounds) {
  expect(parent.x).toBeLessThanOrEqual(child.x + 1);
  expect(parent.y).toBeLessThanOrEqual(child.y + 1);
  expect(parent.x + parent.width).toBeGreaterThanOrEqual(child.x + child.width - 1);
  expect(parent.y + parent.height).toBeGreaterThanOrEqual(child.y + child.height - 1);
}

test.describe('Nested parent expansion', () => {
  test.skip(FRAMEWORK !== 'react', 'React drag snapshots and expandParent');
  test.use({ viewport: { width: 1400, height: 1100 } });

  for (const direction of [1, -1]) {
    test(`keeps nested origins and siblings stable during ${direction > 0 ? 'southeast' : 'northwest'} expansion`, async ({
      page,
    }) => {
      await page.goto('/tests/generic/nodes/expand-parent');
      await expect(page.locator('.react-flow__node[data-id="child"]')).toBeVisible();
      const sibling = await bounds(page, 'sibling');
      const initial = await bounds(page, 'child');
      const x = initial.x + initial.width / 2;
      const y = initial.y + initial.height / 2;
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x + 20 * direction, y + 20 * direction, { steps: 5 });
      const started = await bounds(page, 'child');
      await page.mouse.move(x + 220 * direction, y + 220 * direction, { steps: 20 });
      const dragged = await bounds(page, 'child');
      expect(dragged.x - started.x).toBeCloseTo(200 * direction, 0);
      expect(dragged.y - started.y).toBeCloseTo(200 * direction, 0);
      await page.mouse.up();
      await expect.poll(() => bounds(page, 'child')).toEqual(dragged);
      const parent = await bounds(page, 'parent');
      const outer = await bounds(page, 'outer');
      expectEnclosure(parent, dragged);
      expectEnclosure(outer, parent);
      expect(await bounds(page, 'sibling')).toEqual(sibling);

      // A subsequent reverse gesture uses the position saved on release.
      await page.mouse.move(dragged.x + dragged.width / 2, dragged.y + dragged.height / 2);
      await page.mouse.down();
      await page.mouse.move(
        dragged.x + dragged.width / 2 - 80 * direction,
        dragged.y + dragged.height / 2 - 80 * direction,
        { steps: 10 }
      );
      await page.mouse.up();
      expect(direction * ((await bounds(page, 'child')).x - dragged.x)).toBeLessThan(-60);
      expect(await bounds(page, 'parent')).toEqual(parent);
      expect(await bounds(page, 'outer')).toEqual(outer);
      expect(await bounds(page, 'sibling')).toEqual(sibling);
    });
  }
});
