import { test, expect } from '@playwright/test';
import { FRAMEWORK } from './constants';

test.describe('Viewport resize delivery', () => {
  test.skip(FRAMEWORK !== 'react', 'React viewport external-store publication');

  test('resizes a sibling layout consumer without a ResizeObserver loop', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript(() => {
      window.addEventListener('error', (event) => {
        const errors: string[] = JSON.parse(document.documentElement.dataset.windowErrors ?? '[]');
        document.documentElement.dataset.windowErrors = JSON.stringify([...errors, event.message]);
      });
    });
    await page.goto('/examples/viewport-resize');
    await expect(page.getByTestId('viewport-size')).toHaveText('800x400');

    for (let resize = 0; resize < 6; resize++) {
      await page.getByRole('button', { name: 'Resize flow', exact: true }).click();
      await expect(page.getByTestId('viewport-size')).toHaveText(resize % 2 === 0 ? '600x400' : '800x400');
    }
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        })
    );
    expect(await page.locator('html').getAttribute('data-window-errors')).toBeNull();
    expect(errors).toEqual([]);
  });

  test('does not publish unchanged viewport dimensions', async ({ page }) => {
    await page.goto('/examples/viewport-resize');
    await expect(page.getByTestId('viewport-size')).toHaveText('800x400');
    const before = await page.getByTestId('resize-publications').textContent();
    await page.evaluate(() => {
      for (let resize = 0; resize < 10; resize++) window.dispatchEvent(new Event('resize'));
    });
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        })
    );
    await expect(page.getByTestId('resize-publications')).toHaveText(before!);
  });
});
