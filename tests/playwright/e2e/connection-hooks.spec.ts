import { expect, test } from '@playwright/test';

import { FRAMEWORK } from './constants';

test.describe('React hooks', () => {
  test.skip(FRAMEWORK !== 'react', 'React hook regression tests');

  test('reports added and removed connections, including the last connection', async ({ page }) => {
    await page.goto('/tests/generic/nodes/connection-updates');
    await expect(page.getByTestId('connections')).toHaveText('ab');
    await page.getByRole('button', { name: 'Add connection', exact: true }).click();
    await expect(page.getByTestId('connections')).toHaveText('ab,ac');
    await expect(page.getByTestId('connection-events')).toHaveText('connect:ac');
    await page.getByRole('button', { name: 'Remove connection', exact: true }).click();
    await expect(page.getByTestId('connections')).toHaveText('ac');
    await expect(page.getByTestId('connection-events')).toHaveText('connect:ac,disconnect:ab');
    await page.getByRole('button', { name: 'Remove all connections', exact: true }).click();
    await expect(page.getByTestId('connections')).toBeEmpty();
    await expect(page.getByTestId('connection-events')).toHaveText('connect:ac,disconnect:ab,disconnect:ac');
  });
});
