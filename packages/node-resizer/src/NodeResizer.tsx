import { useRef, useEffect } from 'react';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import type { D3DragEvent, SubjectPosition } from 'd3';
import { useStoreApi, useGetPointerPosition } from '@reactflow/core';
import type { Dimensions, Node, XYPosition } from '@reactflow/core';

type NodeResizerProps = {
  nodeId: string;
};

type ResizeHandleProps = {
  nodeId: string;
  invertX?: boolean;
  invertY?: boolean;
  enableX?: boolean;
  enableY?: boolean;
  top?: number | string;
  left?: number | string;
};

type ResizeDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;

function ResizeHandle({
  top = 0,
  left = 0,
  invertX = false,
  invertY = false,
  enableX = false,
  enableY = false,
  nodeId,
}: ResizeHandleProps) {
  const store = useStoreApi();
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const initialDimensionsRef = useRef<Dimensions & XYPosition & { nodeX: number; nodeY: number }>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    nodeX: 0,
    nodeY: 0,
  });
  const nodeElementRef = useRef<HTMLDivElement | null>(null);
  const getPointerPosition = useGetPointerPosition();

  useEffect(() => {
    if (!resizeHandleRef.current) {
      return;
    }

    const selection = select(resizeHandleRef.current);
    const dragHandler = drag<HTMLDivElement, unknown>()
      .on('start', (event: ResizeDragEvent) => {
        const node = store.getState().nodeInternals.get(nodeId);
        const pointerPos = getPointerPosition(event);

        initialDimensionsRef.current = {
          width: node?.width ?? 0,
          height: node?.height ?? 0,
          nodeX: node?.position.x ?? 0,
          nodeY: node?.position.y ?? 0,
          x: pointerPos.xSnapped,
          y: pointerPos.ySnapped,
        };
        nodeElementRef.current = document.querySelector(`.react-flow__node[data-id="${nodeId}"]`) as HTMLDivElement;
      })
      .on('drag', (event: ResizeDragEvent) => {
        const { updateNodePositions, nodeInternals } = store.getState();
        const pointerPos = getPointerPosition(event);
        const nodeEl = nodeElementRef.current;
        const node = nodeInternals.get(nodeId);

        if (nodeEl && node) {
          const distX = enableX ? pointerPos.xSnapped - initialDimensionsRef.current.x : 0;
          const distY = enableY ? pointerPos.ySnapped - initialDimensionsRef.current.y : 0;
          const width = initialDimensionsRef.current.width + (invertX ? -distX : distX);
          const height = initialDimensionsRef.current.height + (invertY ? -distY : distY);

          if (invertX || invertY) {
            const x = invertX ? initialDimensionsRef.current.nodeX + distX : node.position.x;
            const y = invertY ? initialDimensionsRef.current.nodeY + distY : node.position.y;

            if (x !== node.position.x || y !== node.position.y) {
              updateNodePositions(
                [
                  {
                    id: nodeId,
                    position: { x, y },
                  } as Node,
                ],
                true,
                false
              );
            }
          }

          if (width !== node.width) {
            nodeEl.style.width = `${width}px`;
          }
          if (height !== node.height) {
            nodeEl.style.height = `${height}px`;
          }
        }
      });

    selection.call(dragHandler);

    return () => {
      selection.on('.drag', null);
    };
  }, [nodeId]);

  return (
    <div
      className="nodrag"
      ref={resizeHandleRef}
      style={{
        position: 'absolute',
        left,
        top,
        width: 10,
        height: 10,
        background: 'red',
        opacity: 0.7,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
}

export default function NodeResizer({ nodeId }: NodeResizerProps) {
  return (
    <>
      <ResizeHandle nodeId={nodeId} top={0} left={0} enableX enableY invertX invertY />
      <ResizeHandle nodeId={nodeId} top="50%" left={0} enableX invertX />
      <ResizeHandle nodeId={nodeId} top="100%" left={0} enableX enableY />
      <ResizeHandle nodeId={nodeId} top={0} left="50%" enableY invertY />
      <ResizeHandle nodeId={nodeId} top={0} left="100%" enableX enableY invertY />
      <ResizeHandle nodeId={nodeId} top="50%" left="100%" enableX />
      <ResizeHandle nodeId={nodeId} top="100%" left="100%" enableX enableY />
      <ResizeHandle nodeId={nodeId} top="100%" left="50%" enableY />
    </>
  );
}
