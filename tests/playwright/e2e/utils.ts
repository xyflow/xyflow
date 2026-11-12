import { expect } from '@playwright/test';

const MATCH_ALL_NUMBERS = /[\d\.]+/g;

// Type "Locator" not exported...
export async function getTransform(element) {
  const transformString = await element.evaluate((el) => {
    return el.style.transform;
  });

  // Parses all numbers in f.ex "translate(590px, 324px) scale(2)""
  const transforms = transformString.match(MATCH_ALL_NUMBERS);
  return {
    translateX: parseFloat(transforms![0]),
    translateY: parseFloat(transforms![1]),
    scale: parseFloat(transforms![2]),
  };
}

/**
 * Asserts that `actual` is within `tolerance` (inclusive) of `expected`.
 * Useful for pixel positions that can differ slightly due to subpixel rounding.
 */
export function expectToBeWithin(actual: number, expected: number, tolerance = 1) {
  expect(
    Math.abs(actual - expected),
    `expected ${actual} to be within ${tolerance} of ${expected}`
  ).toBeLessThanOrEqual(tolerance);
}
