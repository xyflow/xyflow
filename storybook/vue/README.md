```sh
pnpm --filter storybook-vue dev
pnpm exec turbo run build-storybook --filter=storybook-vue
pnpm --filter storybook-vue typecheck
pnpm --filter storybook-vue test-storybook
```
