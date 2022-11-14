import { useEffect } from 'react';
import { StoreApi } from 'zustand';
import shallow from 'zustand/shallow';

import { useStore, useStoreApi } from '../../hooks/useStore';
import type { Node, Edge, ReactFlowState, CoordinateExtent, ReactFlowProps, ReactFlowStore } from '../../types';

type StoreUpdaterProps = Pick<
  ReactFlowProps,
  | 'nodes'
  | 'edges'
  | 'defaultNodes'
  | 'defaultEdges'
  | 'onConnect'
  | 'onConnectStart'
  | 'onConnectEnd'
  | 'onClickConnectStart'
  | 'onClickConnectEnd'
  | 'nodesDraggable'
  | 'nodesConnectable'
  | 'nodesFocusable'
  | 'edgesFocusable'
  | 'minZoom'
  | 'maxZoom'
  | 'nodeExtent'
  | 'onNodesChange'
  | 'onEdgesChange'
  | 'elementsSelectable'
  | 'connectionMode'
  | 'snapToGrid'
  | 'snapGrid'
  | 'translateExtent'
  | 'connectOnClick'
  | 'defaultEdgeOptions'
  | 'fitView'
  | 'fitViewOptions'
  | 'onNodesDelete'
  | 'onEdgesDelete'
  | 'onNodeDragStart'
  | 'onNodeDrag'
  | 'onNodeDragStop'
  | 'onSelectionDragStart'
  | 'onSelectionDrag'
  | 'onSelectionDragStop'
  | 'noPanClassName'
  | 'nodeOrigin'
> & { rfId: string };

const selector = (s: ReactFlowState) => ({
  setNodes: s.setNodes,
  setEdges: s.setEdges,
  setDefaultNodesAndEdges: s.setDefaultNodesAndEdges,
  setMinZoom: s.setMinZoom,
  setMaxZoom: s.setMaxZoom,
  setTranslateExtent: s.setTranslateExtent,
  setNodeExtent: s.setNodeExtent,
  reset: s.reset,
});

function useStoreUpdater<T>(value: T | undefined, setStoreState: (param: T) => void) {
  useEffect(() => {
    if (typeof value !== 'undefined') {
      setStoreState(value);
    }
  }, [value]);
}

// updates with values in store that don't have a dedicated setter function
function useDirectStoreUpdater(
  key: keyof ReactFlowStore,
  value: unknown,
  setState: StoreApi<ReactFlowState>['setState']
) {
  useEffect(() => {
    if (typeof value !== 'undefined') {
      setState({ [key]: value });
    }
  }, [value]);
}

const StoreUpdater = ({
  nodes,
  edges,
  defaultNodes,
  defaultEdges,
  onConnect,
  onConnectStart,
  onConnectEnd,
  onClickConnectStart,
  onClickConnectEnd,
  nodesDraggable,
  nodesConnectable,
  nodesFocusable,
  edgesFocusable,
  minZoom,
  maxZoom,
  nodeExtent,
  onNodesChange,
  onEdgesChange,
  elementsSelectable,
  connectionMode,
  snapGrid,
  snapToGrid,
  translateExtent,
  connectOnClick,
  defaultEdgeOptions,
  fitView,
  fitViewOptions,
  onNodesDelete,
  onEdgesDelete,
  onNodeDrag,
  onNodeDragStart,
  onNodeDragStop,
  onSelectionDrag,
  onSelectionDragStart,
  onSelectionDragStop,
  noPanClassName,
  nodeOrigin,
  rfId,
}: StoreUpdaterProps) => {
  const {
    setNodes,
    setEdges,
    setDefaultNodesAndEdges,
    setMinZoom,
    setMaxZoom,
    setTranslateExtent,
    setNodeExtent,
    reset,
  } = useStore(selector, shallow);
  const store = useStoreApi();

  useEffect(() => {
    const edgesWithDefaults = defaultEdges?.map((e) => ({ ...e, ...defaultEdgeOptions }));
    setDefaultNodesAndEdges(defaultNodes, edgesWithDefaults);

    return () => {
      reset();
    };
  }, []);

  useDirectStoreUpdater('defaultEdgeOptions', defaultEdgeOptions, store.setState);
  useDirectStoreUpdater('connectionMode', connectionMode, store.setState);
  useDirectStoreUpdater('onConnect', onConnect, store.setState);
  useDirectStoreUpdater('onConnectStart', onConnectStart, store.setState);
  useDirectStoreUpdater('onConnectEnd', onConnectEnd, store.setState);
  useDirectStoreUpdater('onClickConnectStart', onClickConnectStart, store.setState);
  useDirectStoreUpdater('onClickConnectEnd', onClickConnectEnd, store.setState);
  useDirectStoreUpdater('nodesDraggable', nodesDraggable, store.setState);
  useDirectStoreUpdater('nodesConnectable', nodesConnectable, store.setState);
  useDirectStoreUpdater('nodesFocusable', nodesFocusable, store.setState);
  useDirectStoreUpdater('edgesFocusable', edgesFocusable, store.setState);
  useDirectStoreUpdater('elementsSelectable', elementsSelectable, store.setState);
  useDirectStoreUpdater('snapToGrid', snapToGrid, store.setState);
  useDirectStoreUpdater('snapGrid', snapGrid, store.setState);
  useDirectStoreUpdater('onNodesChange', onNodesChange, store.setState);
  useDirectStoreUpdater('onEdgesChange', onEdgesChange, store.setState);
  useDirectStoreUpdater('connectOnClick', connectOnClick, store.setState);
  useDirectStoreUpdater('fitViewOnInit', fitView, store.setState);
  useDirectStoreUpdater('fitViewOnInitOptions', fitViewOptions, store.setState);
  useDirectStoreUpdater('onNodesDelete', onNodesDelete, store.setState);
  useDirectStoreUpdater('onEdgesDelete', onEdgesDelete, store.setState);
  useDirectStoreUpdater('onNodeDrag', onNodeDrag, store.setState);
  useDirectStoreUpdater('onNodeDragStart', onNodeDragStart, store.setState);
  useDirectStoreUpdater('onNodeDragStop', onNodeDragStop, store.setState);
  useDirectStoreUpdater('onSelectionDrag', onSelectionDrag, store.setState);
  useDirectStoreUpdater('onSelectionDragStart', onSelectionDragStart, store.setState);
  useDirectStoreUpdater('onSelectionDragStop', onSelectionDragStop, store.setState);
  useDirectStoreUpdater('noPanClassName', noPanClassName, store.setState);
  useDirectStoreUpdater('nodeOrigin', nodeOrigin, store.setState);
  useDirectStoreUpdater('rfId', rfId, store.setState);

  useStoreUpdater<Node[]>(nodes, setNodes);
  useStoreUpdater<Edge[]>(edges, setEdges);
  useStoreUpdater<number>(minZoom, setMinZoom);
  useStoreUpdater<number>(maxZoom, setMaxZoom);
  useStoreUpdater<CoordinateExtent>(translateExtent, setTranslateExtent);
  useStoreUpdater<CoordinateExtent>(nodeExtent, setNodeExtent);

  return null;
};

export default StoreUpdater;
