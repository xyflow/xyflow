# Angular Flow Examples

This Angular CLI app is used for testing the Angular Flow library with Playwright E2E tests.

## Start local dev server

```sh
pnpm dev
```

## Running on specific port (for tests)

```sh
ng serve --port 4200
```

## Test Routes

### Generic Tests

E2E testing routes that match the patterns used by React and Svelte implementations:

- `/tests/generic/nodes/general` - Basic node functionality tests
- `/tests/generic/edges/general` - Edge functionality tests  
- `/tests/generic/pane/general` - Viewport pane interaction tests
- `/tests/generic/node-toolbar/general` - Node toolbar positioning tests

### Examples

Development examples (placeholder routes):

- `/examples/{example-name}` - Individual example implementations

## Adding new generic test

1. Create a new configuration file in `src/app/generic-tests/{topic}/{example}.ts`
2. Export a default flow configuration object with the same structure as React/Svelte
3. The route will automatically be available at `/tests/generic/{topic}/{example}`

## Architecture

This Angular app serves as a test harness that:

- Dynamically imports test configurations based on URL parameters
- Renders Angular Flow components with the test configuration
- Provides the same test surface as React and Svelte implementations
- Supports all Angular Flow features and components

## Framework CSS Classes

Angular Flow uses `angular-flow__*` CSS classes that are tested alongside the existing `react-flow__*` and `svelte-flow__*` patterns in Playwright tests.

## Dependencies

- Angular 18+ with standalone components
- @xyflow/angular package (workspace dependency)
- Angular Router for dynamic test loading
- TypeScript for type safety
