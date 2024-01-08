import { clamp, getPointerPosition } from '../utils';
import { XYResizeControlPosition } from './types';

type GetResizeDirectionParams = {
  width: number;
  prevWidth: number;
  height: number;
  prevHeight: number;
  affectsX: boolean;
  affectsY: boolean;
};

/**
 * Get all connecting edges for a given set of nodes
 * @param width - new width of the node
 * @param prevWidth - previous width of the node
 * @param height - new height of the node
 * @param prevHeight - previous height of the node
 * @param affectsX - whether to invert the resize direction for the x axis
 * @param affectsY - whether to invert the resize direction for the y axis
 * @returns array of two numbers representing the direction of the resize for each axis, 0 = no change, 1 = increase, -1 = decrease
 */
export function getResizeDirection({
  width,
  prevWidth,
  height,
  prevHeight,
  affectsX,
  affectsY,
}: GetResizeDirectionParams) {
  const deltaWidth = width - prevWidth;
  const deltaHeight = height - prevHeight;

  const direction = [deltaWidth > 0 ? 1 : deltaWidth < 0 ? -1 : 0, deltaHeight > 0 ? 1 : deltaHeight < 0 ? -1 : 0];

  if (deltaWidth && affectsX) {
    direction[0] = direction[0] * -1;
  }

  if (deltaHeight && affectsY) {
    direction[1] = direction[1] * -1;
  }
  return direction;
}

/**
 * Parses the control position that is being dragged to dimensions that are being resized
 * @param controlPosition - position of the control that is being dragged
 * @returns isHorizontal, isVertical, affectsX, affectsY,
 */
export function getControlDirection(controlPosition: XYResizeControlPosition) {
  const isHorizontal = controlPosition.includes('right') || controlPosition.includes('left');
  const isVertical = controlPosition.includes('bottom') || controlPosition.includes('top');
  const affectsX = controlPosition.includes('left');
  const affectsY = controlPosition.includes('top');

  return {
    isHorizontal,
    isVertical,
    affectsX,
    affectsY,
  };
}

type PrevValues = {
  width: number;
  height: number;
  x: number;
  y: number;
};

type StartValues = PrevValues & {
  pointerX: number;
  pointerY: number;
  aspectRatio: number;
};

/**
 * Calculates new width & height of node after resize based on pointer position
 * @param startValues - starting values of resize
 * @param controlDirection - dimensions affected by the resize
 * @param pointerPosition - the current pointer position corrected for snapping
 * @param boundries - maximum and minimum dimensions of the node
 * @param keepAspectRatio - prevent changes of asprect ratio
 * @returns width: new width of node, height: new height of node
 */
export function getDimensionsAfterResize(
  startValues: StartValues,
  controlDirection: ReturnType<typeof getControlDirection>,
  pointerPosition: ReturnType<typeof getPointerPosition>,
  boundries: { minWidth: number; maxWidth: number; minHeight: number; maxHeight: number },
  keepAspectRatio: boolean
) {
  const { isHorizontal, isVertical, affectsX, affectsY } = controlDirection;
  const { xSnapped, ySnapped } = pointerPosition;
  const { minWidth, maxWidth, minHeight, maxHeight } = boundries;

  const { pointerX: startX, pointerY: startY, width: startWidth, height: startHeight, aspectRatio } = startValues;
  const distX = Math.floor(isHorizontal ? xSnapped - startX : 0);
  const distY = Math.floor(isVertical ? ySnapped - startY : 0);

  let width = clamp(startWidth + (affectsX ? -distX : distX), minWidth, maxWidth);
  let height = clamp(startHeight + (affectsY ? -distY : distY), minHeight, maxHeight);

  if (keepAspectRatio) {
    const nextAspectRatio = width / height;
    const isDiagonal = isHorizontal && isVertical;
    const isOnlyHorizontal = isHorizontal && !isVertical;
    const isOnlyVertical = isVertical && !isHorizontal;

    width = (nextAspectRatio <= aspectRatio && isDiagonal) || isOnlyVertical ? height * aspectRatio : width;
    height = (nextAspectRatio > aspectRatio && isDiagonal) || isOnlyHorizontal ? width / aspectRatio : height;

    if (width >= maxWidth) {
      width = maxWidth;
      height = maxWidth / aspectRatio;
    } else if (width <= minWidth) {
      width = minWidth;
      height = minWidth / aspectRatio;
    }

    if (height >= maxHeight) {
      height = maxHeight;
      width = maxHeight * aspectRatio;
    } else if (height <= minHeight) {
      height = minHeight;
      width = minHeight * aspectRatio;
    }
  }

  return {
    width,
    height,
  };
}

/**
 * Determines new x & y position of node after resize based on new width & height
 * @param startValues - starting values of resize
 * @param controlDirection - dimensions affected by the resize
 * @param width - new width of node
 * @param height - new height of node
 * @returns x: new x position of node, y: new y position of node
 */
export function getPositionAfterResize(
  startValues: StartValues,
  controlDirection: ReturnType<typeof getControlDirection>,
  width: number,
  height: number
) {
  const x = controlDirection.affectsX ? startValues.x - (width - startValues.width) : startValues.x;
  const y = controlDirection.affectsY ? startValues.y - (height - startValues.height) : startValues.y;
  return { x, y };
}
