import { test, expect } from '@playwright/test';

const framework = process.env.FRAMEWORK;

test('Delete Node with backspace', async ({ page }) => {
  await page.goto('/');
  await page.locator(`.${framework}-flow__node`).nth(0).click();
  // await page.getByTestId('rf__node-1').click();
  await page.keyboard.press('Backspace');

  const nodes = await page.locator(`.${framework}-flow__node`).all();
  expect(nodes).toHaveLength(3);

  const edges = await page.locator(`.${framework}-flow__edge`).all();
  expect(edges).toHaveLength(0);
});
