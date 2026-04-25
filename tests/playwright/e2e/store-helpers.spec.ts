import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';
import { getTransform } from './utils';

test.describe('Store helpers', () => {
  test.skip(FRAMEWORK !== 'ember', 'The store helper parity sample is currently implemented for EmberFlow.');

  test('mutates nodes and edges through the yielded EmberFlowStore', async ({ page }) => {
    await page.goto('/examples/parity/editing');

    const draftNode = page.locator(`.${FRAMEWORK}-flow__node[data-id="draft"]`);

    await expect(draftNode).toContainText('Draft node');
    await expect(page.getByLabel('Store query readout')).toContainText('nodes 4');
    await expect(page.getByLabel('Store query readout')).toContainText('edges 2');
    await expect(page.getByLabel('Store query readout')).toContainText('initialized yes');
    await expect(page.getByLabel('Store query readout')).toContainText('draft internals ready');
    await expect(page.getByLabel('Store query readout')).toContainText('draft links 2');
    await expect(page.getByLabel('Store query readout')).toContainText('draft data Draft node');
    await expect(page.getByLabel('Store query readout')).toContainText('connection idle');
    await expect(page.getByLabel('Store query readout')).toContainText('shift up');
    await expect(page.getByLabel('Store query readout')).toContainText('selected 0');

    await page.keyboard.down('Shift');
    await expect(page.getByLabel('Store query readout')).toContainText('shift down');
    await page.keyboard.up('Shift');
    await expect(page.getByLabel('Store query readout')).toContainText('shift up');

    await draftNode.click();
    await expect(page.getByLabel('Store query readout')).toContainText('selected 1');

    await page.getByRole('button', { name: 'add node' }).click();
    await expect(page.locator('[data-id="api-added"]')).toBeVisible();
    await expect(page.locator(`.${FRAMEWORK}-flow__edge`).and(page.locator('[data-id="review-api-added"]'))).toBeAttached();
    await expect(page.getByLabel('Store helper log')).toContainText('addNodes + addEdges');
    await expect(page.getByLabel('Store query readout')).toContainText('nodes 5');
    await expect(page.getByLabel('Store query readout')).toContainText('edges 3');

    await page.getByRole('button', { name: 'update data' }).click();
    await expect(draftNode).toContainText('Updated draft');
    await expect(page.getByLabel('Store helper log')).toContainText('updateNodeData');
    await expect(page.getByLabel('Store query readout')).toContainText('draft data Updated draft');

    await page.getByRole('button', { name: 'intersections' }).click();
    await expect(page.getByLabel('Store helper log')).toContainText('intersections:');

    await page.getByRole('button', { name: 'store API' }).click();
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

  test('UseEmberFlow yields the nearest store to descendant app UI', async ({ page }) => {
    await page.goto('/examples/parity/custom-controls');

    const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);
    await expect(page.locator('[data-id="custom"]')).toBeAttached();

    await page.getByRole('button', { name: 'zoomTo 2' }).click();
    await expect.poll(async () => (await getTransform(viewport)).scale).toBeGreaterThan(1.8);

    await page.getByRole('button', { name: 'setViewport' }).click();
    await expect.poll(async () => (await getTransform(viewport)).scale).toBeCloseTo(0.72, 2);
  });
});
