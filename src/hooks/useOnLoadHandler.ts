import { GetState } from 'zustand';
import { useEffect, useRef } from 'react';

import { pointToRendererPoint } from '../utils/graph';
import { useStoreApi } from '../store';
import useZoomPanHelper from '../hooks/useZoomPanHelper';
import { OnLoadFunc, ReactFlowState, XYPosition, Node, Edge, FlowExportObject } from '../types';

export const onLoadProject = (getState: GetState<ReactFlowState>) => {
  return (position: XYPosition): XYPosition => {
    const { transform, snapToGrid, snapGrid } = getState();

    return pointToRendererPoint(position, transform, snapToGrid, snapGrid);
  };
};

export const onLoadGetNodes = (getState: GetState<ReactFlowState>) => {
  return (): Node[] => {
    const { nodes = [] } = getState();

    return nodes.map((n) => ({ ...n }));
  };
};

export const onLoadGetEdges = (getState: GetState<ReactFlowState>) => {
  return (): Edge[] => {
    const { edges = [] } = getState();

    return edges.map((e) => ({ ...e }));
  };
};

export const onLoadToObject = (getState: GetState<ReactFlowState>) => {
  return (): FlowExportObject => {
    const { nodes = [], edges = [], transform } = getState();

    return {
      nodes: nodes.map((n) => ({ ...n })),
      edges: edges.map((e) => ({ ...e })),
      position: [transform[0], transform[1]],
      zoom: transform[2],
    };
  };
};

function useOnLoadHandler(onLoad: OnLoadFunc<any> | undefined) {
  const isInitialized = useRef<boolean>(false);
  const store = useStoreApi();
  const { zoomIn, zoomOut, zoomTo, transform: setTransform, fitView, initialized } = useZoomPanHelper();

  useEffect(() => {
    if (!isInitialized.current && initialized) {
      if (onLoad) {
        onLoad({
          fitView: (params = { padding: 0.1 }) => fitView(params),
          zoomIn,
          zoomOut,
          zoomTo,
          setTransform,
          project: onLoadProject(store.getState),
          getNodes: onLoadGetNodes(store.getState),
          getEdges: onLoadGetEdges(store.getState),
          toObject: onLoadToObject(store.getState),
        });
      }

      isInitialized.current = true;
    }
  }, [onLoad, zoomIn, zoomOut, zoomTo, setTransform, fitView, initialized]);
}

export default useOnLoadHandler;
