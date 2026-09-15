import fs from 'node:fs';
import path from 'node:path';

export type StorybookFramework = 'react' | 'svelte';

type AliasEntry = { find: string | RegExp; replacement: string };

const FLOW_FOLDERS = ['components', 'examples'];

/**
 * Every shared folder holding a `Flow.tsx`/`Flow.svelte` pair is importable by its own
 * name, so `import Example from 'A11y'` picks up the flow for the current framework.
 */
function flowAliases(sharedRoot: string, framework: StorybookFramework): AliasEntry[] {
  const flowFile = framework === 'react' ? 'Flow.tsx' : 'Flow.svelte';
  const aliases: AliasEntry[] = [];
  const seen = new Set<string>();

  function visit(folderPath: string) {
    for (const entry of fs.readdirSync(folderPath, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;

      const entryPath = path.join(folderPath, entry.name);
      const flowPath = path.join(entryPath, flowFile);
      if (!fs.existsSync(flowPath)) {
        visit(entryPath);
        continue;
      }

      if (seen.has(entry.name)) {
        throw new Error(`Duplicate shared flow name "${entry.name}" in ${FLOW_FOLDERS.join(' and ')}.`);
      }

      seen.add(entry.name);
      aliases.push({ find: entry.name, replacement: flowPath });
    }
  }

  for (const folder of FLOW_FOLDERS) {
    visit(path.join(sharedRoot, folder));
  }

  return aliases;
}

function toAliasEntries(alias: unknown): AliasEntry[] {
  if (!alias) {
    return [];
  }

  if (Array.isArray(alias)) {
    return alias as AliasEntry[];
  }

  return Object.entries(alias as Record<string, string>).map(([find, replacement]) => ({
    find,
    replacement,
  }));
}

export function sharedStorybookViteConfig(framework: StorybookFramework, sharedRoot: string) {
  return {
    define: {
      __STORYBOOK_FRAMEWORK__: JSON.stringify(framework),
    },
    resolve: {
      alias: [
        ...flowAliases(sharedRoot, framework),
        { find: '@shared', replacement: sharedRoot },
        {
          find: '@xyflow/storybook',
          replacement: framework === 'react' ? '@xyflow/react' : '@xyflow/svelte',
        },
        {
          find: '@storybook/framework',
          replacement: framework === 'react' ? '@storybook/react-vite' : '@storybook/svelte-vite',
        },
      ] satisfies AliasEntry[],
    },
  };
}

export function mergeViteAliases(existing: unknown, shared: AliasEntry[]) {
  return [...toAliasEntries(existing), ...shared];
}
