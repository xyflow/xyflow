/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Node, Edge, EdgeChange, NodeChange } from '../types';

function handleParentExpand(res: any[], updateItem: any) {
  const parent = res.find((e) => e.id === updateItem.parentNode);

  if (parent) {
    const extendWidth = updateItem.position.x + updateItem.width - parent.width;
    const extendHeight = updateItem.position.y + updateItem.height - parent.height;

    if (extendWidth > 0 || extendHeight > 0 || updateItem.position.x < 0 || updateItem.position.y < 0) {
      parent.style = { ...parent.style } || {};

      parent.style.width = parent.style.width ?? parent.width;
      parent.style.height = parent.style.height ?? parent.height;

      if (extendWidth > 0) {
        parent.style.width += extendWidth;
      }

      if (extendHeight > 0) {
        parent.style.height += extendHeight;
      }

      if (updateItem.position.x < 0) {
        const xDiff = Math.abs(updateItem.position.x);
        parent.position.x = parent.position.x - xDiff;
        parent.style.width += xDiff;
        updateItem.position.x = 0;
      }

      if (updateItem.position.y < 0) {
        const yDiff = Math.abs(updateItem.position.y);
        parent.position.y = parent.position.y - yDiff;
        parent.style.height += yDiff;
        updateItem.position.y = 0;
      }

      parent.width = parent.style.width;
      parent.height = parent.style.height;
    }
  }
}

function applyChanges(changes: any[], elements: any[]): any[] {
  // we need this hack to handle the setNodes and setEdges function of the useReactFlow hook for controlled flows
  if (changes.some((c) => c.type === 'reset')) {
    return changes.filter((c) => c.type === 'reset').map((c) => c.item);
  }
  const initElements: any[] = changes.filter((c) => c.type === 'add').map((c) => c.item);

  return elements.reduce((res: any[], item: any) => {
    const currentChanges = changes.filter((c) => c.id === item.id);

    if (currentChanges.length === 0) {
      res.push(item);
      return res;
    }

    const updateItem = { ...item };

    for (const currentChange of currentChanges) {
      if (currentChange) {
        switch (currentChange.type) {
          case 'select': {
            updateItem.selected = currentChange.selected;
            break;
          }
          case 'position': {
            if (typeof currentChange.position !== 'undefined') {
              updateItem.position = currentChange.position;
            }

            if (typeof currentChange.positionAbsolute !== 'undefined') {
              updateItem.positionAbsolute = currentChange.positionAbsolute;
            }

            if (typeof currentChange.dragging !== 'undefined') {
              updateItem.dragging = currentChange.dragging;
            }

            if (updateItem.expandParent) {
              handleParentExpand(res, updateItem);
            }
            break;
          }
          case 'dimensions': {
            if (typeof currentChange.dimensions !== 'undefined') {
              updateItem.width = currentChange.dimensions.width;
              updateItem.height = currentChange.dimensions.height;
            }

            if (typeof currentChange.updateStyle !== 'undefined') {
              updateItem.style = { ...(updateItem.style || {}), ...currentChange.dimensions };
            }

            if (typeof currentChange.resizing === 'boolean') {
              updateItem.resizing = currentChange.resizing;
            }

            if (updateItem.expandParent) {
              handleParentExpand(res, updateItem);
            }
            break;
          }
          case 'remove': {
            return res;
          }
        }
      }
    }

    res.push(updateItem);
    return res;
  }, initElements);
}

export function applyNodeChanges<NodeData = any>(changes: NodeChange[], nodes: Node<NodeData>[]): Node<NodeData>[] {
  return applyChanges(changes, nodes) as Node<NodeData>[];
}

export function applyEdgeChanges<EdgeData = any>(changes: EdgeChange[], edges: Edge<EdgeData>[]): Edge<EdgeData>[] {
  return applyChanges(changes, edges) as Edge<EdgeData>[];
}

export const createSelectionChange = (id: string, selected: boolean) => ({
  id,
  type: 'select',
  selected,
});

export function getSelectionChanges(items: any[], selectedIds: string[]) {
  return items.reduce((res, item) => {
    const willBeSelected = selectedIds.includes(item.id);

    if (!item.selected && willBeSelected) {
      item.selected = true;
      res.push(createSelectionChange(item.id, true));
    } else if (item.selected && !willBeSelected) {
      item.selected = false;
      res.push(createSelectionChange(item.id, false));
    }

    return res;
  }, []);
}
