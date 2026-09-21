# Cypress end-to-end tests

These eight suites exercise React Storybook's standalone story pages (`iframe.html`), without the manager UI. They remain Cypress tests; the existing Vitest/play-function suites are separate.

From the repository root, build the libraries with `pnpm build`, then run `pnpm test:cypress:react`. The command starts Storybook on port 6006, runs headless Chrome, and shuts down Storybook. Chrome must be installed.

For interactive debugging, run `pnpm storybook:react` and, in another terminal, `pnpm --filter storybook-react test:e2e:open`. Against an already running Storybook, use `pnpm --filter storybook-react test:e2e:run`. Set `CYPRESS_BASE_URL` to target another Storybook server with that direct run command.

- Basic → `examples-basic--default`
- Controls → `components-controls--default`
- MiniMap → `components-minimap--default`
- Hidden → `examples-nodes-hidden--default`
- Empty → `examples-state-api-empty--default`
- Figma → `examples-basic--figma`
- DragHandle → `examples-handles--drag`
- Interaction → `examples-interaction-interaction--default`

The selected stories have no play functions, so Cypress owns the interactions. Hidden uses the Storybook args channel to toggle `isHidden` without remounting. Each suite deliberately shares story state between its tests, preserving the original test sequences.

Component and utility suites still live under `examples/react/cypress/components`; run those with `pnpm --filter react-examples test-component`.
