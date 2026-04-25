import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('Edge reconnect', () => {
  test.skip(FRAMEWORK !== 'ember', 'The edge reconnect parity sample is currently implemented for EmberFlow.');

  test('reconnects an edge endpoint by dragging its SVG anchor', async ({ page }) => {
    await page.goto('/examples/parity/edges');

    const targetAnchor = page.locator('#source-animated .ember-flow__edgeupdater-target');
    const markerTargetHandle = page.locator('[data-nodeid="marker"][data-handletype="target"]');

    await expect(targetAnchor).toBeAttached();
    await expect(markerTargetHandle).toBeAttached();

    const anchorBox = await targetAnchor.boundingBox();
    const handleBox = await markerTargetHandle.boundingBox();

    await page.mouse.move(anchorBox!.x + anchorBox!.width / 2, anchorBox!.y + anchorBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2, { steps: 8 });
    await page.mouse.up();

    await expect(page.getByLabel('Reconnect log')).toContainText('source-animated: source -> marker');
  });

  test('reconnects when released near a compatible handle', async ({ page }) => {
    await page.goto('/examples/parity/edges');

    const targetAnchor = page.locator('#source-animated .ember-flow__edgeupdater-target');
    const markerTargetHandle = page.locator('[data-nodeid="marker"][data-handletype="target"]');

    await expect(targetAnchor).toBeAttached();
    await expect(markerTargetHandle).toBeAttached();

    const anchorBox = await targetAnchor.boundingBox();
    const handleBox = await markerTargetHandle.boundingBox();

    await page.mouse.move(anchorBox!.x + anchorBox!.width / 2, anchorBox!.y + anchorBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(handleBox!.x + handleBox!.width / 2 + 12, handleBox!.y + handleBox!.height / 2, {
      steps: 8,
    });
    await page.mouse.up();

    await expect(page.getByLabel('Reconnect log')).toContainText('source-animated: source -> marker');
  });

  test('public EdgeReconnectAnchor reconnects an edge endpoint', async ({ page }) => {
    await page.goto('/examples/parity/edges');

    const publicAnchor = page.locator('.parity-public-reconnect-anchor--target');
    const simpleTargetHandle = page.locator('[data-nodeid="simple"][data-handletype="target"]');

    await expect(publicAnchor).toBeAttached();
    await expect(simpleTargetHandle).toBeAttached();

    const anchorBox = await publicAnchor.boundingBox();
    const handleBox = await simpleTargetHandle.boundingBox();

    await page.mouse.move(anchorBox!.x + anchorBox!.width / 2, anchorBox!.y + anchorBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(handleBox!.x + handleBox!.width / 2, handleBox!.y + handleBox!.height / 2, { steps: 8 });
    await page.mouse.up();

    await expect(page.getByLabel('Reconnect log')).toContainText('source-hitbox: source -> simple');
  });
});
