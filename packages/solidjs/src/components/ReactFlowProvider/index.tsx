
import { Provider } from '../../contexts/StoreContext';
import { createStore } from '../../store';
import { BatchProvider } from '../BatchProvider';
import type { Node, Edge } from '../../types';
import { ParentProps, createSignal } from 'solid-js';

export type ReactFlowProviderProps = {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  initialWidth?: number;
  initialHeight?: number;
  fitView?: boolean;
};

export function ReactFlowProvider(p: ParentProps<ReactFlowProviderProps>)  {
//   {
//   initialNodes: nodes,
//   initialEdges: edges,
//   defaultNodes,
//   defaultEdges,
//   initialWidth: width,
//   initialHeight: height,
//   fitView,
//   children,
// }: ReactFlowProviderProps) {

  // FIXME: this should be reactive to updates in initial settings  (I think )

  const [store] = createSignal(
    createStore({
      nodes: p.initialNodes,
      edges: p.initialEdges,
      defaultNodes: p.defaultNodes,
      defaultEdges: p.defaultEdges,
      width: p.initialWidth,
      height: p.initialHeight,
      fitView: p.fitView,
    })
  );

  return (
    <Provider value={store()}>
      <BatchProvider>{p.children}</BatchProvider>
    </Provider>
  );
}
