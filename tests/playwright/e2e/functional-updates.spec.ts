import { expect, test } from '@playwright/test';
import { FRAMEWORK } from './constants';

test.describe('Svelte functional updates', () => {
  test.skip(FRAMEWORK !== 'svelte', 'Svelte changeset regression tests');

  const cases = [
    {
      action: 'twice',
      nodeCount: 2,
      edgeCount: 4,
      x: 2,
      seen: [0, 1, 0, 1, 0, 1, 2, 3],
      batches: [1, 1],
      keys: ['count', 'old'],
    },
    { action: 'mixed', nodeCount: 6, edgeCount: 6, x: 0, seen: [4, 5, 4, 5], batches: [1, 1], keys: ['count'] },
    { action: 'replace-data', nodeCount: 5, edgeCount: 5, x: 0, seen: [4, 4], batches: [1, 1], keys: ['count'] },
    {
      action: 'replace-element',
      nodeCount: 5,
      edgeCount: 5,
      x: 11,
      seen: [4, 4, 10],
      batches: [1, 1],
      keys: ['count'],
    },
    {
      action: 'add',
      nodeCount: 2,
      edgeCount: 4,
      x: 2,
      seen: [0, 1, 0, 1, 0, 1, 2, 3],
      batches: [1, 1],
      keys: ['count', 'old'],
    },
    { action: 'remove', nodeCount: null, edgeCount: null, x: null, seen: [], batches: [1, 1], keys: [] },
    { action: 'revert', nodeCount: 0, edgeCount: 0, x: 0, seen: [1], batches: [1, 0], keys: ['count', 'old'] },
    { action: 'clear', nodeCount: 0, edgeCount: 0, x: 0, seen: [0, 1, 0, 1], batches: [1, 1], keys: ['count', 'old'] },
    {
      action: 'edit',
      nodeCount: 11,
      edgeCount: 11,
      x: 0,
      seen: [0, 1, 0, 1, 10, 10],
      batches: [2, 2],
      keys: ['count'],
    },
    { action: 'filter', nodeCount: 2, edgeCount: 2, x: 0, seen: [0, 1, 0, 1], batches: [1, 1], keys: ['count', 'old'] },
    { action: 'single', nodeCount: 1, edgeCount: 1, x: 0, seen: [0, 0], batches: [1, 1], keys: ['count', 'old'] },
    { action: 'tick', nodeCount: 2, edgeCount: 2, x: 0, seen: [0, 0, 1, 1], batches: [2, 2], keys: ['count', 'old'] },
    { action: 'missing', nodeCount: 0, edgeCount: 0, x: 0, seen: [], batches: [0, 0], keys: ['count', 'old'] },
  ];

  for (const { action, nodeCount, edgeCount, x, seen, batches, keys } of cases) {
    test(action, async ({ page }) => {
      await page.goto('/examples/functional-updates');
      await page.getByRole('button', { name: action, exact: true }).click();
      await expect(page.getByTestId('update-result')).toHaveText(
        JSON.stringify({
          nodeCount,
          edgeCount,
          x,
          nodeKeys: keys,
          edgeKeys: keys,
          seen,
          batches: { nodes: batches[0], edges: batches[1] },
          bound: [nodeCount, edgeCount],
        })
      );
      await expect(page.getByTestId('live-values')).toHaveText(`${nodeCount ?? 'none'},${edgeCount ?? 'none'}`);
    });
  }
});
