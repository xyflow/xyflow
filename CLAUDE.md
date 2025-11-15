# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

xyflow is a monorepo containing React Flow and Svelte Flow - powerful open source libraries for building node-based UIs. The repository includes:

- **@xyflow/react** (v12) - React Flow library ([packages/react](./packages/react))
- **@xyflow/svelte** - Svelte Flow library ([packages/svelte](./packages/svelte))
- **@xyflow/system** - Shared core system library powering both frameworks ([packages/system](./packages/system))
- **examples/** - Example applications for both React and Svelte
- **tests/** - Playwright tests for both frameworks

## Package Manager & Development Commands

**This repository uses pnpm exclusively.** Installation enforces this via a preinstall hook.

### Setup
```bash
pnpm install
```

### Development
```bash
# Run all dev servers in parallel (both React and Svelte examples)
pnpm dev

# Run only React examples dev server
pnpm dev:react

# Run only Svelte examples dev server
pnpm dev:svelte
```

### Building
```bash
# Build all packages
pnpm build

# Build only packages (not examples)
pnpm build:all
```

### Testing
```bash
# Run React Flow tests
pnpm test:react

# Run React Flow tests with UI
pnpm test:react:ui

# Run Svelte Flow tests
pnpm test:svelte

# Run Svelte Flow tests with UI
pnpm test:svelte:ui
```

Tests use Playwright and are located in `tests/playwright/`. Test commands run from the monorepo root, not from the tests directory.

### Quality Checks
```bash
# Lint packages
pnpm lint

# Type check packages
pnpm typecheck
```

### Cleanup
```bash
# Remove all dist, .turbo, and node_modules directories
pnpm clean
```

## Architecture

### Package Structure

The monorepo uses **Turborepo** for build orchestration and **pnpm workspaces** for package management.

**@xyflow/system** is the foundation:
- Framework-agnostic core logic for node-based UIs
- Handles pan/zoom ([xypanzoom](./packages/system/src/xypanzoom)), drag behavior ([xydrag](./packages/system/src/xydrag)), handle connections ([xyhandle](./packages/system/src/xyhandle)), minimap ([xyminimap](./packages/system/src/xyminimap)), and resizing ([xyresizer](./packages/system/src/xyresizer))
- Uses d3 for interactions (d3-drag, d3-zoom, d3-selection)
- Pure TypeScript with no framework dependencies

**@xyflow/react** wraps @xyflow/system:
- Uses Zustand for state management
- Main entry point: [ReactFlow](./packages/react/src/container/ReactFlow) component
- Components in [components/](./packages/react/src/components/) (nodes, edges, handles, controls, minimap, background)
- Custom hooks in [hooks/](./packages/react/src/hooks/) (useReactFlow, useNodesState, useEdgesState, etc.)
- Stores in [store/](./packages/react/src/store/)
- Build uses Rollup (config in tooling/rollup-config)
- CSS built with PostCSS from [styles/](./packages/react/src/styles/)

**@xyflow/svelte** wraps @xyflow/system:
- Uses Svelte 5 runes and stores
- Built with svelte-package from SvelteKit
- CSS built with PostCSS from [styles/](./packages/svelte/src/styles/)

### Shared Tooling

Located in [tooling/](./tooling/):
- **rollup-config** - Shared Rollup configuration for building packages
- **postcss-config** - Shared PostCSS configuration for CSS processing
- **tsconfig** - Shared TypeScript configurations
- **eslint-config** - Shared ESLint configuration

## Release Process

This repository uses **changesets** for version management:

1. Create PRs with features/fixes
2. Add a changeset if the change affects the public API:
   ```bash
   npx changeset
   ```
3. Merge PR to `main`
4. Changesets bot creates a "Version Packages" PR that bumps versions
5. Merge the Version Packages PR to release to npm and GitHub

### Changeset Style Guide

- Write for humans, focus on **impact** not implementation details
- Use active voice and present tense: "Fix reconnections..." not "Reconnections were fixed..."
- Omit redundant verbs: "Document X" not "Add documentation for X"
- Omit personal pronouns
- Use backticks for code: `getNodesBounds`, `<ReactFlow />`
- Good: "Display minimap nodes even if onNodesChange is not implemented"
- Bad: "minimap: use latest node dimensions"

## Working with Examples

React examples are in [examples/react/src/examples/](./examples/react/src/examples/). Each example is a self-contained demo showcasing specific features.

To test changes:
1. Make changes to packages
2. Run `pnpm dev:react` or `pnpm dev:svelte`
3. Navigate to relevant example in the dev server
4. Verify behavior

## Package-Specific Commands

### React Package
```bash
cd packages/react

# Watch mode (builds + CSS)
pnpm dev

# Production build
pnpm build

# Build CSS only
pnpm css

# Lint
pnpm lint

# Type check
pnpm typecheck
```

### Svelte Package
```bash
cd packages/svelte

# Watch mode
pnpm dev

# Production build
pnpm build

# Type check
pnpm check

# Lint
pnpm lint
```

### System Package
```bash
cd packages/system

# Watch mode
pnpm dev

# Production build
pnpm build

# Lint
pnpm lint

# Type check
pnpm typecheck
```

## Contributing Philosophy

The core team maintains control over features and direction (cathedral-style development). Before working on enhancements:
- Discuss in [GitHub Discussions](https://github.com/xyflow/xyflow/discussions/categories/new-features)
- Contact: info@reactflow.dev
- Bug reports and documentation improvements are always welcome
