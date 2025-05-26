import { getEventPosition, pointToRendererPoint, snapPosition } from '@xyflow/system';
import { storeToRefs } from './storeToRefs';
import { useStore } from './useStore';

/**
 * Composable that returns a function to get the pointer position
 *
 * @internal
 */
export function useGetPointerPosition() {
  const { transform, snapGrid, snapToGrid, vueFlowRef } = storeToRefs(useStore());

  // returns the pointer position projected to the VF coordinate system
  return (event: any) => {
    const containerBounds = vueFlowRef.value?.getBoundingClientRect() ?? { left: 0, top: 0 };
    const evt = 'sourceEvent' in event ? event.sourceEvent : event;

    const { x, y } = getEventPosition(evt, containerBounds as DOMRect);
    const pointerPos = pointToRendererPoint({ x, y }, transform.value);
    const { x: xSnapped, y: ySnapped } = snapToGrid.value ? snapPosition(pointerPos, snapGrid.value) : pointerPos;

    // we need the snapped position to be able to skip unnecessary drag events
    return {
      xSnapped,
      ySnapped,
      ...pointerPos,
    };
  };
}
