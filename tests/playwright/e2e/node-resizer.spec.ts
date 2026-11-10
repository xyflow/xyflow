import { expect, test } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.use({ hasTouch: true });

test('touch resizing continues when callbacks change during the gesture', async ({ page, browserName }) => {
  test.skip(FRAMEWORK !== 'react' || browserName !== 'chromium', 'This React test uses Chromium touch input via CDP.');

  await page.goto('/tests/generic/node-resizer/touch-callbacks');

  const handle = page.locator('.react-flow__resize-control.bottom.right');
  await expect(handle).toBeVisible();

  const bounds = await handle.boundingBox();
  if (!bounds) {
    throw new Error('Could not measure the resize handle.');
  }

  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  const width = page.getByTestId('resize-width');
  const client = await page.context().newCDPSession(page);

  try {
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: x + 30, y: y + 30 }],
    });
    // The first resize renders the node again and gives the control new callbacks.
    await expect(width).toHaveText('160');

    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: x + 60, y: y + 60 }],
    });
    await expect(width).toHaveText('190');
  } finally {
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await client.detach();
  }

  await expect(page.getByTestId('finished-widths')).toHaveText('190');
});
