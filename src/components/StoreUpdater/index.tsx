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

  useEffect(() => {
    setNodes(nodes);
  }, [nodes]);

  useEffect(() => {
    setEdges(edges);
  }, [edges]);

  useEffect(() => {
    if (onConnect) {
      setOnConnect(onConnect);
    }
  }, [onConnect]);

  useEffect(() => {
    if (onConnectStart) {
      setOnConnectStart(onConnectStart);
    }
  }, [onConnectStart]);

  useEffect(() => {
    if (onConnectStop) {
      setOnConnectStop(onConnectStop);
    }
  }, [onConnectStop]);

  useEffect(() => {
    if (onConnectEnd) {
      setOnConnectEnd(onConnectEnd);
    }
  }, [onConnectEnd]);

  useEffect(() => {
    if (typeof snapToGrid !== 'undefined') {
      setSnapToGrid(snapToGrid);
    }
  }, [snapToGrid]);

  useEffect(() => {
    if (typeof snapGrid !== 'undefined') {
      setSnapGrid(snapGrid);
    }
  }, [snapGrid]);

  useEffect(() => {
    if (typeof nodesDraggable !== 'undefined') {
      setNodesDraggable(nodesDraggable);
    }
  }, [nodesDraggable]);

  useEffect(() => {
    if (typeof nodesConnectable !== 'undefined') {
      setNodesConnectable(nodesConnectable);
    }
  }, [nodesConnectable]);

  useEffect(() => {
    if (typeof elementsSelectable !== 'undefined') {
      setElementsSelectable(elementsSelectable);
    }
  }, [elementsSelectable]);

  useEffect(() => {
    if (typeof minZoom !== 'undefined') {
      setMinZoom(minZoom);
    }
  }, [minZoom]);

  useEffect(() => {
    if (typeof maxZoom !== 'undefined') {
      setMaxZoom(maxZoom);
    }
  }, [maxZoom]);

  useEffect(() => {
    if (typeof translateExtent !== 'undefined') {
      setTranslateExtent(translateExtent);
    }
  }, [translateExtent]);

  useEffect(() => {
    if (typeof nodeExtent !== 'undefined') {
      setNodeExtent(nodeExtent);
    }
  }, [nodeExtent]);

  useEffect(() => {
    if (typeof connectionMode !== 'undefined') {
      setConnectionMode(connectionMode);
    }
  }, [connectionMode]);

  useEffect(() => {
    if (typeof onNodesChange !== 'undefined') {
      setOnNodesChange(onNodesChange);
    }
  }, [onNodesChange]);

  useEffect(() => {
    if (typeof onEdgesChange !== 'undefined') {
      setOnEdgesChange(onEdgesChange);
    }
  }, [onEdgesChange]);

  useEffect(() => {
    setFitViewOnInit(fitViewOnInit);
  }, [fitViewOnInit]);

  return null;
};

export default StoreUpdater;
