import { useCallback } from 'react';

import { useStore } from '../store';
import { isEdgeVisible, getSourceTargetNodes } from '../container/EdgeRenderer/utils';
import { ReactFlowState } from '../types';

function useVisibleEdges(onlyRenderVisible: boolean) {
  const edges = useStore(
    useCallback(
      (s: ReactFlowState) => {
        if (!onlyRenderVisible) {
          return s.edges;
        }

        return s.edges.filter((e) => {
          const { sourceNode, targetNode } = getSourceTargetNodes(e, s.nodes);

          return (
            sourceNode?.width &&
            sourceNode?.height &&
            targetNode?.width &&
            targetNode?.height &&
            isEdgeVisible({
              sourcePos: sourceNode.position,
              targetPos: targetNode.position,
              sourceWidth: sourceNode.width,
              sourceHeight: sourceNode.height,
              targetWidth: targetNode.width,
              targetHeight: targetNode.height,
              width: s.width,
              height: s.height,
              transform: s.transform,
            })
          );
        });
      },
      [onlyRenderVisible]
    )
  );

  return edges;
}

export default useVisibleEdges;
