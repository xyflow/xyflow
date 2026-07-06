# Storybook

- `shared/` – shared flow configs and interaction test helpers
- `react/` – React Flow Storybook (port 6006)
- `svelte/` – Svelte Flow Storybook (port 6007)
- `host/` – composition host that links React + Svelte (port 6008)

## Installation

From the monorepo root:

```bash
pnpm install
pnpm build
```

## Running Storybook

Browse both frameworks in one UI:

```bash
pnpm storybook
```

Open http://localhost:6008 and use the sidebar to switch between **React Flow** and **Svelte Flow**.

Run instances individually:

```bash
pnpm storybook:react   # http://localhost:6006
pnpm storybook:svelte  # http://localhost:6007
pnpm storybook:host    # http://localhost:6008 
```

## Running Vitest

From the monorepo root:

```bash
pnpm test:storybook
pnpm test:storybook:react
pnpm test:storybook:svelte
```
