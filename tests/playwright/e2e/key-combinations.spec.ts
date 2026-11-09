import { test, expect } from '@playwright/test';
import { FRAMEWORK } from './constants';

test.describe('Repeated key combinations', () => {
  test.skip(FRAMEWORK !== 'react', 'Tests the React useKeyPress hook');

  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/use-key-press');
    await expect(page.getByTestId('control')).toHaveAttribute('data-ready', 'true');
  });

  for (const [modifier, name] of [
    ['Control', 'control'],
    ['Meta', 'meta'],
  ] as const) {
    test(`preserves ${modifier} between repeated Z presses`, async ({ page }) => {
      const output = page.getByTestId(name);
      await page.keyboard.down(modifier);
      for (let count = 1; count <= 3; count++) {
        await page.keyboard.down('z');
        await expect(output).toHaveAttribute('data-pressed', 'true');
        await expect(output).toHaveText(String(count));
        await page.keyboard.up('z');
        await expect(output).toHaveAttribute('data-pressed', 'false');
      }
      await page.keyboard.up(modifier);
      await expect(output).toHaveAttribute('data-pressed', 'false');
    });
  }

  test('supports repeated combinations using event.code', async ({ page }) => {
    await page.keyboard.down('Control');
    await page.keyboard.press('z');
    await expect(page.getByTestId('code')).toHaveText('1');
    await page.keyboard.press('z');
    await expect(page.getByTestId('code')).toHaveText('2');
    await page.keyboard.up('Control');
  });

  test('preserves the first non-modifier key when the second is released', async ({ page }) => {
    await page.keyboard.down('a');
    await page.keyboard.press('s');
    await expect(page.getByTestId('plain')).toHaveText('1');
    await page.keyboard.press('s');
    await expect(page.getByTestId('plain')).toHaveText('2');
    await page.keyboard.up('a');
  });

  test('clears a missed keyup when Meta is released', async ({ page }) => {
    const output = page.getByTestId('meta');
    await page.evaluate(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta', code: 'MetaLeft', metaKey: true }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ', metaKey: true }));
    });
    await expect(output).toHaveAttribute('data-pressed', 'true');
    await page.evaluate(() => {
      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Meta', code: 'MetaLeft' }));
    });
    await expect(output).toHaveAttribute('data-pressed', 'false');
    await page.keyboard.press('Meta+z');
    await expect(output).toHaveText('2');
  });

  test('resets the combination on blur', async ({ page }) => {
    await page.keyboard.down('Control');
    await page.keyboard.down('z');
    await expect(page.getByTestId('control')).toHaveAttribute('data-pressed', 'true');
    await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    await expect(page.getByTestId('control')).toHaveAttribute('data-pressed', 'false');
    await page.keyboard.up('z');
    await page.keyboard.up('Control');
    await page.keyboard.press('Control+z');
    await expect(page.getByTestId('control')).toHaveText('2');
  });

  test('respects disabled shortcuts inside an input', async ({ page }) => {
    await page.getByRole('textbox').focus();
    await page.keyboard.press('Control+z');
    await expect(page.getByTestId('input')).toHaveText('0');
    await expect(page.getByTestId('control')).toHaveText('1');
  });
});
