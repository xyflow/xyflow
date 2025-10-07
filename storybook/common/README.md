# Storybook Shared Tests

This package provides shared components, stories, and utilities for both React and Svelte Flow Storybook instances. Components are organized in example folders where each example contains React, Svelte, and shared story files.

## Structure

```
common-storybook/
├── src/
│   ├── examples/              # Example components
│   │   └── BasicFlow/
│   │       ├── BasicFlow.tsx       # React component
│   │       ├── BasicFlow.svelte    # Svelte component
│   │       └── BasicFlow.stories.ts # Shared story config
│   ├── shared/                # Shared utilities and types
│   │   ├── types.ts           # Shared TypeScript types
│   │   ├── stories.ts         # Shared story configuration
│   │   ├── data.ts            # Shared data/constants
│   │   └── index.ts
│   ├── react.ts               # React exports
│   ├── svelte.ts              # Svelte exports
│   └── stories.ts             # Story exports
├── package.json
├── tsconfig.json              # Root TS config
├── tsconfig.react.json        # React-specific TS config
├── tsconfig.svelte.json       # Svelte-specific TS config
├── tsconfig.node.json         # Node/build config
├── eslint.config.js           # ESLint for both React and Svelte
├── vite.config.ts             # Vite config for both frameworks
└── svelte.config.js           # Svelte-specific config
```

## Creating a New Example

To create a new example, simply create a folder under `src/examples/` with three files:

1. **React Component** (`YourExample.tsx`)
2. **Svelte Component** (`YourExample.svelte`)
3. **Shared Stories** (`YourExample.stories.ts`)

### Example Structure

```
src/examples/YourExample/
├── YourExample.tsx          # React implementation
├── YourExample.svelte       # Svelte implementation
└── YourExample.stories.ts   # Shared story metadata
```

Then export them in:
- `src/react.ts` - Add React export
- `src/svelte.ts` - Add Svelte export
- `src/stories.ts` - Add story export

## Usage

### In React Storybook

```typescript
import { BasicFlow } from 'common-storybook/react';
import { meta, defaultArgs, playFunction } from 'common-storybook/stories';

export default {
  ...meta,
  component: BasicFlow,
};

export const Default = {
  args: defaultArgs,
  play: playFunction,
};
```

### In Svelte Storybook

```typescript
import BasicFlow from 'common-storybook/svelte';
import { meta, defaultArgs, playFunction } from 'common-storybook/stories';

export default {
  ...meta,
  component: BasicFlow,
};

export const Default = {
  args: defaultArgs,
  play: playFunction,
};
```

## Package Exports

### `common-storybook/react`
- React Flow components (`.tsx` files)

### `common-storybook/svelte`
- Svelte Flow components (`.svelte` files)

### `common-storybook/stories`
- Shared story configurations and metadata

### `common-storybook/shared`
- `BasicFlowProps` - Shared props interface
- `FlowNode` - Node type
- `FlowEdge` - Edge type
- `sharedArgTypes` - Storybook argTypes configuration
- `defaultStoryArgs` - Default story arguments
- `runBasicRenderingTests` - Test runner for stories
- `initialNodes` - Default nodes data
- `initialEdges` - Default edges data
- `fitViewOptions` - Default fitView options

## Development

### Type Checking

```bash
# Check both React and Svelte types
pnpm run check
```

### Linting

```bash
# Lint both React and Svelte files
pnpm run lint
```

## Configuration Details

### TypeScript
- **tsconfig.react.json** - Handles React `.tsx` files and shared `.ts` files
- **tsconfig.svelte.json** - Handles Svelte `.svelte` files and shared `.ts` files
- **tsconfig.node.json** - Handles build configuration files
- All configs use project references for better type checking

### ESLint
- Configured to handle both React (`.tsx`) and Svelte (`.svelte`) files
- React files use `react-hooks` and `react-refresh` plugins
- Svelte files use `eslint-plugin-svelte` with Svelte 5 support
- Shared files linted without strict project references for flexibility

### Vite
- Configured with both React and Svelte plugins
- Supports importing both `.tsx` and `.svelte` files

## Notes

- React components use `.tsx` extension
- Svelte components use `.svelte` extension with Svelte 5 runes mode enabled
- Shared story configurations use `.ts` extension
- All examples should implement the same functionality in both frameworks
- TypeScript strict mode is enabled for type safety


