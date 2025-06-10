const MATCH_ALL_NUMBERS = /[\d\.]+/g;

// Type "Locator" not exported...
export async function getTransform(element) {
  const transformString = await element.evaluate((el) => {
    return window.getComputedStyle(el).transform || '';
  });

  // Parses all numbers in "matrix(3.32571, 0, 0, 3.32571, 390.571, 133.851)"
  const transforms = transformString.match(MATCH_ALL_NUMBERS);
  return {
    translateX: parseFloat(transforms![4]),
    translateY: parseFloat(transforms![5]),
    scale: parseFloat(transforms![0]),
  };
}
