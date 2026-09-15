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
├── config.ts               # fixtures, default args, argTypes
├── Flow.tsx / Flow.svelte  # framework wrappers
└── $NAME.stories.ts        # stories, shared by both Storybooks
```

Examples stay separate under `storybook/{react,svelte}/stories/examples/`.

