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
pnpm storybook:vue          # :6009
```

## Running Vitest (CI)

React and Svelte stories tagged `test` run in CI:

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


## Vue Storybook (`storybook/vue`)

Vue has its own stories and example components under `storybook/vue/stories/examples/`, migrated from the former Vue examples app. It does not consume `storybook/shared` stories or test helpers. The combined sidebar links to Vue alongside React and Svelte.

Build it with `pnpm exec turbo run build-storybook --filter=storybook-vue`. Run `pnpm --filter storybook-vue typecheck` to check its Vue components and stories.
