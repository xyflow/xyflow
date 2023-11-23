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
