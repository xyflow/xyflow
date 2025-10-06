# Vite Plugin: Generate Stories

The `vite-plugin-generate-stories.js` plugin automatically generates framework-specific story files from shared test files.

## How It Works

1. **Source**: The plugin watches files in `src/` for changes
2. **Generation**: For each `*.stories.ts` file found in a subdirectory (e.g., `Props/Props.stories.ts`), it generates:
   - `../react/src/auto/[Directory]/[Name].stories.tsx` - React story wrapper
   - `../svelte/src/auto/[Directory]/[Name].stories.ts` - Svelte story wrapper

3. **Content**: Generated files:
   - Import the framework-specific Flow component
   - Import all stories from the shared stories file
   - Re-export stories with framework-specific titles
   - Configure the component for Storybook

## Usage

The plugin is already configured in both React and Svelte Storybook vite configs:

```ts
import { generateStoriesPlugin } from '../shared-tests/vite-plugin-generate-stories.js';

export default defineConfig({
  plugins: [
    // ... other plugins
    generateStoriesPlugin({
      framework: 'react', // or 'svelte'
      sharedTestsPath: path.join(dirname, '../shared-tests/src'),
      outputPath: path.join(dirname, 'src/auto'),
    }),
  ],
});
```

## Creating New Shared Stories

To create a new shared story:

1. Create a directory in `src/` (e.g., `MyFeature/`)
2. Add the following files:
   - `data.ts` - Shared data and types
   - `Flow.tsx` - React implementation
   - `Flow.svelte` - Svelte implementation
   - `MyFeature.stories.ts` - Shared story definitions

3. The plugin will automatically generate:
   - `../react/src/auto/MyFeature/MyFeature.stories.tsx`
   - `../svelte/src/auto/MyFeature/MyFeature.stories.ts`

## Example Structure

```
src/
  Props/
    ├── data.ts              # Shared types and data
    ├── Flow.tsx             # React component
    ├── Flow.svelte          # Svelte component
    └── Props.stories.ts     # Shared story config

Generated files (auto-created):
../react/src/auto/
  Props/
    └── Props.stories.tsx    # React wrapper (auto-generated)

../svelte/src/auto/
  Props/
    └── Props.stories.ts     # Svelte wrapper (auto-generated)
```

## Story File Format

The shared `*.stories.ts` file should export:
- `meta` - Story metadata (title, argTypes, etc.)
- Named story objects (e.g., `HighNodeDragThreshold`, `PanOnScroll`)

Example:
```ts
export const meta = {
  title: 'Props',
  argTypes: {
    // ... control definitions
  },
};

export const HighNodeDragThreshold = {
  args: {
    nodeDragThreshold: 50,
  },
};
```

The plugin will parse these exports and generate framework-specific wrappers that:
- Add the correct title prefix (`React Flow/` or `Svelte Flow/`)
- Link to the framework-specific Flow component
- Re-export all story objects

## Development

- Files in `auto/` folders are auto-generated and git-ignored
- The plugin runs on:
  - Build start (initial generation)
  - Dev server start
  - File changes in `src/`
- Changes to `.tsx`, `.svelte`, or `.stories.ts` files trigger regeneration

## How the Plugin Works Internally

1. **Scanning**: Scans all subdirectories in `src/` looking for `*.stories.ts` files
2. **Parsing**: Uses regex to extract all exported story names (ignoring `meta`)
3. **Generation**: Creates framework-specific wrapper files with:
   - Correct imports for the framework
   - Framework-specific title
   - Re-exported stories
4. **Watching**: In dev mode, watches for file changes and regenerates on:
   - Changes to `*.stories.ts` files
   - Changes to `*.tsx` or `*.svelte` Flow components
   - Addition of new `*.stories.ts` files

## Plugin Options

- `framework` - Either `'react'` or `'svelte'`
- `sharedTestsPath` - Absolute path to the `src/` directory
- `outputPath` - Absolute path to the output `auto/` directory


