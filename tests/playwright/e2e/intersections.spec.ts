import { expect, test } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('Intersection helpers', () => {
  test.skip(FRAMEWORK !== 'react', 'React useReactFlow regression test');

  test('does not report nodes without a size as intersecting', async ({ page }) => {
    await page.goto('/tests/generic/nodes/intersections');
    await expect(page.locator(`.${FRAMEWORK}-flow__node[data-id="target"]`)).toBeVisible();

    await page.getByRole('button', { name: 'Check intersections', exact: true }).click();

    await expect(page.getByTestId('intersecting-nodes')).toHaveText('overlapping');
    await expect(page.getByTestId('hidden-intersects')).toHaveText('false');
  });
});
