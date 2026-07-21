import path from 'node:path';

export type StorybookFramework = 'react' | 'svelte';

function componentFlowAlias(sharedRoot: string, componentDir: string, framework: StorybookFramework) {
  return framework === 'react'
    ? path.join(sharedRoot, 'components', componentDir, 'Flow.tsx')
    : path.join(sharedRoot, 'components', componentDir, 'Flow.svelte');
}

function testFlowAlias(sharedRoot: string, componentDir: string, framework: StorybookFramework) {
  return framework === 'react'
    ? path.join(sharedRoot, 'components', componentDir, 'TestFlow.tsx')
    : path.join(sharedRoot, 'components', componentDir, 'TestFlow.svelte');
}

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
        'storybook-component-addons-test-flow':
          framework === 'react'
            ? path.join(sharedRoot, 'components/AddonsTestFlow/TestFlow.tsx')
            : path.join(sharedRoot, 'components/AddonsTestFlow/TestFlow.svelte'),
        'storybook-component-minimap-flow': componentFlowAlias(sharedRoot, 'MiniMap', framework),
        'storybook-component-controls-flow': componentFlowAlias(sharedRoot, 'Controls', framework),
        'storybook-component-nodetoolbar-flow': componentFlowAlias(sharedRoot, 'NodeToolbar', framework),
        'storybook-component-nodetoolbar-test-flow': testFlowAlias(sharedRoot, 'NodeToolbar', framework),
        'storybook-component-toolbar-node':
          framework === 'react'
            ? path.join(sharedRoot, 'components/NodeToolbar/ToolbarNode.tsx')
            : path.join(sharedRoot, 'components/NodeToolbar/ToolbarNode.svelte'),
        '@xyflow/storybook': framework === 'react' ? '@xyflow/react' : '@xyflow/svelte',
        '@storybook/framework':
          framework === 'react' ? '@storybook/react-vite' : '@storybook/svelte-vite',
      },
    },
  };
}
