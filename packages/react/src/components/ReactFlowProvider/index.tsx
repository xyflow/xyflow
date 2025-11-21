import { useState, type ReactNode } from 'react';

import { Provider } from '../../contexts/StoreContext';
import { createStore } from '../../store';
import { BatchProvider } from '../BatchProvider';
import type { Node, Edge, FitViewOptions } from '../../types';
import { CoordinateExtent, NodeOrigin, ZIndexMode } from '@xyflow/system';

export type ReactFlowProviderProps = {
  /** These nodes are used to initialize the flow. They are not dynamic. */
  initialNodes?: Node[];
  /** These edges are used to initialize the flow. They are not dynamic. */
  initialEdges?: Edge[];
  /** These nodes are used to initialize the flow. They are not dynamic. */
  defaultNodes?: Node[];
  /** These edges are used to initialize the flow. They are not dynamic. */
  defaultEdges?: Edge[];
  /** The initial width is necessary to be able to use fitView on the server */
  initialWidth?: number;
  /** The initial height is necessary to be able to use fitView on the server */
  initialHeight?: number;
  /** When `true`, the flow will be zoomed and panned to fit all the nodes initially provided. */
  fitView?: boolean;
  /**
   * You can provide an object of options to customize the initial fitView behavior.
   */
  initialFitViewOptions?: FitViewOptions;
  /** Initial minimum zoom level */
  initialMinZoom?: number;
  /** Initial maximum zoom level */
  initialMaxZoom?: number;
  /**
   * The origin of the node to use when placing it in the flow or looking up its `x` and `y`
   * position. An origin of `[0, 0]` means that a node's top left corner will be placed at the `x`
   * and `y` position.
   * @default [0, 0]
   * @example
   * [0, 0] // default, top left
   * [0.5, 0.5] // center
   * [1, 1] // bottom right
   */
  nodeOrigin?: NodeOrigin;
  /**
   * By default, nodes can be placed on an infinite flow. You can use this prop to set a boundary.
   *
   * The first pair of coordinates is the top left boundary and the second pair is the bottom right.
   * @example [[-1000, -10000], [1000, 1000]]
   */
  nodeExtent?: CoordinateExtent;
  children: ReactNode;
  zIndexMode?: ZIndexMode;
};

/**
 * The `<ReactFlowProvider />` component is a [context provider](https://react.dev/learn/passing-data-deeply-with-context#)
 * that makes it possible to access a flow's internal state outside of the
 * [`<ReactFlow />`](/api-reference/react-flow) component. Many of the hooks we
 * provide rely on this component to work.
 * @public
 *
 * @example
 * ```tsx
 *import { ReactFlow, ReactFlowProvider, useNodes } from '@xyflow/react'
 *
 *export default function Flow() {
 *  return (
 *    <ReactFlowProvider>
 *      <ReactFlow nodes={...} edges={...} />
 *      <Sidebar />
 *    </ReactFlowProvider>
 *  );
 *}
 *
 *function Sidebar() {
 *  // This hook will only work if the component it's used in is a child of a
 *  // <ReactFlowProvider />.
 *  const nodes = useNodes()
 *
 *  return <aside>do something with nodes</aside>;
 *}
 *```
 *
 * @remarks If you're using a router and want your flow's state to persist across routes,
 * it's vital that you place the `<ReactFlowProvider />` component _outside_ of
 * your router. If you have multiple flows on the same page you will need to use a separate
 * `<ReactFlowProvider />` for each flow.
 */
export function ReactFlowProvider({
  initialNodes: nodes,
  initialEdges: edges,
  defaultNodes,
  defaultEdges,
  initialWidth: width,
  initialHeight: height,
  initialMinZoom: minZoom,
  initialMaxZoom: maxZoom,
  initialFitViewOptions: fitViewOptions,
  fitView,
  nodeOrigin,
  nodeExtent,
  zIndexMode,
  children,
}: ReactFlowProviderProps) {
  const [store] = useState(() =>
    createStore({
      nodes,
      edges,
      defaultNodes,
      defaultEdges,
      width,
      height,
      fitView,
      minZoom,
      maxZoom,
      fitViewOptions,
      nodeOrigin,
      nodeExtent,
      zIndexMode,
    })
  );

  return (
    <Provider value={store}>
      <BatchProvider>{children}</BatchProvider>
    </Provider>
  );
}
