import { CoordinateExtent, NodeOrigin } from '../types';
import { getPointerPosition } from '../utils';
import { ControlPosition } from './types';

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
export function getControlDirection(controlPosition: ControlPosition) {
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

function getLowerExtentClamp(lowerExtent: number, lowerBound: number) {
  return Math.max(0, lowerBound - lowerExtent);
}

function getUpperExtentClamp(upperExtent: number, upperBound: number) {
  return Math.max(0, upperExtent - upperBound);
}

function getSizeClamp(size: number, minSize: number, maxSize: number) {
  return Math.max(0, minSize - size, size - maxSize);
}

function xor(a: boolean, b: boolean) {
  return a ? !b : b;
}

/**
 * Calculates new width & height and x & y of node after resize based on pointer position
 * @description - Buckle up, this is a chunky one... If you want to determine the new dimensions of a node after a resize,
 * you have to account for all possible restrictions: min/max width/height of the node, the maximum extent the node is allowed
 * to move in (in this case: resize into) determined by the parent node, the minimal extent determined by child nodes
 * with expandParent or extent: 'parent' set and oh yeah, these things also have to work with keepAspectRatio!
 * The way this is done is by determining how much each of these restricting actually restricts the resize and then applying the
 * strongest restriction. Because the resize affects x, y and width, height and width, height of a opposing side with keepAspectRatio,
 * the resize amount is always kept in distX & distY amount (the distance in mouse movement)
 * Instead of clamping each value, we first calculate the biggest 'clamp' (for the lack of a better name) and then apply it to all values.
 * To complicate things nodeOrigin has to be taken into account as well. This is done by offsetting the nodes as if their origin is [0, 0],
 * then calculating the restrictions as usual
 * @param startValues - starting values of resize
 * @param controlDirection - dimensions affected by the resize
 * @param pointerPosition - the current pointer position corrected for snapping
 * @param boundaries - minimum and maximum dimensions of the node
 * @param keepAspectRatio - prevent changes of asprect ratio
 * @returns x, y, width and height of the node after resize
 */
export function getDimensionsAfterResize(
  startValues: StartValues,
  controlDirection: ReturnType<typeof getControlDirection>,
  pointerPosition: ReturnType<typeof getPointerPosition>,
  boundaries: { minWidth: number; maxWidth: number; minHeight: number; maxHeight: number },
  keepAspectRatio: boolean,
  nodeOrigin: NodeOrigin,
  extent?: CoordinateExtent,
  childExtent?: CoordinateExtent
) {
  let { affectsX, affectsY } = controlDirection;
  const { isHorizontal, isVertical } = controlDirection;
  const isDiagonal = isHorizontal && isVertical;

  const { xSnapped, ySnapped } = pointerPosition;
  const { minWidth, maxWidth, minHeight, maxHeight } = boundaries;

  const { x: startX, y: startY, width: startWidth, height: startHeight, aspectRatio } = startValues;
  let distX = Math.floor(isHorizontal ? xSnapped - startValues.pointerX : 0);
  let distY = Math.floor(isVertical ? ySnapped - startValues.pointerY : 0);

  const newWidth = startWidth + (affectsX ? -distX : distX);
  const newHeight = startHeight + (affectsY ? -distY : distY);

  const originOffsetX = -nodeOrigin[0] * startWidth;
  const originOffsetY = -nodeOrigin[1] * startHeight;

  // Check if maxWidth, minWWidth, maxHeight, minHeight are restricting the resize
  let clampX = getSizeClamp(newWidth, minWidth, maxWidth);
  let clampY = getSizeClamp(newHeight, minHeight, maxHeight);

  // Check if extent is restricting the resize
  if (extent) {
    let xExtentClamp = 0;
    let yExtentClamp = 0;
    if (affectsX && distX < 0) {
      xExtentClamp = getLowerExtentClamp(startX + distX + originOffsetX, extent[0][0]);
    } else if (!affectsX && distX > 0) {
      xExtentClamp = getUpperExtentClamp(startX + newWidth + originOffsetX, extent[1][0]);
    }

    if (affectsY && distY < 0) {
      yExtentClamp = getLowerExtentClamp(startY + distY + originOffsetY, extent[0][1]);
    } else if (!affectsY && distY > 0) {
      yExtentClamp = getUpperExtentClamp(startY + newHeight + originOffsetY, extent[1][1]);
    }

    clampX = Math.max(clampX, xExtentClamp);
    clampY = Math.max(clampY, yExtentClamp);
  }

  // Check if the child extent is restricting the resize
  if (childExtent) {
    let xExtentClamp = 0;
    let yExtentClamp = 0;
    if (affectsX && distX > 0) {
      xExtentClamp = getUpperExtentClamp(startX + distX, childExtent[0][0]);
    } else if (!affectsX && distX < 0) {
      xExtentClamp = getLowerExtentClamp(startX + newWidth, childExtent[1][0]);
    }

    if (affectsY && distY > 0) {
      yExtentClamp = getUpperExtentClamp(startY + distY, childExtent[0][1]);
    } else if (!affectsY && distY < 0) {
      yExtentClamp = getLowerExtentClamp(startY + newHeight, childExtent[1][1]);
    }

    clampX = Math.max(clampX, xExtentClamp);
    clampY = Math.max(clampY, yExtentClamp);
  }

  // Check if the aspect ratio resizing of the other side is restricting the resize
  if (keepAspectRatio) {
    if (isHorizontal) {
      // Check if the max dimensions might be restricting the resize
      const aspectHeightClamp = getSizeClamp(newWidth / aspectRatio, minHeight, maxHeight) * aspectRatio;
      clampX = Math.max(clampX, aspectHeightClamp);

      // Check if the extent is restricting the resize
      if (extent) {
        let aspectExtentClamp = 0;
        if ((!affectsX && !affectsY) || (affectsX && !affectsY && isDiagonal)) {
          aspectExtentClamp =
            getUpperExtentClamp(startY + originOffsetY + newWidth / aspectRatio, extent[1][1]) * aspectRatio;
        } else {
          aspectExtentClamp =
            getLowerExtentClamp(startY + originOffsetY + (affectsX ? distX : -distX) / aspectRatio, extent[0][1]) *
            aspectRatio;
        }
        clampX = Math.max(clampX, aspectExtentClamp);
      }

      // Check if the child extent is restricting the resize
      if (childExtent) {
        let aspectExtentClamp = 0;
        if ((!affectsX && !affectsY) || (affectsX && !affectsY && isDiagonal)) {
          aspectExtentClamp = getLowerExtentClamp(startY + newWidth / aspectRatio, childExtent[1][1]) * aspectRatio;
        } else {
          aspectExtentClamp =
            getUpperExtentClamp(startY + (affectsX ? distX : -distX) / aspectRatio, childExtent[0][1]) * aspectRatio;
        }
        clampX = Math.max(clampX, aspectExtentClamp);
      }
    }

    // Do the same thing for vertical resizing
    if (isVertical) {
      const aspectWidthClamp = getSizeClamp(newHeight * aspectRatio, minWidth, maxWidth) / aspectRatio;
      clampY = Math.max(clampY, aspectWidthClamp);

      if (extent) {
        let aspectExtentClamp = 0;
        if ((!affectsX && !affectsY) || (affectsY && !affectsX && isDiagonal)) {
          aspectExtentClamp =
            getUpperExtentClamp(startX + newHeight * aspectRatio + originOffsetX, extent[1][0]) / aspectRatio;
        } else {
          aspectExtentClamp =
            getLowerExtentClamp(startX + (affectsY ? distY : -distY) * aspectRatio + originOffsetX, extent[0][0]) /
            aspectRatio;
        }
        clampY = Math.max(clampY, aspectExtentClamp);
      }

      if (childExtent) {
        let aspectExtentClamp = 0;
        if ((!affectsX && !affectsY) || (affectsY && !affectsX && isDiagonal)) {
          aspectExtentClamp = getLowerExtentClamp(startX + newHeight * aspectRatio, childExtent[1][0]) / aspectRatio;
        } else {
          aspectExtentClamp =
            getUpperExtentClamp(startX + (affectsY ? distY : -distY) * aspectRatio, childExtent[0][0]) / aspectRatio;
        }
        clampY = Math.max(clampY, aspectExtentClamp);
      }
    }
  }

  distY = distY + (distY < 0 ? clampY : -clampY);
  distX = distX + (distX < 0 ? clampX : -clampX);

  if (keepAspectRatio) {
    if (isDiagonal) {
      if (newWidth > newHeight * aspectRatio) {
        distY = (xor(affectsX, affectsY) ? -distX : distX) / aspectRatio;
      } else {
        distX = (xor(affectsX, affectsY) ? -distY : distY) * aspectRatio;
      }
    } else {
      if (isHorizontal) {
        distY = distX / aspectRatio;
        affectsY = affectsX;
      } else {
        distX = distY * aspectRatio;
        affectsX = affectsY;
      }
    }
  }

  const x = affectsX ? startX + distX : startX;
  const y = affectsY ? startY + distY : startY;

  return {
    width: startWidth + (affectsX ? -distX : distX),
    height: startHeight + (affectsY ? -distY : distY),
    x: nodeOrigin[0] * distX * (!affectsX ? 1 : -1) + x,
    y: nodeOrigin[1] * distY * (!affectsY ? 1 : -1) + y,
  };
}
