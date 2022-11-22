import { useRef, useEffect } from 'react';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import type { D3DragEvent, SubjectPosition } from 'd3';
import { useStoreApi } from '../../hooks/useStore';
import { Dimensions, Node, XYPosition } from '../../types';

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
  const initialDimensionsRef = useRef<Dimensions & XYPosition>({ width: 0, height: 0, x: 0, y: 0 });
  const nodeElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!resizeHandleRef.current) {
      return;
    }

    const selection = select(resizeHandleRef.current);
    const dragHandler = drag<HTMLDivElement, unknown>()
      .on('start', () => {
        const { transform, nodeInternals } = store.getState();
        const node = nodeInternals.get(nodeId);
        const nodeElement = document.querySelector(`.react-flow__node[data-id="${nodeId}"]`) as HTMLDivElement;
        const bbox = nodeElement.getBoundingClientRect();
        initialDimensionsRef.current = {
          width: bbox.width / transform[2],
          height: bbox.height / transform[2],
          x: node?.position.x || 0,
          y: node?.position.y || 0,
        };
        nodeElementRef.current = nodeElement;
      })
      .on('drag', (evt: ResizeDragEvent) => {
        const { transform, updateNodePositions, nodeInternals } = store.getState();

        const nodeEl = nodeElementRef.current;
        const node = nodeInternals.get(nodeId);

        if (nodeEl && node) {
          const moveX = invertX ? -evt.x : evt.x;
          const moveY = invertY ? -evt.y : evt.y;
          const distX = enableX ? moveX - evt.subject.x : 0;
          const distY = enableY ? moveY - evt.subject.y : 0;
          const dragX = distX / transform[2];
          const dragY = distY / transform[2];

          const xPos = invertX ? initialDimensionsRef.current.x - dragX : initialDimensionsRef.current.x;
          const yPos = invertY ? initialDimensionsRef.current.y - dragY : initialDimensionsRef.current.y;

          console.log(dragX);

          nodeEl.style.width = `${initialDimensionsRef.current.width + dragX}px`;
          nodeEl.style.height = `${initialDimensionsRef.current.height + dragY}px`;
          nodeEl.style.transform = `translate(${xPos}px, ${yPos}px)`;

          if (invertX || invertY) {
            const positionUpdate = { x: xPos, y: yPos };

            updateNodePositions(
              [
                {
                  id: nodeId,
                  position: positionUpdate,
                  // positionAbsolute: node.positionAbsolute,
                } as Node,
              ],
              true,
              false
            );
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
