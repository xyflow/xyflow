import { test, expect } from '@playwright/test';

test.describe('Background', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/backgrounds');
  });

  test('centers the dot pattern with default gap and no offset (zoom 1, pan 0,0)', async ({ page }) => {
    // flow-a renders <Background variant={BackgroundVariant.Dots} /> with defaults:
    // gap=20, offset=0. At zoom 1 the pattern should be centered by exactly half
    // the gap, i.e. translate(-10,-10), not translate(-11,-11).
    const pattern = page.locator('#pattern-flow-a0');

    await expect(pattern).toHaveAttribute('patternTransform', 'translate(-10,-10)');
  });

  test('applies both the offset and the half-cell centering for a non-zero offset', async ({ page }) => {
    // flow-d's second background renders <Background variant={BackgroundVariant.Lines} gap={100} offset={2} />
    // at zoom 1, so the expected translation is offset + half the gap: 2 + 50 = 52.
    const pattern = page.locator('#pattern-flow-d1');

    await expect(pattern).toHaveAttribute('patternTransform', 'translate(-52,-52)');
  });
});
