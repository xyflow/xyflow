import { EdgePosition } from '../../types/edges';
import { ConnectionMode, OnError } from '../../types/general';
import { BaseNode, NodeHandleBounds } from '../../types/nodes';
import { Position, Rect } from '../../types/utils';
import { errorMessages, internalsSymbol } from '../../constants';
import { getHandle, getHandlePosition } from './general';

export function getHandleDataByNode(node?: BaseNode): [Rect, NodeHandleBounds | null, boolean] {
  const handleBounds = node?.[internalsSymbol]?.handleBounds || null;

  const isValid =
    handleBounds &&
    node?.width &&
    node?.height &&
    typeof node?.positionAbsolute?.x !== 'undefined' &&
    typeof node?.positionAbsolute?.y !== 'undefined';

  return [
    {
      x: node?.positionAbsolute?.x || 0,
      y: node?.positionAbsolute?.y || 0,
      width: node?.width || 0,
      height: node?.height || 0,
    },
    handleBounds,
    !!isValid,
  ];
}

export type GetEdgePositionParams = {
  id: string;
  sourceNode: BaseNode;
  sourceHandle: string | null;
  targetNode: BaseNode;
  targetHandle: string | null;
  connectionMode: ConnectionMode;
  onError?: OnError;
};

export function getEdgePosition(params: GetEdgePositionParams): EdgePosition | null {
  const [sourceNodeRect, sourceHandleBounds, sourceIsValid] = getHandleDataByNode(params.sourceNode);
  const [targetNodeRect, targetHandleBounds, targetIsValid] = getHandleDataByNode(params.targetNode);

  if (!sourceIsValid || !targetIsValid) {
    return null;
  }

  // when connection type is loose we can define all handles as sources and connect source -> source
  const targetNodeHandles =
    params.connectionMode === ConnectionMode.Strict
      ? targetHandleBounds!.target
      : (targetHandleBounds!.target ?? []).concat(targetHandleBounds!.source ?? []);
  const sourceHandle = getHandle(sourceHandleBounds!.source!, params.sourceHandle);
  const targetHandle = getHandle(targetNodeHandles!, params.targetHandle);
  const sourcePosition = sourceHandle?.position || Position.Bottom;
  const targetPosition = targetHandle?.position || Position.Top;

  if (!sourceHandle || !targetHandle) {
    params.onError?.(
      '008',
      errorMessages['error008'](!sourceHandle ? 'source' : 'target', {
        id: params.id,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      })
    );

    return null;
  }

  const { x: sourceX, y: sourceY } = getHandlePosition(sourcePosition, sourceNodeRect, sourceHandle);
  const { x: targetX, y: targetY } = getHandlePosition(targetPosition, targetNodeRect, targetHandle);

  return {
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  };
}
