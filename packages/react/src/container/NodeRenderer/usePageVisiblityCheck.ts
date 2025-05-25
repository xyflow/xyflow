import { useEffect } from 'react';
import { useStoreApi } from '../../hooks/useStore';
import { InternalNodeUpdate } from '@xyflow/system';

export function usePageVisiblityCheck() {
  const store = useStoreApi();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const { nodeLookup, domNode, updateNodeInternals } = store.getState();
        const updates = new Map<string, InternalNodeUpdate>();

        for (let node of nodeLookup.values()) {
          if (node.measured.width === undefined || node.measured.height === undefined) {
            const nodeElement = domNode?.querySelector(`.react-flow__node[data-id="${node.id}"]`) as HTMLDivElement;

            if (nodeElement) {
              updates.set(node.id, { id: node.id, nodeElement, force: true });
            }
          }
        }

        updateNodeInternals(updates, { triggerFitView: false });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}
