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

// Get framework-specific CSS selectors
export function getNodeSelector(framework: string): string {
  switch (framework) {
    case 'angular':
      return '.xy-node';
    case 'react':
      return '.react-flow__node';
    case 'svelte':
      return '.svelte-flow__node';
    default:
      return `.${framework}-flow__node`;
  }
}

export function getEdgeSelector(framework: string): string {
  switch (framework) {
    case 'angular':
      return '.xy-edge';
    case 'react':
      return '.react-flow__edge';
    case 'svelte':
      return '.svelte-flow__edge';
    default:
      return `.${framework}-flow__edge`;
  }
}

export function getSelectionSelector(framework: string): string {
  switch (framework) {
    case 'angular':
      return '.xy-selection';
    case 'react':
      return '.react-flow__selection';
    case 'svelte':
      return '.svelte-flow__selection';
    default:
      return `.${framework}-flow__selection`;
  }
}

export function getNodesSelectionSelector(framework: string): string {
  switch (framework) {
    case 'angular':
      return '.xy-nodesselection';
    case 'react':
      return '.react-flow__nodesselection';
    case 'svelte':
      return '.svelte-flow__selection';
    default:
      return `.${framework}-flow__nodesselection`;
  }
}
