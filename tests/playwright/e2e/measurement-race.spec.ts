import { test, expect } from '@playwright/test';
import { FRAMEWORK } from './constants';

test.describe('Controlled node measurement', () => {
  test.skip(FRAMEWORK !== 'react', 'React StoreUpdater measurement ordering');

  for (const explicitDimensions of [false, true]) {
    test(`recovers handle bounds with explicit dimensions=${explicitDimensions}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.addInitScript(() => {
        window.addEventListener('error', () => {
          const root = document.documentElement;
          root.dataset.windowErrors = String(Number(root.dataset.windowErrors ?? 0) + 1);
        });
      });
      await page.goto('/examples/measurement-race');
      await page
        .getByRole('button', {
          name: explicitDimensions ? 'Load nodes with explicit dimensions' : 'Load nodes',
          exact: true,
        })
        .click();

      // Ensure the stale adoption actually happened, then wait for real DOM measurement.
      await expect(page.getByTestId('measurement-races')).toHaveText('1');
      await expect(page.getByTestId('measurement-status')).toHaveText('2 measured, 2 ready');
      await expect(page.locator('.react-flow__edge-path')).toHaveCount(1);
      await expect(page.locator('.react-flow__edge-path')).toBeVisible();

      await page
        .getByRole('button', {
          name: explicitDimensions ? 'Load nodes with explicit dimensions' : 'Load nodes',
          exact: true,
        })
        .click();
      await expect(page.getByTestId('measurement-races')).toHaveText('2');
      await expect(page.getByTestId('measurement-status')).toHaveText('2 measured, 2 ready');
      await expect(page.locator('.react-flow__edge-path')).toBeVisible();

      await page.getByRole('button', { name: 'Reset measurements' }).click();
      await expect(page.getByTestId('measurement-status')).toHaveText('2 measured, 2 ready');
      await expect(page.locator('.react-flow__edge-path')).toBeVisible();

      await page.getByRole('button', { name: 'Toggle hidden' }).click();
      await expect(page.locator('.react-flow__node')).toHaveCount(0);
      await expect(page.locator('.react-flow__edge-path')).toHaveCount(0);
      await page.getByRole('button', { name: 'Toggle hidden' }).click();
      await expect(page.locator('.react-flow__node')).toHaveCount(2);
      await expect(page.getByTestId('measurement-status')).toHaveText('2 measured, 2 ready');
      await expect(page.locator('.react-flow__edge-path')).toBeVisible();
      await page.evaluate(
        () =>
          new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
          })
      );
      expect(await page.locator('html').getAttribute('data-window-errors')).toBeNull();
      expect(errors).toEqual([]);
    });
  }
});
