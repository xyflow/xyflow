import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('EdgeLabelRenderer', () => {
  test.skip(FRAMEWORK !== 'ember', 'EdgeLabelRenderer parity sample is currently implemented in Ember examples');

  test('renders portal content in the viewport', async ({ page }) => {
    await page.goto('/examples/parity/edges');

    const label = page.getByTestId('edge-label-renderer-probe');
    const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);

    await expect(label).toBeVisible();
    await expect(viewport).toContainText('EdgeLabelRenderer');
  });
});
