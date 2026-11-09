import { test, expect } from '@playwright/test';
import { FRAMEWORK } from './constants';

test.describe('Повторные сочетания клавиш', () => {
  test.skip(FRAMEWORK !== 'react', 'Проверяется React-хук useKeyPress');

  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/use-key-press');
    await expect(page.getByTestId('control')).toHaveAttribute('data-ready', 'true');
  });

  for (const [modifier, name] of [
    ['Control', 'control'],
    ['Meta', 'meta'],
  ] as const) {
    test(`сохраняет ${modifier} между повторными нажатиями Z`, async ({ page }) => {
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

  test('поддерживает повторные сочетания с event.code', async ({ page }) => {
    await page.keyboard.down('Control');
    await page.keyboard.press('z');
    await expect(page.getByTestId('code')).toHaveText('1');
    await page.keyboard.press('z');
    await expect(page.getByTestId('code')).toHaveText('2');
    await page.keyboard.up('Control');
  });

  test('сохраняет первую обычную клавишу после отпускания второй', async ({ page }) => {
    await page.keyboard.down('a');
    await page.keyboard.press('s');
    await expect(page.getByTestId('plain')).toHaveText('1');
    await page.keyboard.press('s');
    await expect(page.getByTestId('plain')).toHaveText('2');
    await page.keyboard.up('a');
  });

  test('сбрасывает пропущенный keyup при отпускании Meta', async ({ page }) => {
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

  test('сбрасывает сочетание при потере фокуса', async ({ page }) => {
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

  test('учитывает запрет сочетаний внутри поля ввода', async ({ page }) => {
    await page.getByRole('textbox').focus();
    await page.keyboard.press('Control+z');
    await expect(page.getByTestId('input')).toHaveText('0');
    await expect(page.getByTestId('control')).toHaveText('1');
  });
});
