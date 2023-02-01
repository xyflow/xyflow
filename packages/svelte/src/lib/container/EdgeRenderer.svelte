<script lang="ts"> 
  type EdgePositions = {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
  }

  import Edge from '$lib/components/edges/BaseEdge.svelte';
  import { useStore } from '$lib/store';
	import { type NodeHandleBounds, type Rect, type Node, type HandleElement, Position, type XYPosition } from '@reactflow/core';
  import { internalsSymbol } from '@reactflow/core';

  const { edgesStore, widthStore, heightStore, nodesStore } = useStore();

  function getNodeData(node?: Node): [Rect, NodeHandleBounds | null, boolean] {
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

  function getHandlePosition(position: Position, nodeRect: Rect, handle: HandleElement | null = null): XYPosition {
    const x = (handle?.x || 0) + nodeRect.x;
    const y = (handle?.y || 0) + nodeRect.y;
    const width = handle?.width || nodeRect.width;
    const height = handle?.height || nodeRect.height;

    switch (position) {
      case Position.Top:
        return {
          x: x + width / 2,
          y,
        };
      case Position.Right:
        return {
          x: x + width,
          y: y + height / 2,
        };
      case Position.Bottom:
        return {
          x: x + width / 2,
          y: y + height,
        };
      case Position.Left:
        return {
          x,
          y: y + height / 2,
        };
    }
  }

  function getHandle(bounds: HandleElement[], handleId?: string | null): HandleElement | null {
    if (!bounds) {
      return null;
    }

    if (handleId) {
      return bounds.find((d) => d.id === handleId)!;
    } else if (bounds.length === 1) {
      return bounds[0];
    }

    return null;
  }

  function getEdgePositions(
    sourceNodeRect: Rect,
    sourceHandle: HandleElement,
    sourcePosition: Position,
    targetNodeRect: Rect,
    targetHandle: HandleElement,
    targetPosition: Position
  ): EdgePositions {
    const sourceHandlePos = getHandlePosition(sourcePosition, sourceNodeRect, sourceHandle);
    const targetHandlePos = getHandlePosition(targetPosition, targetNodeRect, targetHandle);

    return {
      sourceX: sourceHandlePos.x,
      sourceY: sourceHandlePos.y,
      targetX: targetHandlePos.x,
      targetY: targetHandlePos.y,
    };
  };

  let edgesWithData: any = [];

  $: {
    $nodesStore
    edgesWithData = $edgesStore.map((edge) => {
      const sourceNode = $nodesStore.find((node) => node.id === edge.source);
      const targetNode = $nodesStore.find((node) => node.id === edge.target);
      const [sourceNodeRect, sourceHandleBounds, sourceIsValid] = getNodeData(sourceNode);
      const [targetNodeRect, targetHandleBounds, targetIsValid] = getNodeData(targetNode);

      if (!sourceIsValid || !targetIsValid) {
        return null;
      }

      let edgeType = edge.type || 'default';

      const targetNodeHandles = targetHandleBounds!.target;
      const sourceHandle = getHandle(sourceHandleBounds!.source!, edge.sourceHandle);
      const targetHandle = getHandle(targetNodeHandles!, edge.targetHandle);
      const sourcePosition = sourceHandle?.position || Position.Bottom;
      const targetPosition = targetHandle?.position || Position.Top;

      if (!sourceHandle || !targetHandle) {
        return null;
      }


      const { sourceX, sourceY, targetX, targetY } = getEdgePositions(
        sourceNodeRect,
        sourceHandle,
        sourcePosition,
        targetNodeRect,
        targetHandle,
        targetPosition
      );


      return {
        id: edge.id,
        type: edgeType,
        sourceX,
        sourceY,
        targetX,
        targetY
      };
    })
  }
 </script>

<svg
  width={$widthStore}
  height={$heightStore}
  class="react-flow__edges react-flow__container"
>
  {#each edgesWithData as edge}
    {#if edge}
      <Edge {...edge} />
    {/if}
  {/each}
</svg>

<style>
  .react-flow__edges {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
</style>