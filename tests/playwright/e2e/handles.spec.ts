import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('Handles', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/generic/handles/general');
    await page.waitForSelector('[data-id="custom-source"]', { timeout: 5000 });
  });

  test('custom node handles render with ids and positions', async ({ page }) => {
    const source = page
      .locator(`.${FRAMEWORK}-flow__handle`)
      .and(page.locator('[data-nodeid="custom-source"]'))
      .and(page.locator('[data-handleid="out"]'));
    const target = page
      .locator(`.${FRAMEWORK}-flow__handle`)
      .and(page.locator('[data-nodeid="custom-target"]'))
      .and(page.locator('[data-handleid="in"]'));

    await expect(source).toBeInViewport();
    await expect(target).toBeInViewport();
    await expect(source).toHaveClass(/source/);
    await expect(target).toHaveClass(/target/);
    await expect(source).toHaveAttribute('data-handlepos', 'right');
    await expect(target).toHaveAttribute('data-handlepos', 'left');
  });

  test('custom handle ids are preserved when connecting', async ({ page }) => {
    const source = page
      .locator(`.${FRAMEWORK}-flow__handle`)
      .and(page.locator('[data-nodeid="custom-source"]'))
      .and(page.locator('[data-handleid="out"]'));
    const target = page
      .locator(`.${FRAMEWORK}-flow__handle`)
      .and(page.locator('[data-nodeid="custom-target"]'))
      .and(page.locator('[data-handleid="in"]'));

    await expect(page.locator(`.${FRAMEWORK}-flow__edge`)).toHaveCount(0);

    await source.hover();
    await page.mouse.down();
    await target.hover();
    await page.mouse.up();

    await expect(page.locator('[data-id="xy-edge__custom-sourceout-custom-targetin"]')).toBeInViewport();
    await expect(page.locator(`.${FRAMEWORK}-flow__edge`)).toHaveCount(1);
  });

  test('nearby target handles complete connections inside the connection radius', async ({ page }) => {
    const source = page
      .locator(`.${FRAMEWORK}-flow__handle`)
      .and(page.locator('[data-nodeid="custom-source"]'))
      .and(page.locator('[data-handleid="out"]'));
    const target = page
      .locator(`.${FRAMEWORK}-flow__handle`)
      .and(page.locator('[data-nodeid="custom-target"]'))
      .and(page.locator('[data-handleid="in"]'));

    const sourceBox = await source.boundingBox();
    const targetBox = await target.boundingBox();

    await expect(page.locator(`.${FRAMEWORK}-flow__edge`)).toHaveCount(0);

    await page.mouse.move(sourceBox!.x + sourceBox!.width / 2, sourceBox!.y + sourceBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(targetBox!.x + targetBox!.width / 2 + 12, targetBox!.y + targetBox!.height / 2, {
      steps: 8,
    });
    await page.mouse.up();

    await expect(page.locator('[data-id="xy-edge__custom-sourceout-custom-targetin"]')).toBeInViewport();
    await expect(page.locator(`.${FRAMEWORK}-flow__edge`)).toHaveCount(1);
  });

  test('node connectable=false still blocks custom handles', async ({ page }) => {
    const source = page
      .locator(`.${FRAMEWORK}-flow__handle`)
      .and(page.locator('[data-nodeid="custom-source"]'))
      .and(page.locator('[data-handleid="out"]'));
    const disabledTarget = page
      .locator(`.${FRAMEWORK}-flow__handle`)
      .and(page.locator('[data-nodeid="custom-disabled"]'))
      .and(page.locator('[data-handleid="in"]'));

    await source.hover();
    await page.mouse.down();
    await disabledTarget.hover();
    await page.mouse.up();

    await expect(page.locator(`.${FRAMEWORK}-flow__edge`)).toHaveCount(0);
  });

  test('custom handles can reconnect the same generated edge after deletion', async ({ page }) => {
    test.skip(FRAMEWORK !== 'ember', 'The custom handles parity sample is currently implemented for EmberFlow.');

    await page.goto('/examples/parity/custom-handles');

    const source = page
      .locator(`.${FRAMEWORK}-flow__handle`)
      .and(page.locator('[data-nodeid="middle"]'))
      .and(page.locator('[data-handleid="out"]'));
    const target = page
      .locator(`.${FRAMEWORK}-flow__handle`)
      .and(page.locator('[data-nodeid="done"]'))
      .and(page.locator('[data-handleid="in"]'));
    const edge = page.locator('[data-id="xy-edge__middleout-donein"]');

    await source.hover();
    await page.mouse.down();
    await target.hover();
    await page.mouse.up();

    await expect(edge).toBeInViewport();

    await edge.click();
    await page.keyboard.press('Backspace');
    await expect(edge).toHaveCount(0);

    await source.hover();
    await page.mouse.down();
    await target.hover();
    await page.mouse.up();

    await expect(edge).toBeInViewport();
    await expect(page.locator(`.${FRAMEWORK}-flow__edge`).and(edge)).toHaveCount(1);
  });
});
