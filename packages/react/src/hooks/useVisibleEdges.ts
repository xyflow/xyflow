import { useCallback } from 'react';
import { GroupedEdges, groupEdgesByZLevel, isEdgeVisible } from '@xyflow/system';

import { useStore } from '../hooks/useStore';
import { Edge, type ReactFlowState } from '../types';
import { shallow } from 'zustand/shallow';

function useVisibleEdges(onlyRenderVisible: boolean, elevateEdgesOnSelect: boolean): GroupedEdges<Edge>[] {
  const edges = useStore(
    useCallback(
      (s: ReactFlowState) => {
        const visibleEdges =
          onlyRenderVisible && s.width && s.height
            ? s.edges.filter((e) => {
                const sourceNode = s.nodeInternals.get(e.source);
                const targetNode = s.nodeInternals.get(e.target);

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

        return groupEdgesByZLevel(visibleEdges, s.nodeInternals, elevateEdgesOnSelect);
      },
      [onlyRenderVisible, elevateEdgesOnSelect]
    ),
    (groupA, groupB) => {
      const unEqual = groupA.some(
        (item, index) =>
          item.isMaxLevel !== groupB[index].isMaxLevel ||
          item.level !== groupB[index].level ||
          !shallow(item.edges, groupB[index].edges)
      );

      return !unEqual;
    }
  );

  return edges;
}

export default useVisibleEdges;
