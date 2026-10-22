import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('Click connections', () => {
  test.skip(FRAMEWORK !== 'react', 'Click connections are only supported by React Flow.');

  for (const route of ['click-connect', 'click-connect-selection']) {
    test(`pane click cancels a pending connection (${route})`, async ({ page }) => {
      const events: string[] = [];
      page.on('console', (message) => events.push(message.text()));
      await page.goto(`/tests/generic/pane/${route}`);

      const source = page.locator('[data-id="1"] .source');
      const target = page.locator('[data-id="2"] .target');
      const pane = page.locator('.react-flow__pane');

      await source.click();
      await expect(source).toHaveClass(/clickconnecting/);
      await pane.click({ position: { x: 20, y: 20 } });

      await expect(source).not.toHaveClass(/clickconnecting/);
      await expect.poll(() => events.filter((event) => event.startsWith('click-connect-end')).length).toBe(1);
      await expect.poll(() => events.filter((event) => event === 'pane-click').length).toBe(1);
      const endState = JSON.parse(events.find((event) => event.startsWith('click-connect-end'))!.slice(18));
      expect(endState).toMatchObject({ isValid: null, toNode: null, toHandle: null, toPosition: null });
      expect(endState).not.toHaveProperty('inProgress');

      // The next handle click starts a new connection rather than completing the cancelled one.
      await target.click();
      await expect(target).toHaveClass(/clickconnecting/);
      await expect(page.locator('.react-flow__edge')).toHaveCount(0);
      await expect.poll(() => events.filter((event) => event === 'click-connect-start').length).toBe(2);
    });
  }

  test('panning does not cancel a pending click connection', async ({ page }) => {
    await page.goto('/tests/generic/pane/click-connect');
    const source = page.locator('[data-id="1"] .source');
    const pane = page.locator('.react-flow__pane');

    await source.click();
    await expect(source).toHaveClass(/clickconnecting/);
    const bounds = (await pane.boundingBox())!;
    await page.mouse.move(bounds.x + 20, bounds.y + 20);
    await page.mouse.down();
    await page.mouse.move(bounds.x + 100, bounds.y + 100, { steps: 4 });
    await page.mouse.up();

    await expect(source).toHaveClass(/clickconnecting/);
  });

  test('clicking another handle still completes a connection', async ({ page }) => {
    await page.goto('/tests/generic/pane/click-connect');
    const source = page.locator('[data-id="1"] .source');
    await source.click();
    await expect(source).toHaveClass(/clickconnecting/);
    await page.locator('[data-id="2"] .target').click();

    await expect(source).not.toHaveClass(/clickconnecting/);
    await expect(page.locator('.react-flow__edge')).toHaveCount(1);
  });

  test('dragging a selection does not cancel a pending click connection', async ({ page }) => {
    const events: string[] = [];
    page.on('console', (message) => events.push(message.text()));
    await page.goto('/tests/generic/pane/click-connect-selection');
    const source = page.locator('[data-id="1"] .source');
    await source.click();
    await expect(source).toHaveClass(/clickconnecting/);
    const pane = page.locator('.react-flow__pane');
    const bounds = (await pane.boundingBox())!;
    await page.mouse.move(bounds.x + 20, bounds.y + 20);
    await page.mouse.down();
    await page.mouse.move(bounds.x + 100, bounds.y + 100, { steps: 4 });
    await expect(page.locator('.react-flow__selection')).toBeVisible();
    await page.mouse.up();

    await expect(page.locator('.react-flow__selection')).toHaveCount(0);
    await expect(source).toHaveClass(/clickconnecting/);
    // A subsequent click provides an observable boundary for the preceding drag's callbacks.
    await pane.click({ position: { x: 20, y: 20 } });
    await expect.poll(() => events.filter((event) => event === 'pane-click').length).toBe(1);
    await expect.poll(() => events.filter((event) => event.startsWith('click-connect-end')).length).toBe(1);
  });

  test('clicking a node does not cancel a pending click connection', async ({ page }) => {
    await page.goto('/tests/generic/pane/click-connect');
    const source = page.locator('[data-id="1"] .source');
    await source.click();
    await expect(source).toHaveClass(/clickconnecting/);
    await page.locator('.react-flow__node[data-id="2"]').click();

    await expect(source).toHaveClass(/clickconnecting/);
  });

  test('dropping a dragged connection on the pane does not fire pane click', async ({ page }) => {
    const events: string[] = [];
    page.on('console', (message) => events.push(message.text()));
    await page.goto('/tests/generic/pane/click-connect');
    const source = page.locator('[data-id="1"] .source');
    await source.hover();
    await page.mouse.down();
    await page.mouse.move(100, 100, { steps: 4 });
    await expect(page.locator('.react-flow__connection')).toBeAttached();
    await page.mouse.up();

    await expect(page.locator('.react-flow__connection')).toHaveCount(0);
    await expect(source).not.toHaveClass(/clickconnecting/);
    // Ensure all earlier callbacks have been observed before checking that the drop was suppressed.
    await page.locator('.react-flow__pane').click({ position: { x: 20, y: 20 } });
    await expect.poll(() => events.filter((event) => event === 'pane-click').length).toBe(1);
    expect(events.filter((event) => event.startsWith('click-connect-end'))).toHaveLength(0);
  });
});
