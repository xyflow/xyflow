import fs from 'node:fs';
import path from 'node:path';
import type { UserConfig } from 'vite';

export type StorybookFramework = 'react' | 'svelte' | 'vue';

type AliasEntry = { find: string | RegExp; replacement: string };

const FLOW_FOLDERS = ['components', 'examples'];

/**
 * Every shared folder holding a framework-specific `Flow` component is importable by its own
 * name, so `import Example from 'A11y'` picks up the flow for the current framework.
 */
function flowAliases(sharedRoot: string, framework: StorybookFramework): AliasEntry[] {
  const flowFile = { react: 'Flow.tsx', svelte: 'Flow.svelte', vue: 'Flow.vue' }[framework];
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

function sharedStorybookViteConfig(framework: StorybookFramework, sharedRoot: string) {
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
          replacement: '@xyflow/' + framework,
        },
        {
          find: '@storybook/framework',
          replacement: '@storybook/' + (framework === 'vue' ? 'vue3' : framework) + '-vite',
        },
      ] satisfies AliasEntry[],
    },
  };
}

function mergeViteAliases(existing: unknown, shared: AliasEntry[]) {
  return [...toAliasEntries(existing), ...shared];
}

// Used by both the Svelte Storybook builder and its browser-test runner.
export const svelteConditions = ['svelte', 'browser', 'development', 'import', 'module', 'default'];

export function configureSharedVite(config: UserConfig, framework: StorybookFramework, sharedRoot: string) {
  const shared = sharedStorybookViteConfig(framework, sharedRoot);
  config.server ??= {};
  config.server.fs ??= {};
  config.server.fs.allow = [...(config.server.fs.allow ?? []), path.resolve(sharedRoot, '../..'), sharedRoot];
  config.define = { ...config.define, ...shared.define };
  config.resolve ??= {};
  config.resolve.alias = mergeViteAliases(config.resolve.alias, shared.resolve.alias);
  if (framework === 'svelte') {
    config.resolve.conditions = svelteConditions;
  }
  return config;
}
