import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import { isEdgeVisible } from '@xyflow/system';

import { useStore } from './useStore';
import { type ReactFlowState } from '../types';

function useVisibleEdgeIds(onlyRenderVisible: boolean): string[] {
  const edgeIds = useStore(
    useCallback(
      (s: ReactFlowState) => {
        if (!onlyRenderVisible) {
          return s.edges.map((edge) => edge.id);
        }

        const visibleEdgeIds = [];

        if (s.width && s.height) {
          for (const edge of s.edges) {
            const sourceNode = s.nodeLookup.get(edge.source);
            const targetNode = s.nodeLookup.get(edge.target);

            if (
              sourceNode &&
              targetNode &&
              isEdgeVisible({
                sourceNode,
                targetNode,
                width: s.width,
                height: s.height,
                transform: s.transform,
              })
            ) {
              visibleEdgeIds.push(edge.id);
            }
          }
        }

        return visibleEdgeIds;
      },
      [onlyRenderVisible]
    ),
    shallow
  );

  return edgeIds;
}

export default useVisibleEdgeIds;
