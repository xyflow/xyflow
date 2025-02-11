import { useState, type ReactNode } from 'react';

import { Provider } from '../../contexts/StoreContext';
import { createStore } from '../../store';
import { BatchProvider } from '../BatchProvider';
import type { Node, Edge } from '../../types';
import { CoordinateExtent, NodeOrigin } from '@xyflow/system';

export type ReactFlowProviderProps = {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  initialWidth?: number;
  initialHeight?: number;
  fitView?: boolean;
  nodeOrigin?: NodeOrigin;
  nodeExtent?: CoordinateExtent;
  children: ReactNode;
};

/**
 * The `<ReactFlowProvider />` component is a
 *[context provider](https://react.dev/learn/passing-data-deeply-with-context#) that
 *makes it possible to access a flow's internal state outside of the
 *[`<ReactFlow />`](/api-reference/react-flow) component. Many of the hooks we
 *provide rely on this component to work.
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
 *it's vital that you place the `<ReactFlowProvider />` component _outside_ of
 *your router. If you have multiple flows on the same page you will need to use a separate
 *`<ReactFlowProvider />` for each flow.
 */
export function ReactFlowProvider({
  initialNodes: nodes,
  initialEdges: edges,
  defaultNodes,
  defaultEdges,
  initialWidth: width,
  initialHeight: height,
  fitView,
  nodeOrigin,
  nodeExtent,
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
      nodeOrigin,
      nodeExtent,
    })
  );

  return (
    <Provider value={store}>
      <BatchProvider>{children}</BatchProvider>
    </Provider>
  );
}
