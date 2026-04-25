import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('ViewportPortal', () => {
  test.skip(FRAMEWORK !== 'ember', 'ViewportPortal parity sample is currently implemented in Ember examples');

  test('renders content inside the transformed viewport', async ({ page }) => {
    await page.goto('/examples/parity/viewport-controls');

    const portal = page.getByTestId('viewport-portal-probe');
    const viewport = page.locator(`.${FRAMEWORK}-flow__viewport`);

    await expect(portal).toBeVisible();
    await expect(viewport).toContainText('ViewportPortal');

    const before = await portal.boundingBox();

    await page.getByRole('button', { name: 'setViewport' }).click();
    await page.waitForTimeout(180);

    const afterPan = await portal.boundingBox();
    expect(Math.abs(afterPan!.x - before!.x)).toBeGreaterThan(40);

    await page.getByRole('button', { name: 'zoomTo 2' }).click();
    await page.waitForTimeout(180);

    const afterZoom = await portal.boundingBox();
    expect(afterZoom!.width).toBeGreaterThan(afterPan!.width * 1.5);
  });
});
