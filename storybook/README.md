# Storybook

## Installation

From the monorepo root:

```bash
pnpm install
pnpm build
```

## Running Storybook

```bash
pnpm storybook              # host on :6008
pnpm storybook:react        # :6006
pnpm storybook:svelte       # :6007
```

## Running Vitest (CI)

Only stories tagged `test` run in CI:

```bash
pnpm test:storybook
pnpm test:storybook:react
pnpm test:storybook:svelte
```

```bash
pnpm exec playwright install chromium
```
