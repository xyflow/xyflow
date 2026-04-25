import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('EdgeToolbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/generic/edge-toolbar/general');
  });

  test('renders for selected edge', async ({ page }) => {
    test.skip(FRAMEWORK !== 'ember', 'Ember EdgeToolbar parity fixture is in the Ember example app first');

    const toolbar = page.locator(`.${FRAMEWORK}-flow__edge-toolbar[data-id="source-target"]`);

    await expect(toolbar).toBeVisible();
    await expect(toolbar).toContainText('edge toolbar');
  });

  test('tracks connected node drag', async ({ page }) => {
    test.skip(FRAMEWORK !== 'ember', 'Ember EdgeToolbar parity fixture is in the Ember example app first');

    const toolbar = page.locator(`.${FRAMEWORK}-flow__edge-toolbar[data-id="source-target"]`);
    const sourceNode = page.locator(`.${FRAMEWORK}-flow__node[data-id="source"]`);

    await expect(toolbar).toBeVisible();
    const before = await toolbar.evaluate((element) => getComputedStyle(element).transform);
    const sourceBox = await sourceNode.boundingBox();

    await page.mouse.move(sourceBox!.x + sourceBox!.width / 2, sourceBox!.y + sourceBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(sourceBox!.x + sourceBox!.width / 2 + 80, sourceBox!.y + sourceBox!.height / 2 + 40);
    await page.mouse.up();

    await expect(toolbar).toBeVisible();
    const after = await toolbar.evaluate((element) => getComputedStyle(element).transform);

    expect(after).not.toEqual(before);
  });

  test('keeps size and offset stable while zooming', async ({ page }) => {
    test.skip(FRAMEWORK !== 'ember', 'Ember EdgeToolbar parity fixture is in the Ember example app first');

    const pane = page.locator(`.${FRAMEWORK}-flow__pane`);
    const toolbar = page.locator(`.${FRAMEWORK}-flow__edge-toolbar[data-id="source-target"]`);
    const edgeLabel = page
      .locator('[data-id="source-target"]')
      .locator(`.${FRAMEWORK}-flow__edge-textwrapper`);

    await expect(toolbar).toBeVisible();
    await expect(edgeLabel).toBeVisible();

    const toolbarBefore = await toolbar.boundingBox();
    const labelBefore = await edgeLabel.boundingBox();
    const beforeOffset = labelBefore!.y + labelBefore!.height / 2 - (toolbarBefore!.y + toolbarBefore!.height / 2);

    const paneBox = await pane.boundingBox();
    await page.mouse.move(paneBox!.x + paneBox!.width - 20, paneBox!.y + paneBox!.height - 20);
    await page.mouse.wheel(-1200, -1200);

    const toolbarAfter = await toolbar.boundingBox();
    const labelAfter = await edgeLabel.boundingBox();
    const afterOffset = labelAfter!.y + labelAfter!.height / 2 - (toolbarAfter!.y + toolbarAfter!.height / 2);

    expect(Math.abs(toolbarAfter!.width - toolbarBefore!.width)).toBeLessThan(1);
    expect(Math.abs(toolbarAfter!.height - toolbarBefore!.height)).toBeLessThan(1);
    expect(Math.abs(afterOffset - beforeOffset)).toBeLessThan(2);
    expect(Math.abs(afterOffset - 16)).toBeLessThan(2);
  });
});
