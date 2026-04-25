# Ember Flow

Ember Flow is a customizable Ember library for building node-based editors, workflow systems, diagrams, and interactive flow charts. It follows the same core model as the other XYFlow packages: HTML nodes, SVG edges, pan and zoom, selection, handles, custom node and edge types, viewport helpers, and plugin components.

This package is built for modern Ember apps and exposes Ember-native block components for store access where React Flow uses hooks.

## Installation

```sh
npm install @xyflow/ember
```

Import the styles in your app:

```ts
import '@xyflow/ember/dist/style.css';
```

Use `dist/base.css` if you only want the base structural styles.

## Quickstart

```gts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { Background, Controls, EmberFlow } from '@xyflow/ember';

import type { Edge, Node } from '@xyflow/ember';

export default class FlowExample extends Component {
  @tracked nodes: Node[] = [
    {
      id: '1',
      data: { label: 'Input' },
      position: { x: 0, y: 0 },
      type: 'input',
    },
    {
      id: '2',
      data: { label: 'Output' },
      position: { x: 200, y: 120 },
      type: 'output',
    },
  ];

  @tracked edges: Edge[] = [{ id: '1-2', source: '1', target: '2' }];

  <template>
    <EmberFlow @nodes={{this.nodes}} @edges={{this.edges}} @fitView={{true}} as |flow|>
      <Controls />
      <Background />
    </EmberFlow>
  </template>
}
```

## Store Access

`EmberFlow` yields the nearest `EmberFlowStore` so app-owned UI can call viewport, node, edge, and selection helpers:

```gts
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { EmberFlow, type EmberFlowStore } from '@xyflow/ember';

fitView = (flow: EmberFlowStore) => {
  void flow.fitView();
};

<EmberFlow @nodes={{this.nodes}} @edges={{this.edges}} as |flow|>
  <button type='button' {{on 'click' (fn this.fitView flow)}}>Fit view</button>
</EmberFlow>
```

For descendant UI, use Ember-native block resources:

```gts
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { UseEmberFlow, type EmberFlowStore } from '@xyflow/ember';

zoomIn = (flow: EmberFlowStore) => {
  void flow.zoomIn();
};

<UseEmberFlow as |flow|>
  <button type='button' {{on 'click' (fn this.zoomIn flow)}}>Zoom in</button>
</UseEmberFlow>
```

Other resource components include `UseNodes`, `UseEdges`, `UseViewport`, `UseConnection`, `UseNodeConnections`, `UseHandleConnections`, `UseNodesData`, `UseInternalNode`, `UseNodesInitialized`, `UseKeyPress`, and `UseStore`.

## Package Shape

The public entrypoint is `@xyflow/ember`. Components, helpers, and public types are exported from that entrypoint.

CSS exports:

- `@xyflow/ember/dist/base.css`
- `@xyflow/ember/dist/style.css`

## Development

From the repository root:

```sh
pnpm install
pnpm --filter @xyflow/ember build
pnpm --filter @xyflow/ember typecheck
pnpm --filter ember-examples dev --port 3002
pnpm --filter playwright run test:ember
```

## License

Ember Flow is MIT licensed.
