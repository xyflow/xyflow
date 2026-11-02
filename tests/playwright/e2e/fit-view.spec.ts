import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('fitView', () => {
  test('initial fitView includes all nodes when useUpdateNodeInternals runs on mount inside ReactFlowProvider', async ({
    page,
  }) => {
    test.skip(FRAMEWORK !== 'react', 'useUpdateNodeInternals is React only');

    await page.goto('/tests/generic/fit-view/update-node-internals');

    await expect(page.locator('[data-id="far"]')).toBeInViewport({ ratio: 1 });
    await expect(page.locator('[data-id="update-internals"]')).toBeInViewport({ ratio: 1 });
  });
});
