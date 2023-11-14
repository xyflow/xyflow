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
E2E testing is done against the flows implemented in `src/generic-tests`. Adding a new configuration file automatically adds a new route under [`http://localhost:3000/tests/generic/$foldername/$filename`](http://localhost:5173/tests/generic/nodes/general). For further documentation visit [`xyflow/tests/playwright`](/tests/playwright).



