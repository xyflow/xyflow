import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('Handles', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('/tests/generic/edges/general');
  });

  test.describe('keyboard accessibility', () => {
    test('handles and pane are focusable', async ({ page }) => {
      const handle = page.locator(`.${FRAMEWORK}-flow__handle.source[data-nodeid="4"]`);
      const pane = page.locator(`.${FRAMEWORK}-flow__pane`);

      await expect(handle).toHaveAttribute('tabindex', '0');
      await expect(handle).toHaveAttribute('role', 'button');
      await expect(pane).toHaveAttribute('tabindex', '0');
    });

    test('connecting two nodes with the keyboard', async ({ page }) => {
      const edges = page.locator(`.${FRAMEWORK}-flow__edge`);
      await expect(edges.first()).toBeAttached();
      const edgeCount = await edges.count();

      const sourceHandle = page.locator(`.${FRAMEWORK}-flow__handle.source[data-nodeid="4"]`);
      const targetHandle = page.locator(`.${FRAMEWORK}-flow__handle.target[data-nodeid="5"]`);

      await sourceHandle.focus();
      await page.keyboard.press('Enter');
      await expect(sourceHandle).toHaveClass(/clickconnecting/);

      await targetHandle.focus();
      await page.keyboard.press('Enter');

      await expect(edges).toHaveCount(edgeCount + 1);
      await expect(sourceHandle).not.toHaveClass(/clickconnecting/);
    });

    test('escape cancels a pending connection', async ({ page }) => {
      const edges = page.locator(`.${FRAMEWORK}-flow__edge`);
      await expect(edges.first()).toBeAttached();
      const edgeCount = await edges.count();

      const sourceHandle = page.locator(`.${FRAMEWORK}-flow__handle.source[data-nodeid="4"]`);

      await sourceHandle.focus();
      await page.keyboard.press('Enter');
      await expect(sourceHandle).toHaveClass(/clickconnecting/);

      await page.keyboard.press('Escape');
      await expect(sourceHandle).not.toHaveClass(/clickconnecting/);

      const targetHandle = page.locator(`.${FRAMEWORK}-flow__handle.target[data-nodeid="5"]`);
      await targetHandle.focus();
      await page.keyboard.press('Enter');

      // the connection was cancelled, so no edge was created
      await expect(edges).toHaveCount(edgeCount);
    });

    test('pressing enter on the pane ends a pending connection on the pane', async ({ page }) => {
      const edges = page.locator(`.${FRAMEWORK}-flow__edge`);
      await expect(edges.first()).toBeAttached();
      const edgeCount = await edges.count();

      const sourceHandle = page.locator(`.${FRAMEWORK}-flow__handle.source[data-nodeid="4"]`);
      const pane = page.locator(`.${FRAMEWORK}-flow__pane`);

      await sourceHandle.focus();
      await page.keyboard.press('Enter');
      await expect(sourceHandle).toHaveClass(/clickconnecting/);

      await pane.focus();
      await page.keyboard.press('Enter');

      // the pending connection ended on the pane without creating an edge
      await expect(sourceHandle).not.toHaveClass(/clickconnecting/);
      await expect(edges).toHaveCount(edgeCount);
    });
  });
});
