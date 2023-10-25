import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test('Delete Node with backspace', async ({ page }) => {
  await page.goto('/');
  await page.locator(`.${FRAMEWORK}-flow__node`).nth(0).click();
  // await page.getByTestId('rf__node-1').click();
  await page.keyboard.press('Backspace');

  const nodes = await page.locator(`.${FRAMEWORK}-flow__node`).all();
  expect(nodes).toHaveLength(3);

  const edges = await page.locator(`.${FRAMEWORK}-flow__edge`).all();
  expect(edges).toHaveLength(0);
});
