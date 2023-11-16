import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import { adjustEdgeZIndex, isEdgeVisible } from '@xyflow/system';

import { useStore } from '../hooks/useStore';
import { type Edge, type ReactFlowState } from '../types';

function useVisibleEdges(onlyRenderVisible: boolean, elevateEdgesOnSelect: boolean): Edge[] {
  const edges = useStore(
    useCallback(
      (s: ReactFlowState) => {
        const visibleEdges =
          onlyRenderVisible && s.width && s.height
            ? s.edges.filter((e) => {
                const sourceNode = s.nodeLookup.get(e.source);
                const targetNode = s.nodeLookup.get(e.target);

                return (
                  sourceNode &&
                  targetNode &&
                  isEdgeVisible({
                    sourceNode,
                    targetNode,
                    width: s.width,
                    height: s.height,
                    transform: s.transform,
                  })
                );
              })
            : s.edges;

        return visibleEdges.map((edge) => adjustEdgeZIndex(edge, s.nodeLookup, elevateEdgesOnSelect));
      },
      [onlyRenderVisible, elevateEdgesOnSelect]
    ),
    shallow
  );

  return edges;
}

export default useVisibleEdges;
