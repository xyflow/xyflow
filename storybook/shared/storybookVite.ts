import path from 'node:path';

export type StorybookFramework = 'react' | 'svelte';

const sharedComponents = ['Background', 'Controls', 'MiniMap', 'NodeToolbar'] as const;

function componentFlowAliases(sharedRoot: string, framework: StorybookFramework) {
  return Object.fromEntries(
    sharedComponents.map((component) => [
      `storybook-component-${component.toLowerCase()}-flow`,
      path.join(sharedRoot, 'components', component, framework === 'react' ? 'Flow.tsx' : 'Flow.svelte'),
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
        ...componentFlowAliases(sharedRoot, framework),
        '@xyflow/storybook': framework === 'react' ? '@xyflow/react' : '@xyflow/svelte',
        '@storybook/framework': framework === 'react' ? '@storybook/react-vite' : '@storybook/svelte-vite',
      },
    },
  };
}
