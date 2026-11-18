import { test, expect } from '@playwright/test';

import { FRAMEWORK } from './constants';

const expectedResults = {
  rootObject: true,
  rootId: true,
  explicitTargets: ['root'],
  implicitTargets: ['root'],
  ownOrigin: false,
  child: true,
};

test.describe('intersection helpers with a non-default node origin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/generic/nodes/intersection-origin');
    await expect(page.locator(`.${FRAMEWORK}-flow__node[data-id="child"]`)).toHaveCSS('visibility', 'visible');
    await page.getByTestId('check-intersections').click();
  });

  for (const [name, expected] of Object.entries(expectedResults)) {
    test(name, async ({ page }) => {
      const result = JSON.parse((await page.getByTestId('intersection-result').textContent())!);
      expect(result[name]).toEqual(expected);
    });
  }
});
