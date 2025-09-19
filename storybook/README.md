# Storybook

This directory contains two Storybook instances for demonstrating React and Svelte components in xyflow.

## Structure

- **`react/`** - React Flow components and stories
- **`svelte/`** - Svelte Flow components and stories  
- **`shared/`** - Shared tests that can be imported by both libraries 

## Quick Start

### Run Individual Storybooks

```bash
# React Storybook (port 6006)
cd react/
pnpm storybook

# Svelte Storybook (port 6007)  
cd svelte/
pnpm storybook
```

### Run Both Concurrently

```bash
# From svelte/ or react/ directory - runs both React and Svelte together
cd svelte/ or cd react/
pnpm run dev:compose
```
