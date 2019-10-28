import { HandleElement, Position } from '../../types';
import { getDimensions } from '../../utils';

export const getHandleBounds = (
  selector: string,
  nodeElement: HTMLDivElement,
  parentBounds: ClientRect | DOMRect,
  k: number
): HandleElement[] | null => {
  const handles = nodeElement.querySelectorAll(selector);

  if (!handles || !handles.length) {
    return null;
  }

  const handlesArray = Array.from(handles) as HTMLDivElement[];

  return handlesArray.map(
    (handle): HandleElement => {
      const bounds = handle.getBoundingClientRect();
      const dimensions = getDimensions(handle);
      const nodeIdAttr = handle.getAttribute('data-nodeid');
      const handlePosition = (handle.getAttribute('data-handlepos') as unknown) as Position;
      const nodeIdSplitted = nodeIdAttr ? nodeIdAttr.split('__') : null;

      let handleId = null;

      if (nodeIdSplitted) {
        handleId = (nodeIdSplitted.length ? nodeIdSplitted[1] : nodeIdSplitted) as string;
      }

      return {
        id: handleId,
        position: handlePosition,
        x: (bounds.left - parentBounds.left) * (1 / k),
        y: (bounds.top - parentBounds.top) * (1 / k),
        ...dimensions,
      };
    }
  );
};
