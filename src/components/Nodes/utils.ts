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
      const handleId = handle.getAttribute('data-handleid');
      const handlePosition = (handle.getAttribute('data-handlepos') as unknown) as Position;

      return {
        id: handleId,
        position: handlePosition,
        x: (bounds.left - parentBounds.left) / k,
        y: (bounds.top - parentBounds.top) / k,
        ...dimensions,
      };
    }
  );
};
