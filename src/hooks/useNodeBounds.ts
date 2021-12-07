import { useCallback } from 'react';
import shallow from 'zustand/shallow';

import { NodeBounds } from '../types';
import { useStore } from '../store';

function useNodeBounds(id: string): NodeBounds | null {
  const nodeBounds = useStore(
    useCallback(
      (s) => {
        const nodeItem = s.nodeInternals.get(id);

        if (!nodeItem) {
          return null;
        }

        return {
          ...nodeItem.positionAbsolute,
          width: nodeItem.width ?? null,
          height: nodeItem.height ?? null,
        };
      },
      [id]
    ),
    shallow
  );

  return nodeBounds;
}

export default useNodeBounds;
