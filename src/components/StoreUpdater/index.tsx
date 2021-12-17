import { useEffect } from 'react';
import { SetState } from 'zustand';
import shallow from 'zustand/shallow';

import { useStore, useStoreApi } from '../../store';
import {
  Node,
  Edge,
  ReactFlowState,
  OnConnect,
  OnConnectStart,
  OnConnectStop,
  OnConnectEnd,
  CoordinateExtent,
  OnNodesChange,
  OnEdgesChange,
  ConnectionMode,
  SnapGrid,
} from '../../types';

interface StoreUpdaterProps {
  nodes: Node[];
  edges: Edge[];
  onConnect?: OnConnect;
  onConnectStart?: OnConnectStart;
  onConnectStop?: OnConnectStop;
  onConnectEnd?: OnConnectEnd;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  minZoom?: number;
  maxZoom?: number;
  nodeExtent?: CoordinateExtent;
  onNodesChange?: OnNodesChange;
  onEdgesChange?: OnEdgesChange;
  elementsSelectable?: boolean;
  connectionMode?: ConnectionMode;
  snapToGrid?: boolean;
  snapGrid?: SnapGrid;
  translateExtent?: CoordinateExtent;
  fitViewOnInit: boolean;
  connectOnClick: boolean;
}

const selector = (s: ReactFlowState) => ({
  setNodes: s.setNodes,
  setEdges: s.setEdges,
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
  onConnect,
  onConnectStart,
  onConnectStop,
  onConnectEnd,
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
  fitViewOnInit,
  connectOnClick,
}: StoreUpdaterProps) => {
  const { setNodes, setEdges, setMinZoom, setMaxZoom, setTranslateExtent, setNodeExtent, reset } = useStore(
    selector,
    shallow
  );
  const store = useStoreApi();

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  useStoreUpdater<Node[]>(nodes, setNodes);
  useStoreUpdater<Edge[]>(edges, setEdges);
  useStoreUpdater<number>(minZoom, setMinZoom);
  useStoreUpdater<number>(maxZoom, setMaxZoom);
  useStoreUpdater<CoordinateExtent>(translateExtent, setTranslateExtent);
  useStoreUpdater<CoordinateExtent>(nodeExtent, setNodeExtent);

  useDirectStoreUpdater('connectionMode', connectionMode, store.setState);
  useDirectStoreUpdater('onConnect', onConnect, store.setState);
  useDirectStoreUpdater('onConnectStart', onConnectStart, store.setState);
  useDirectStoreUpdater('onConnectStop', onConnectStop, store.setState);
  useDirectStoreUpdater('onConnectEnd', onConnectEnd, store.setState);
  useDirectStoreUpdater('nodesDraggable', nodesDraggable, store.setState);
  useDirectStoreUpdater('nodesConnectable', nodesConnectable, store.setState);
  useDirectStoreUpdater('elementsSelectable', elementsSelectable, store.setState);
  useDirectStoreUpdater('fitViewOnInit', fitViewOnInit, store.setState);
  useDirectStoreUpdater('snapToGrid', snapToGrid, store.setState);
  useDirectStoreUpdater('snapGrid', snapGrid, store.setState);
  useDirectStoreUpdater('onNodesChange', onNodesChange, store.setState);
  useDirectStoreUpdater('onEdgesChange', onEdgesChange, store.setState);
  useDirectStoreUpdater('connectOnClick', connectOnClick, store.setState);

  return null;
};

export default StoreUpdater;
