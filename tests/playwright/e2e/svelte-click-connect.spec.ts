import { test, expect, type Page } from '@playwright/test';

import { FRAMEWORK } from './constants';

async function openFixture(page: Page, route = 'click-connect') {
  const events: string[] = [];
  page.on('console', (message) => events.push(message.text()));
  await page.goto(`/tests/generic/pane/${route}`);
  return events;
}

test.describe('Svelte click connections', () => {
  test.skip(FRAMEWORK !== 'svelte', 'Uses the Svelte Flow click-connection fixtures.');

  for (const route of ['click-connect', 'click-connect-selection']) {
    test(`pane click cancels a pending connection (${route})`, async ({ page }) => {
      const events = await openFixture(page, route);
      const source = page.locator('[data-id="1"] .source');
      const target = page.locator('[data-id="2"] .target');
      const pane = page.locator('.svelte-flow__pane');

      await source.click();
      await expect.poll(() => events.filter((event) => event === 'click-connect-start').length).toBe(1);
      await pane.click({ position: { x: 20, y: 20 } });

      await expect.poll(() => events.filter((event) => event.startsWith('click-connect-end')).length).toBe(1);
      await expect.poll(() => events.filter((event) => event === 'pane-click').length).toBe(1);
      const endState = JSON.parse(
        events.find((event) => event.startsWith('click-connect-end'))!.slice('click-connect-end '.length)
      );
      expect(endState).toMatchObject({ isValid: null, toNode: null, toHandle: null, toPosition: null });
      expect(endState).not.toHaveProperty('inProgress');

      // The next handle click starts a new connection instead of completing the cancelled one.
      await target.click();
      await expect(page.locator('.svelte-flow__edge')).toHaveCount(0);
      await expect.poll(() => events.filter((event) => event === 'click-connect-start').length).toBe(2);
    });
  }

  test('panning does not cancel a pending click connection', async ({ page }) => {
    const events = await openFixture(page);
    const source = page.locator('[data-id="1"] .source');
    const pane = page.locator('.svelte-flow__pane');

    await source.click();
    await expect.poll(() => events.filter((event) => event === 'click-connect-start').length).toBe(1);
    const bounds = (await pane.boundingBox())!;
    const viewport = page.locator('.svelte-flow__viewport');
    const before = await viewport.getAttribute('style');
    await page.mouse.move(bounds.x + 20, bounds.y + 20);
    await page.mouse.down();
    await page.mouse.move(bounds.x + 100, bounds.y + 100, { steps: 4 });
    await page.mouse.up();
    await expect(viewport).not.toHaveAttribute('style', before!);

    await page.locator('[data-id="2"] .target').click();
    await expect(page.locator('.svelte-flow__edge')).toHaveCount(1);
    await expect.poll(() => events.filter((event) => event === 'pane-click').length).toBe(0);
  });

  test('clicking another handle still completes a connection', async ({ page }) => {
    const events = await openFixture(page);
    await page.locator('[data-id="1"] .source').click();
    await expect.poll(() => events.filter((event) => event === 'click-connect-start').length).toBe(1);
    await page.locator('[data-id="2"] .target').click();

    await expect(page.locator('.svelte-flow__edge')).toHaveCount(1);
    await expect.poll(() => events.filter((event) => event.startsWith('click-connect-end')).length).toBe(1);
  });

  test('dragging a selection does not cancel a pending click connection', async ({ page }) => {
    const events = await openFixture(page, 'click-connect-selection');
    await page.locator('[data-id="1"] .source').click();
    await expect.poll(() => events.filter((event) => event === 'click-connect-start').length).toBe(1);
    const pane = page.locator('.svelte-flow__pane');
    const bounds = (await pane.boundingBox())!;
    await page.mouse.move(bounds.x + 20, bounds.y + 20);
    await page.mouse.down();
    await page.mouse.move(bounds.x + 100, bounds.y + 100, { steps: 4 });
    await expect(page.locator('.svelte-flow__selection')).toBeVisible();
    await page.mouse.up();
    await expect(page.locator('.svelte-flow__selection')).toHaveCount(0);

    await page.locator('[data-id="2"] .target').click();
    await expect(page.locator('.svelte-flow__edge')).toHaveCount(1);
    await expect.poll(() => events.filter((event) => event === 'pane-click').length).toBe(0);
    await expect.poll(() => events.filter((event) => event.startsWith('click-connect-end')).length).toBe(1);
  });

  test('clicking a node does not cancel a pending click connection', async ({ page }) => {
    const events = await openFixture(page);
    await page.locator('[data-id="1"] .source').click();
    await expect.poll(() => events.filter((event) => event === 'click-connect-start').length).toBe(1);
    await page.locator('.svelte-flow__node[data-id="2"]').click();
    await page.locator('[data-id="2"] .target').click();

    await expect(page.locator('.svelte-flow__edge')).toHaveCount(1);
    await expect.poll(() => events.filter((event) => event === 'click-connect-start').length).toBe(1);
  });

  test('dropping a dragged connection on the pane does not fire pane click', async ({ page }) => {
    const events = await openFixture(page);
    const source = page.locator('[data-id="1"] .source');
    await source.hover();
    await page.mouse.down();
    await page.mouse.move(100, 100, { steps: 4 });
    await expect(page.locator('.svelte-flow__connection')).toBeAttached();
    await page.mouse.up();
    await expect(page.locator('.svelte-flow__connection')).toHaveCount(0);

    // A subsequent click provides an observable boundary for the preceding drop's callbacks.
    await page.locator('.svelte-flow__pane').click({ position: { x: 20, y: 20 } });
    await expect.poll(() => events.filter((event) => event === 'pane-click').length).toBe(1);
    expect(events.filter((event) => event.startsWith('click-connect-end'))).toHaveLength(0);
    expect(events.filter((event) => event === 'click-connect-start')).toHaveLength(0);
  });
});
