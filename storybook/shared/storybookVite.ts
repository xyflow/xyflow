import path from 'node:path';

export type StorybookFramework = 'react' | 'svelte';

export function sharedStorybookViteConfig(framework: StorybookFramework, sharedRoot: string) {
  const backgroundDir = path.join(sharedRoot, 'components/Background');

  return {
    define: {
      __STORYBOOK_FRAMEWORK__: JSON.stringify(framework),
    },
    resolve: {
      alias: {
        'storybook-component-background-flow':
          framework === 'react'
            ? path.join(backgroundDir, 'Flow.tsx')
            : path.join(backgroundDir, 'Flow.svelte'),
        '@xyflow/storybook': framework === 'react' ? '@xyflow/react' : '@xyflow/svelte',
        '@storybook/framework':
          framework === 'react' ? '@storybook/react-vite' : '@storybook/svelte-vite',
      },
    },
  };
}
