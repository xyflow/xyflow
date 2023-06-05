import { derived } from 'svelte/store';
import { getBezierPath, getSmoothStepPath, getStraightPath } from '@xyflow/system';
import { ConnectionLineType, ConnectionMode, Position, internalsSymbol } from '@xyflow/system';

import type { SvelteFlowStoreState } from './types';

const oppositePosition = {
  [Position.Left]: Position.Right,
  [Position.Right]: Position.Left,
  [Position.Top]: Position.Bottom,
  [Position.Bottom]: Position.Top
};

export function getConnectionPath(store: SvelteFlowStoreState) {
  return derived(
    [
      store.connection,
      store.connectionLineType,
      store.connectionMode,
      store.nodes,
      store.transform
    ],
    ([connection, connectionLineType, connectionMode, nodes, transform]) => {
      if (!connection.connectionStartHandle?.nodeId) {
        return null;
      }

      const fromNode = nodes.find((n) => n.id === connection.connectionStartHandle?.nodeId);
      const fromHandleBounds = fromNode?.[internalsSymbol]?.handleBounds;
      const handleBoundsStrict =
        fromHandleBounds?.[connection.connectionStartHandle.type || 'source'] || [];
      const handleBoundsLoose = handleBoundsStrict
        ? handleBoundsStrict
        : fromHandleBounds?.[
            connection?.connectionStartHandle?.type === 'source' ? 'target' : 'source'
          ]!;
      const handleBounds =
        connectionMode === ConnectionMode.Strict ? handleBoundsStrict : handleBoundsLoose;
      const fromHandle = connection.connectionStartHandle?.handleId
        ? handleBounds.find((d) => d.id === connection.connectionStartHandle?.handleId)
        : handleBounds[0];
      const fromHandleX = fromHandle
        ? fromHandle.x + fromHandle.width / 2
        : (fromNode?.width ?? 0) / 2;
      const fromHandleY = fromHandle ? fromHandle.y + fromHandle.height / 2 : fromNode?.height ?? 0;
      const fromX = (fromNode?.positionAbsolute?.x ?? 0) + fromHandleX;
      const fromY = (fromNode?.positionAbsolute?.y ?? 0) + fromHandleY;
      const fromPosition = fromHandle?.position;
      const toPosition = fromPosition ? oppositePosition[fromPosition] : undefined;

      const pathParams = {
        sourceX: fromX,
        sourceY: fromY,
        sourcePosition: fromPosition,
        targetX: ((connection.connectionPosition?.x ?? 0) - transform[0]) / transform[2],
        targetY: ((connection.connectionPosition?.y ?? 0) - transform[1]) / transform[2],
        targetPosition: toPosition
      };

      let path = '';

      if (connectionLineType === ConnectionLineType.Bezier) {
        // we assume the destination position is opposite to the source position
        [path] = getBezierPath(pathParams);
      } else if (connectionLineType === ConnectionLineType.Step) {
        [path] = getSmoothStepPath({
          ...pathParams,
          borderRadius: 0
        });
      } else if (connectionLineType === ConnectionLineType.SmoothStep) {
        [path] = getSmoothStepPath(pathParams);
      } else {
        [path] = getStraightPath(pathParams);
      }

      return path;
    }
  );
}
