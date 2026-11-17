import { expect, test, type Page } from '@playwright/test';

import { FRAMEWORK } from './constants';

async function zoomPane(page: Page) {
  const paneBox = await page.locator(`.${FRAMEWORK}-flow__pane`).boundingBox();

  await page.mouse.move(paneBox!.x + paneBox!.width - 20, paneBox!.y + paneBox!.height - 20);
  await page.mouse.wheel(0, 100);
}

async function getCalls(page: Page) {
  return Promise.all(
    ['start', 'change', 'end'].map(async (type) =>
      Number(await page.getByTestId(`viewport-${type}-calls`).textContent())
    )
  );
}

test.describe('useOnViewportChange', () => {
  test.skip(FRAMEWORK !== 'react', 'React hook regression tests');

  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/generic/viewport/change-hooks');
    await expect(page.getByTestId('viewport-change-calls')).toHaveText('0');
  });

  test('calls the handlers while the component is mounted', async ({ page }) => {
    await zoomPane(page);

    await expect(page.getByTestId('viewport-start-calls')).not.toHaveText('0');
    await expect(page.getByTestId('viewport-change-calls')).not.toHaveText('0');
    await expect(page.getByTestId('viewport-end-calls')).not.toHaveText('0');
  });

  test('does not call the handlers after the component unmounts', async ({ page }) => {
    await zoomPane(page);
    await expect(page.getByTestId('viewport-end-calls')).not.toHaveText('0');

    await page.getByRole('button', { name: 'Remove listener', exact: true }).click();
    const callsAfterUnmount = await getCalls(page);

    await zoomPane(page);
    // wait for the zoom to end, it is reported with a delay
    await page.waitForTimeout(500);

    expect(await getCalls(page)).toEqual(callsAfterUnmount);
  });
});
