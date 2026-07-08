# Storybook

## Installation

From the monorepo root:

```bash
pnpm install
pnpm build
```

## Running Storybook

```bash
pnpm storybook              # all three — open :6008 for the combined view
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

React and Svelte Storybook configs include shared `*.stories.tsx` / `*.stories.ts` respectively — no per-framework shim files needed.

Examples stay separate under `storybook/{react,svelte}/stories/examples/`.

### Adding a new component

1. Create `storybook/shared/components/MyComponent/` using the structure above
2. Add play helpers in `storybook/shared/play-helpers/` if needed
3. Add `MyComponent.stories.tsx` and `MyComponent.stories.ts` in the shared component folder
4. Tag stories with `test: true` in `config.ts` for CI coverage

### Troubleshooting

After moving or renaming shared component files, restart Storybook (`pnpm storybook:react` / `:svelte`). A stale dev server can return 404 for story modules and show “error loading dynamically imported module”.

If issues persist, clear the Vite cache: `rm -rf storybook/react/node_modules/.cache/storybook`.
