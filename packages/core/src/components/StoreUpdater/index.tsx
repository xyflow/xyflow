import { useEffect } from 'react';
import { SetState } from 'zustand';
import shallow from 'zustand/shallow';

import { useStore, useStoreApi } from '../../store';
import { Node, Edge, ReactFlowState, CoordinateExtent, ReactFlowProps } from '../../types';

type StoreUpdaterProps = Pick<
  ReactFlowProps,
  | 'nodes'
  | 'edges'
  | 'defaultNodes'
  | 'defaultEdges'
  | 'onConnect'
  | 'onConnectStart'
  | 'onConnectStop'
  | 'onConnectEnd'
  | 'onClickConnectStart'
  | 'onClickConnectStop'
  | 'onClickConnectEnd'
  | 'nodesDraggable'
  | 'nodesConnectable'
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
>;

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

function useDirectStoreUpdater(key: keyof ReactFlowState, value: any, setState: SetState<ReactFlowState>) {
  useEffect(() => {
    if (typeof value !== 'undefined') {
      // @ts-ignore
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
  onConnectStop,
  onConnectEnd,
  onClickConnectStart,
  onClickConnectStop,
  onClickConnectEnd,
  nodesDraggable,
  nodesConnectable,
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
    setDefaultNodesAndEdges(defaultNodes, defaultEdges);

    return () => {
      reset();
    };
  }, []);

  useDirectStoreUpdater('defaultEdgeOptions', defaultEdgeOptions, store.setState);
  useDirectStoreUpdater('connectionMode', connectionMode, store.setState);
  useDirectStoreUpdater('onConnect', onConnect, store.setState);
  useDirectStoreUpdater('onConnectStart', onConnectStart, store.setState);
  useDirectStoreUpdater('onConnectStop', onConnectStop, store.setState);
  useDirectStoreUpdater('onConnectEnd', onConnectEnd, store.setState);
  useDirectStoreUpdater('onClickConnectStart', onClickConnectStart, store.setState);
  useDirectStoreUpdater('onClickConnectStop', onClickConnectStop, store.setState);
  useDirectStoreUpdater('onClickConnectEnd', onClickConnectEnd, store.setState);
  useDirectStoreUpdater('nodesDraggable', nodesDraggable, store.setState);
  useDirectStoreUpdater('nodesConnectable', nodesConnectable, store.setState);
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

  useStoreUpdater<Node[]>(nodes, setNodes);
  useStoreUpdater<Edge[]>(edges, setEdges);
  useStoreUpdater<Node[]>(defaultNodes, setNodes);
  useStoreUpdater<Edge[]>(defaultEdges, setEdges);
  useStoreUpdater<number>(minZoom, setMinZoom);
  useStoreUpdater<number>(maxZoom, setMaxZoom);
  useStoreUpdater<CoordinateExtent>(translateExtent, setTranslateExtent);
  useStoreUpdater<CoordinateExtent>(nodeExtent, setNodeExtent);

  return null;
};

export default StoreUpdater;
