# @xyflow/system

Core system utilities powering [React Flow](https://reactflow.dev) and [Svelte Flow](https://svelteflow.dev).

> **Note:** This package is designed as a shared vanilla utility layer for React Flow and Svelte Flow. It is not intended for use with unrelated libraries.

## Installation

```sh
pnpm add @xyflow/system
```

## What is this package?

`@xyflow/system` provides core, framework-agnostic helpers and types for building node-based editors and flow diagrams. It contains the logic and utilities that are shared between React Flow and Svelte Flow, such as edge path calculations, pan/zoom, node dragging, and more.

## Features

- **Pan & Zoom (`XYPanZoom`)**: Utilities for adding interactive pan and zoom to your canvas.
- **Dragging (`XYDrag`)**: Helpers for node and selection dragging.
- **Handles/Connections (`XYHandle`)**: Logic for drawing and managing connection lines between nodes.
- **Minimap (`XYMiniMap`)**: Interactive minimap utilities for overview and navigation.
- **Edge Utilities**: Functions for SVG edge path creation (bezier, straight, step, smoothstep, etc.).
- **Store Utilities**: Helpers for managing and updating flow state.
- **DOM Utilities**: Functions for DOM measurements and interactions.
- **Marker Utilities**: Helpers for SVG markers on edges.
- **Graph Utilities**: Functions for working with nodes, edges, and graph structure.
- **General Utilities**: Miscellaneous helpers used throughout the system.
- **Types & Constants**: Shared types, enums, and constants for consistent data structures.

## Usage

You can import any utility, type, or helper directly from the package:

```ts
import { getBezierPath, getConnectedEdges, Position, XYPanZoom } from '@xyflow/system';
```

### Example: Bezier Edge Path Creation

```ts
import { getBezierPath, Position } from '@xyflow/system';

const [path, labelX, labelY] = getBezierPath({
  sourceX: 0,
  sourceY: 20,
  sourcePosition: Position.Right,
  targetX: 150,
  targetY: 100,
  targetPosition: Position.Left,
});
```

## API Reference

There is currently no dedicated API documentation for this package. For details on available utilities, types, and helpers, please refer to the [source code](./src) or check out the [React Flow documentation](https://reactflow.dev/api-reference/) where we are documenting a lot of stuff from this package.

## Contributing

See the main [xyflow repository](https://github.com/xyflow/xyflow) for contribution guidelines.


