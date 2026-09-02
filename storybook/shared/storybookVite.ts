import fs from 'node:fs';
import path from 'node:path';

export type StorybookFramework = 'react' | 'svelte';

const FLOW_FOLDERS = ['components', 'examples'];

/**
 * Every shared folder holding a `Flow.tsx`/`Flow.svelte` pair is importable by its own
 * name, so `import Example from 'A11y'` picks up the flow for the current framework.
 */
function flowAliases(sharedRoot: string, framework: StorybookFramework) {
  const flowFile = framework === 'react' ? 'Flow.tsx' : 'Flow.svelte';
  const aliases: Record<string, string> = {};

  for (const folder of FLOW_FOLDERS) {
    const folderPath = path.join(sharedRoot, folder);

    for (const entry of fs.readdirSync(folderPath, { withFileTypes: true })) {
      const flowPath = path.join(folderPath, entry.name, flowFile);

      if (!entry.isDirectory() || !fs.existsSync(flowPath)) {
        continue;
      }

      if (aliases[entry.name]) {
        throw new Error(`Duplicate shared flow name "${entry.name}" in ${FLOW_FOLDERS.join(' and ')}.`);
      }

      aliases[entry.name] = flowPath;
    }
  }

  return aliases;
}

export function sharedStorybookViteConfig(framework: StorybookFramework, sharedRoot: string) {
  return {
    define: {
      __STORYBOOK_FRAMEWORK__: JSON.stringify(framework),
    },
    resolve: {
      alias: {
        ...flowAliases(sharedRoot, framework),
        '@xyflow/storybook': framework === 'react' ? '@xyflow/react' : '@xyflow/svelte',
        '@storybook/framework': framework === 'react' ? '@storybook/react-vite' : '@storybook/svelte-vite',
      },
    },
  };
}
