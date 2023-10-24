import { test, expect } from '@playwright/test';

test('Move Node', async ({ page }) => {
  await page.goto('/');

  const locator = page.getByTestId('rf__node-1');

  const transformBeforeMove = await locator.evaluate((element) => {
    return element.style.transform;
  });

  await locator.hover();
  await page.mouse.down();
  await page.mouse.move(500, 500);
  await page.mouse.up();

  const transformAfterMove = await locator.evaluate((element) => {
    return element.style.transform;
  });

  expect(transformBeforeMove).not.toMatch(transformAfterMove);
});
