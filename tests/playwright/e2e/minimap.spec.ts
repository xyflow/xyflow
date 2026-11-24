import { expect, test } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('MiniMap', () => {
  test.skip(FRAMEWORK !== 'react', 'React MiniMap uses the `style` prop for its size');

  test('supports string width and height in the style prop', async ({ page }) => {
    await page.goto('/tests/generic/minimap/style-dimensions');

    const svg = page.locator(`.${FRAMEWORK}-flow__minimap-svg`);
    await expect(page.locator(`.${FRAMEWORK}-flow__minimap-node`)).toHaveCount(2);

    const viewBox = (await svg.getAttribute('viewBox'))!.split(' ').map(Number);
    expect(viewBox).toHaveLength(4);
    viewBox.forEach((value) => expect(value).not.toBeNaN());

    await expect(svg).toHaveAttribute('width', '240');
    await expect(svg).toHaveAttribute('height', '180');
  });
});
