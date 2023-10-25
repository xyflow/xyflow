import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('NODES', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('/tests/nodes');
  });

  test.describe('selection', () => {
    test('selecting a node', async ({ page }) => {});
  });
});
