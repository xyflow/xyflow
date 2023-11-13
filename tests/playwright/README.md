# End-to-End with Playwright
Here you can find our framework independant E2E tests written with [playwright](https://playwright.dev/).

## Installation
```bash
cd tests/playwright # check if you are in the correct directory 

pnpm install # install node dependencies
npx playwright install # follow the instructions to install browsers
```

## Running the tests
```bash
pnpm run test:react # runs all the tests headless for react
pnpm run test:react:ui # runs tests for react in UI mode, good for debugging

pnpm run test:svelte # runs all the tests headless for svelte
pnpm run test:svelte:ui # runs tests for svelte in UI mode, good for debugging 
```

## Creating new tests
You can find all test implementations in the respective example projects under `/examples/react` and `/examples/svelte`. These example projects are also used for active development, so you can ignore most of the code in them. 

### Create new example or use an existing one
You will find all of the flows currently implemented for E2E testing at `/examples/{framework}/src/generic-tests`. Here you can create a new flow you want to write you test on by creating a new file and defining all of the props that will be applied to the components like this:
```javascript
// NewFolder/NewTest.ts
export default {
  flowProps: {
    minZoom: 0.25,
    maxZoom: 4,
    fitView: true,
    nodes: [
      {
        id: '1',
        data: { label: '1' },
        position: { x: 0, y: 0 },
        type: 'input',
      },
      {
        id: '2',
        data: { label: '2' },
        position: { x: -100, y: 100 },
      },
      {
        id: '3',
        data: { label: '3' },
        position: { x: 100, y: 100 },
      },
    ],
    edges: [
      {
        id: 'first-edge',
        source: '1',
        target: '2',
      },
      {
        id: 'second-edge',
        source: '1',
        target: '3',
      },
    ],
  },
  backgroundProps: { /*... */},
  panelProps: { /*... */},
  minimapProps:  { /*... */},
  controlsProps:  { /*... */},
} satisfies FlowConfig;
```

:warning: The directory and filename you choose will determine the route of the test case. Here it will reachable under `http://localhost:3000/tests/generic/newDirectory/newTest`. (3000 is the port of the react examples, it might differ for other frameworks)

### Create new E2E test case
Now you can start writing you new test case under `/tests/playwright/e2e`


