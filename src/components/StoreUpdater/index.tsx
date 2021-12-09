import { useEffect } from 'react';
import shallow from 'zustand/shallow';

import { useStore } from '../../store';
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
}

const selector = (s: ReactFlowState) => ({
  setNodes: s.setNodes,
  setEdges: s.setEdges,
  setOnConnect: s.setOnConnect,
  setOnConnectStart: s.setOnConnectStart,
  setOnConnectStop: s.setOnConnectStop,
  setOnConnectEnd: s.setOnConnectEnd,
  setSnapGrid: s.setSnapGrid,
  setSnapToGrid: s.setSnapToGrid,
  setNodesDraggable: s.setNodesDraggable,
  setNodesConnectable: s.setNodesConnectable,
  setElementsSelectable: s.setElementsSelectable,
  setMinZoom: s.setMinZoom,
  setMaxZoom: s.setMaxZoom,
  setTranslateExtent: s.setTranslateExtent,
  setNodeExtent: s.setNodeExtent,
  setConnectionMode: s.setConnectionMode,
  setOnNodesChange: s.setOnNodesChange,
  setOnEdgesChange: s.setOnEdgesChange,
  reset: s.reset,
  setFitViewOnInit: s.setFitViewOnInit,
});

function useStoreUpdater<T>(value: T | undefined, setStoreState: (param: T) => void) {
  useEffect(() => {
    if (typeof value !== 'undefined') {
      setStoreState(value);
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
}: StoreUpdaterProps) => {
  const {
    setNodes,
    setEdges,
    setOnConnect,
    setOnConnectStart,
    setOnConnectStop,
    setOnConnectEnd,
    setNodesDraggable,
    setSnapGrid,
    setSnapToGrid,
    setNodesConnectable,
    setElementsSelectable,
    setMinZoom,
    setMaxZoom,
    setTranslateExtent,
    setNodeExtent,
    setOnNodesChange,
    setOnEdgesChange,
    setConnectionMode,
    reset,
    setFitViewOnInit,
  } = useStore(selector, shallow);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  useStoreUpdater<Node[]>(nodes, setNodes);
  useStoreUpdater<Edge[]>(edges, setEdges);
  useStoreUpdater<OnConnect>(onConnect, setOnConnect);
  useStoreUpdater<OnConnect>(onConnect, setOnConnect);
  useStoreUpdater<OnConnectStart>(onConnectStart, setOnConnectStart);
  useStoreUpdater<OnConnectStop>(onConnectStop, setOnConnectStop);
  useStoreUpdater<OnConnectEnd>(onConnectEnd, setOnConnectEnd);
  useStoreUpdater<boolean>(snapToGrid, setSnapToGrid);
  useStoreUpdater<SnapGrid>(snapGrid, setSnapGrid);
  useStoreUpdater<boolean>(nodesDraggable, setNodesDraggable);
  useStoreUpdater<boolean>(nodesConnectable, setNodesConnectable);
  useStoreUpdater<boolean>(elementsSelectable, setElementsSelectable);
  useStoreUpdater<number>(minZoom, setMinZoom);
  useStoreUpdater<number>(maxZoom, setMaxZoom);
  useStoreUpdater<CoordinateExtent>(translateExtent, setTranslateExtent);
  useStoreUpdater<CoordinateExtent>(nodeExtent, setNodeExtent);
  useStoreUpdater<ConnectionMode>(connectionMode, setConnectionMode);
  useStoreUpdater<OnNodesChange>(onNodesChange, setOnNodesChange);
  useStoreUpdater<OnEdgesChange>(onEdgesChange, setOnEdgesChange);
  useStoreUpdater<boolean>(fitViewOnInit, setFitViewOnInit);

  return null;
};

export default StoreUpdater;
