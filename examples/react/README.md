# React Flow examples 

This Vite app is used internally to develop and test the library.

## Start local dev server

```sh
pnpm dev
```

## Adding new example

Development of the library is done against `src/examples`. Feel free to add new implementations for features that you develop.

1. Create a new folder & flow at `src/examples/`
2. Register the new route in `src/App/routes.ts`

## Adding new E2E implementation
Browser tests now live in [`storybook/`](/storybook). Run `pnpm test:storybook` from the repository root.



