import { expect, test } from '@playwright/test';
import { FRAMEWORK } from './constants';

test.describe('Keyboard outline example', () => {
  test.skip(FRAMEWORK !== 'react', 'This is a React application example.');

  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/keyboard-outline');
    await expect(page.locator('.react-flow__node')).toHaveCount(5);
    await expect(page.locator('.react-flow__edge')).toHaveCount(6);
  });

  test('uses native tab order without canvas edges or positive tab indices', async ({ page, browserName }) => {
    const outline = page.getByRole('complementary', { name: 'Workflow outline' });
    await outline.getByRole('button', { name: 'Request received', exact: true }).focus();
    for (const name of ['Design review', 'Revise draft', 'Automated checks', 'Publish', 'Show on canvas']) {
      // macOS WebKit uses Option+Tab to include buttons when keyboard navigation
      // is not enabled in the host's system preferences.
      await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
      await expect(outline.getByRole('button', { name, exact: true })).toBeFocused();
    }
    expect(
      await page
        .locator('.react-flow__node')
        .evaluateAll((nodes) => nodes.every((node) => node.getAttribute('tabindex') === '-1'))
    ).toBe(true);
    expect(
      await page
        .locator('[tabindex]')
        .evaluateAll((elements) => elements.every((element) => Number(element.getAttribute('tabindex')) <= 0))
    ).toBe(true);
  });

  test('selects a step without an unsolicited viewport change', async ({ page }) => {
    const viewport = page.locator('.react-flow__viewport');
    await expect(viewport).not.toHaveCSS('transform', 'none');
    const transform = await viewport.getAttribute('style');
    await page.getByRole('button', { name: 'Design review', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Design review', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(await viewport.getAttribute('style')).toBe(transform);
  });

  test('focuses the real node, preserves arrow movement, and returns with Escape', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const outlineButton = page.getByRole('button', { name: 'Design review', exact: true });
    await outlineButton.click();
    await page.getByRole('button', { name: 'Show on canvas' }).click();
    const node = page.locator('.react-flow__node[data-id="review"]');
    await expect(node).toBeFocused();
    const originalStyle = await node.getAttribute('style');
    await page.keyboard.press('ArrowRight');
    await expect(node).not.toHaveAttribute('style', originalStyle!);
    await page.keyboard.press('Escape');
    await expect(outlineButton).toBeFocused();
  });

  test('follows branches and a return loop without duplicating outline items', async ({ page }) => {
    await page.getByRole('button', { name: 'Design: Design review' }).click();
    await expect(page.getByRole('button', { name: 'Design review', exact: true })).toBeFocused();
    await page.getByRole('button', { name: 'Changes requested: Revise draft' }).click();
    await page.getByRole('button', { name: 'Review again: Design review' }).click();
    await expect(page.getByRole('button', { name: 'Design review', exact: true })).toBeFocused();
    await expect(page.locator('.keyboard-outline__steps > li')).toHaveCount(5);
  });

  test('removes incident edges and restores focus to the next surviving step', async ({ page }) => {
    await page.getByRole('button', { name: 'Design review', exact: true }).click();
    await page.getByRole('button', { name: 'Remove selected step' }).click();
    await expect(page.locator('.react-flow__node[data-id="review"]')).toHaveCount(0);
    await expect(page.locator('.react-flow__edge')).toHaveCount(2);
    await expect(page.getByRole('button', { name: 'Revise draft', exact: true })).toBeFocused();
    await expect(page.getByRole('status')).toHaveText('Step removed. Revise draft is selected.');
  });

  test('offers a focused recovery action when the graph is empty', async ({ page }) => {
    for (let remaining = 4; remaining >= 0; remaining--) {
      await page.getByRole('button', { name: 'Remove selected step' }).click();
      await expect(page.locator('.keyboard-outline__steps > li')).toHaveCount(remaining);
    }
    await expect(page.getByRole('button', { name: 'Reset example' })).toBeFocused();
    await expect(page.getByRole('button', { name: 'Remove selected step' })).toBeDisabled();
    await page.getByRole('button', { name: 'Reset example' }).click();
    await expect(page.locator('.react-flow__node')).toHaveCount(5);
    await expect(page.getByRole('button', { name: 'Request received', exact: true })).toBeFocused();
  });

  test('stacks the outline and canvas without horizontal page overflow on narrow screens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Publish', exact: true }).click();
    await page.getByRole('button', { name: 'Show on canvas' }).click();
    const node = page.locator('.react-flow__node[data-id="publish"]');
    await expect(node).toBeFocused();
    await expect(node).toBeInViewport({ ratio: 1 });
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Publish', exact: true })).toBeFocused();
    await expect(page.getByRole('button', { name: 'Publish', exact: true })).toBeInViewport({ ratio: 1 });
  });
});
