import { expect, test } from '@playwright/test';

import { FRAMEWORK } from './constants';
import { expectToBeWithin } from './utils';

test.describe('NodeResizer', () => {
  test.skip(FRAMEWORK !== 'react', 'React NodeResizer regression test');

  test('moves a child with expandParent to the parent edge when resized to position 0', async ({ page }) => {
    await page.goto('/tests/generic/nodes/resize-expand-parent');

    const parent = page.locator(`.${FRAMEWORK}-flow__node[data-id="parent"]`);
    const child = page.locator(`.${FRAMEWORK}-flow__node[data-id="child"]`);
    const handle = child.locator(`.${FRAMEWORK}-flow__resize-control.handle.top.left`);
    await expect(handle).toBeVisible();

    const parentBox = (await parent.boundingBox())!;
    const childBox = (await child.boundingBox())!;
    expectToBeWithin(childBox.x - parentBox.x, 20);

    const handleBox = (await handle.boundingBox())!;
    const startX = handleBox.x + handleBox.width / 2;
    const startY = handleBox.y + handleBox.height / 2;

    // move the left edge of the child exactly onto the left edge of the parent (x = 0)
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX - 10, startY, { steps: 5 });
    await page.mouse.move(startX - 20, startY, { steps: 5 });
    await page.mouse.up();

    const resizedBox = (await child.boundingBox())!;
    expectToBeWithin(resizedBox.width, childBox.width + 20);
    expectToBeWithin(resizedBox.x - parentBox.x, 0);
    // the right edge stays where it was
    expectToBeWithin(resizedBox.x + resizedBox.width, childBox.x + childBox.width);
  });
});
