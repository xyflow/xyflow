import { useEffect, useRef } from 'react';

import { pointToRendererPoint } from '../utils/graph';
import { useStoreApi } from '../store';
import useZoomPanHelper from '../hooks/useZoomPanHelper';
import { OnLoad, XYPosition, Node, Edge, FlowExportObject } from '../types';

function useOnLoadHandler(onLoad: OnLoad<any> | undefined) {
  const isInitialized = useRef<boolean>(false);
  const store = useStoreApi();
  const { zoomIn, zoomOut, zoomTo, getZoom, setTransform, getTransform, setCenter, fitView, initialized } =
    useZoomPanHelper();

  useEffect(() => {
    if (!isInitialized.current && initialized) {
      if (onLoad) {
        const project = (position: XYPosition): XYPosition => {
          const { transform, snapToGrid, snapGrid } = store.getState();
          return pointToRendererPoint(position, transform, snapToGrid, snapGrid);
        };

        const getNodes = (): Node[] => {
          const { nodeInternals } = store.getState();
          // @TODO: work with nodeInternals instead of converting it to an array
          const nodes = Array.from(nodeInternals).map(([_, node]) => node);
          return nodes.map((n) => ({ ...n }));
        };

        const getEdges = (): Edge[] => {
          const { edges = [] } = store.getState();
          return edges.map((e) => ({ ...e }));
        };

        const toObject = (): FlowExportObject => {
          const { nodeInternals, edges = [], transform } = store.getState();
          // @TODO: work with nodeInternals instead of converting it to an array
          const nodes = Array.from(nodeInternals).map(([_, node]) => node);
          return {
            nodes: nodes.map((n) => ({ ...n })),
            edges: edges.map((e) => ({ ...e })),
            position: [transform[0], transform[1]],
            zoom: transform[2],
          };
        };

        onLoad({
          fitView: (params = { padding: 0.1 }) => fitView(params),
          zoomIn,
          zoomOut,
          zoomTo,
          getZoom,
          setTransform,
          getTransform,
          setCenter,
          project,
          getNodes,
          getEdges,
          toObject,
        });
      }

      isInitialized.current = true;
    }
  }, [onLoad, zoomIn, zoomOut, zoomTo, setTransform, fitView, initialized]);
}

export default useOnLoadHandler;
