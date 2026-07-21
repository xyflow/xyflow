# Storybook

## Installation

```bash
pnpm install
pnpm build
```

## Running Storybook

```bash
pnpm storybook              # :6008
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

## Shared component stories (`storybook/shared`)

Component docs and tests live in `storybook/shared/components/$NAME/`:

```
$NAME/
├── config.ts               # fixtures, story definitions, argTypes, test flags
├── Flow.tsx / Flow.svelte  # framework wrappers (include arg mapping)
├── Background.stories.tsx  # React Storybook (via *.stories.tsx glob)
└── Background.stories.ts   # Svelte Storybook (via *.stories.ts glob)
```

React and Svelte Storybook configs include shared `*.stories.tsx` / `*.stories.ts` 

Examples stay separate under `storybook/{react,svelte}/stories/examples/`.

