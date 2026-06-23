import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';
import { getTransform } from './utils';

test.describe('fitView on init', () => {
  // Regression for the init-fit race: a hidden flow with synchronously-initialized nodes must fit
  // once shown. Before the fix the init fit ran against zero dimensions and was never re-attempted.
  // React-only: Svelte defers its init fit through a microtask, so the race does not exist there.
  test('fits when a hidden flow with synchronously-initialized nodes is shown', async ({ page }) => {
    test.skip(FRAMEWORK !== 'react', 'fitView-on-init race is React-only');

    await page.goto('/examples/fit-view-hidden');

    await page.getByTestId('show').click();

    const viewport = page.locator('.react-flow__viewport');
    await expect(viewport).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.react-flow__node')).toHaveCount(2);

    // let the fit triggered by showing the container settle
    await page.waitForTimeout(400);
    const shownZoom = (await getTransform(viewport)).scale;

    // a manual fitView is the correct reference, it works regardless of the fix
    await page.locator('.react-flow__controls-fitview').click();
    await page.waitForTimeout(400);
    const refitZoom = (await getTransform(viewport)).scale;

    // the fit on show must match the manual fit and be the real fitted zoom, not the clamped minZoom
    expect(shownZoom).toBeGreaterThan(0.12);
    expect(shownZoom).toBeLessThan(1);
    expect(Math.abs(shownZoom - refitZoom)).toBeLessThan(0.02);
  });
});
