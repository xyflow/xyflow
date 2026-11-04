import { expect, test } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('useNodesData', () => {
  test.skip(FRAMEWORK !== 'react', 'React hook regression tests');

  test('skips position and selection renders but updates for changed data', async ({ page }) => {
    await page.goto('/tests/generic/nodes/data-updates');
    await expect(page.getByTestId('node-data')).toHaveText('initial');
    await expect(page.getByTestId('nodes-data')).toHaveText('a:initial,b:');
    await expect(page.locator('.react-flow__node[data-id="a"]')).toHaveCSS('visibility', 'visible');
    const renders = await page.getByTestId('data-renders').textContent();

    await page.getByRole('button', { name: 'Move observed node', exact: true }).click();
    await expect(page.locator('.react-flow__node[data-id="a"]')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 10, 150)');
    await expect(page.getByTestId('data-renders')).toHaveText(renders!);

    await page.getByRole('button', { name: 'Select observed node', exact: true }).click();
    await expect(page.locator('.react-flow__node[data-id="a"]')).toHaveClass(/selected/);
    await expect(page.getByTestId('data-renders')).toHaveText(renders!);
    await page.getByRole('button', { name: 'Update observed data', exact: true }).click();
    await expect(page.getByTestId('node-data')).toHaveText('updated');
    await expect(page.getByTestId('nodes-data')).toHaveText('a:updated,b:');
  });
});
