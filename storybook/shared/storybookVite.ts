import path from 'node:path';

export type StorybookFramework = 'react' | 'svelte';

const sharedComponents = ['Background', 'Controls', 'MiniMap', 'NodeToolbar'] as const;
const sharedExamples = ['A11y'] as const;

function flowAliases(
  sharedRoot: string,
  framework: StorybookFramework,
  kind: 'component' | 'example',
  names: readonly string[]
) {
  const folder = kind === 'component' ? 'components' : 'examples';

  return Object.fromEntries(
    names.map((name) => [
      `storybook-${kind}-${name.toLowerCase()}-flow`,
      path.join(sharedRoot, folder, name, framework === 'react' ? 'Flow.tsx' : 'Flow.svelte'),
    ])
  );
}

export function sharedStorybookViteConfig(framework: StorybookFramework, sharedRoot: string) {
  return {
    define: {
      __STORYBOOK_FRAMEWORK__: JSON.stringify(framework),
    },
    resolve: {
      alias: {
        ...flowAliases(sharedRoot, framework, 'component', sharedComponents),
        ...flowAliases(sharedRoot, framework, 'example', sharedExamples),
        '@xyflow/storybook': framework === 'react' ? '@xyflow/react' : '@xyflow/svelte',
        '@storybook/framework': framework === 'react' ? '@storybook/react-vite' : '@storybook/svelte-vite',
      },
    },
  };
}
