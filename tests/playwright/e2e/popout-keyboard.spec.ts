import { test, expect, type Page } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('React Flow keyboard events in a portal window', () => {
  test.skip(FRAMEWORK !== 'react', 'The popout example uses React portals.');

  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/popout');
    await expect(page.getByTestId('inline-flow').locator('.react-flow__node')).toHaveCount(3);
  });

  async function openPopup(page: Page) {
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Open popout', exact: true }).click();
    const popup = await popupPromise;
    await expect(popup.locator('.react-flow__node')).toHaveCount(3);
    await expect(popup.locator('.react-flow__node').first()).toBeVisible();
    return popup;
  }

  test('inline deletion and modifier selection still work', async ({ page }) => {
    const flow = page.getByTestId('inline-flow');
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    await flow.locator('.react-flow__node[data-id="1"]').click();
    await page.keyboard.down(modifier);
    await expect(flow.getByTestId('multi-selection-active')).toHaveText('true');
    await flow.locator('.react-flow__node[data-id="2"]').click();
    await page.keyboard.up(modifier);
    await expect(flow.locator('.react-flow__node.selected')).toHaveCount(2);
    await page.keyboard.press('Backspace');
    await expect(flow.locator('.react-flow__node')).toHaveCount(1);
  });

  test('Backspace deletes the selected node in the popout only', async ({ page }) => {
    const popup = await openPopup(page);
    await page.getByTestId('inline-flow').locator('.react-flow__node[data-id="1"]').click();
    await popup.locator('.react-flow__node[data-id="1"]').click();
    await popup.keyboard.press('Backspace');
    await expect(popup.locator('.react-flow__node')).toHaveCount(2);
    await expect(page.getByTestId('inline-flow').locator('.react-flow__node')).toHaveCount(3);
  });

  for (const modifier of ['Control', 'Meta']) {
    test(`${modifier} activates popout multi-selection and releases`, async ({ page }) => {
      const popup = await openPopup(page);
      await popup.locator('.react-flow__node[data-id="1"]').click();
      await popup.keyboard.down(modifier);
      await expect(popup.getByTestId('multi-selection-active')).toHaveText('true');
      // On macOS, Control+click opens a context menu instead of performing a click.
      if (modifier !== 'Control' || process.platform !== 'darwin') {
        await popup.locator('.react-flow__node[data-id="2"]').click();
        await expect(popup.locator('.react-flow__node.selected')).toHaveCount(2);
      }
      await popup.keyboard.up(modifier);
      await expect(popup.getByTestId('multi-selection-active')).toHaveText('false');
      await popup.locator('.react-flow__node[data-id="3"]').click();
      await expect(popup.locator('.react-flow__node.selected')).toHaveCount(1);
    });
  }

  test('editing inputs and contenteditable does not delete selected nodes', async ({ page }) => {
    const popup = await openPopup(page);
    for (const label of ['Node name', 'Node notes']) {
      await popup.locator('.react-flow__node[data-id="1"]').click();
      const input = popup.getByRole('textbox', { name: label });
      await input.fill('Keep');
      await input.press('End');
      await input.press('Backspace');
      await expect(popup.locator('.react-flow__node')).toHaveCount(3);
      await input.press('Control+Backspace');
      await expect(popup.locator('.react-flow__node')).toHaveCount(3);
    }
  });

  test('selection and pan activation keys belong to the popout', async ({ page }) => {
    const popup = await openPopup(page);
    await popup.getByTestId('other-target').focus();
    const pane = popup.locator('.react-flow__pane');
    await popup.keyboard.down('Shift');
    await expect(pane).toHaveClass(/selection/);
    await popup.keyboard.up('Shift');
    await expect(pane).not.toHaveClass(/selection/);
    await popup.keyboard.down('Space');
    await expect(pane).toHaveClass(/draggable/);
    await popup.keyboard.up('Space');
    await expect(pane).not.toHaveClass(/draggable/);
  });

  test('the zoom activation key enables wheel zoom in the popout', async ({ page }) => {
    const popup = await openPopup(page);
    const viewport = popup.locator('.react-flow__viewport');
    const before = await viewport.getAttribute('style');
    await popup.getByTestId('other-target').focus();
    await popup.mouse.move(700, 450);
    await popup.keyboard.down('z');
    await popup.mouse.wheel(0, -200);
    await expect(viewport).not.toHaveAttribute('style', before!);
    await popup.keyboard.up('z');
  });

  test('a custom popup target resets on its own window blur event', async ({ page }) => {
    const popup = await openPopup(page);
    await popup.getByTestId('other-target').focus();
    await popup.keyboard.down('x');
    await expect(popup.getByTestId('key-pressed')).toHaveText('true');
    // Headless browsers can emulate focus in both windows, so send blur explicitly.
    await popup.evaluate(() => window.dispatchEvent(new Event('blur')));
    await expect(popup.getByTestId('key-pressed')).toHaveText('false');
    await popup.keyboard.up('x');
  });

  test('a custom document target resets on keyup and the popout context menu', async ({ page }) => {
    const popup = await openPopup(page);
    await popup.getByTestId('other-target').focus();
    await popup.keyboard.down('x');
    await expect(popup.getByTestId('key-pressed')).toHaveText('true');
    await popup.keyboard.up('x');
    await expect(popup.getByTestId('key-pressed')).toHaveText('false');
    await popup.keyboard.down('x');
    await expect(popup.getByTestId('key-pressed')).toHaveText('true');
    await popup.getByTestId('other-target').click({ button: 'right' });
    await expect(popup.getByTestId('key-pressed')).toHaveText('false');
    await popup.keyboard.up('x');
  });

  test('changing a hook target detaches the previous target and resets pressed keys', async ({ page }) => {
    const popup = await openPopup(page);
    await popup.getByTestId('other-target').focus();
    await popup.keyboard.down('x');
    await expect(popup.getByTestId('key-pressed')).toHaveText('true');
    await popup.getByRole('button', { name: 'Toggle key target' }).click();
    await expect(popup.getByTestId('key-pressed')).toHaveText('false');
    await popup.keyboard.up('x');
    await popup.getByTestId('other-target').focus();
    await popup.keyboard.down('x');
    await expect(popup.getByTestId('key-pressed')).toHaveText('false');
    await popup.keyboard.up('x');
    await popup.getByTestId('key-target').focus();
    await popup.keyboard.down('x');
    await expect(popup.getByTestId('key-pressed')).toHaveText('true');
    await popup.keyboard.up('x');
    await expect(popup.getByTestId('key-pressed')).toHaveText('false');
  });

  test('unmounting a hook removes its keyboard listener', async ({ page }) => {
    const popup = await openPopup(page);
    await popup.getByRole('button', { name: 'Toggle key probe' }).click();
    await expect(popup.getByTestId('key-pressed')).toHaveCount(0);
    await popup.evaluate(() => {
      document.addEventListener('keydown', (event) => {
        queueMicrotask(() => document.body.setAttribute('data-key-prevented', String(event.defaultPrevented)));
      });
    });
    await popup.getByTestId('other-target').focus();
    await popup.keyboard.press('x');
    await expect(popup.locator('body')).toHaveAttribute('data-key-prevented', 'false');
  });
});
