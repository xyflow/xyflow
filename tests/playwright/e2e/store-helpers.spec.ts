import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('Store helpers', () => {
  test.skip(FRAMEWORK !== 'ember', 'The store helper parity sample is currently implemented for EmberFlow.');

  test('mutates nodes and edges through the yielded EmberFlowStore', async ({ page }) => {
    await page.goto('/examples/parity/editing');

    await expect(page.locator('[data-id="draft"]')).toContainText('Draft card');

    await page.getByRole('button', { name: 'add node' }).click();
    await expect(page.locator('[data-id="api-added"]')).toBeVisible();
    await expect(page.locator(`.${FRAMEWORK}-flow__edge`).and(page.locator('[data-id="review-api-added"]'))).toBeAttached();
    await expect(page.getByLabel('Store helper log')).toContainText('addNodes + addEdges');

    await page.getByRole('button', { name: 'update data' }).click();
    await expect(page.locator('[data-id="draft"]')).toContainText('Updated draft');
    await expect(page.getByLabel('Store helper log')).toContainText('updateNodeData');

    await page.getByRole('button', { name: 'intersections' }).click();
    await expect(page.getByLabel('Store helper log')).toContainText('intersections:');

    await page.getByRole('button', { name: 'api surface' }).click();
    await expect(page.locator(`.${FRAMEWORK}-flow__edge`).and(page.locator('[data-id="idea-draft"]'))).toContainText(
      'API edge',
    );
    await expect(page.getByLabel('Store helper log')).toContainText('snapshot');
    await expect(page.getByLabel('Store helper log')).toContainText('node links');
    await expect(page.getByLabel('Store helper log')).toContainText('roundtrip 200,200');

    await page.getByRole('button', { name: 'replace sets' }).click();
    await expect(page.locator('[data-id="review"]')).toContainText('Review updated');
    await expect(page.locator(`.${FRAMEWORK}-flow__edge`).and(page.locator('[data-id="draft-review"]'))).toContainText(
      'setEdges',
    );
    await expect(page.getByLabel('Store helper log')).toContainText('setNodes + setEdges');

    await page.getByRole('button', { name: 'delete added' }).click();
    await expect(page.locator('[data-id="api-added"]')).toBeHidden();
    await expect(page.locator('[data-id="review-api-added"]')).toHaveCount(0);
    await expect(page.getByLabel('Store helper log')).toContainText('deleted 1 node, 1 edge');
  });
});
