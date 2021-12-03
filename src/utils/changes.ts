import { Node, Edge, EdgeChange, NodeChange } from '../types';

function applyChanges(changes: NodeChange[] | EdgeChange[], elements: any[]): any[] {
  const initElements: any[] = [];

  return elements.reduce((res: any[], item: any) => {
    const currentChange = changes.find((c) => c.id === item.id);

    if (currentChange) {
      switch (currentChange.type) {
        case 'select': {
          res.push({ ...item, selected: currentChange.selected });
          return res;
        }
        case 'dimensions': {
          const updateItem = { ...item };

          if (typeof currentChange.dimensions !== 'undefined') {
            updateItem.width = currentChange.dimensions.width;
            updateItem.height = currentChange.dimensions.height;
          }

          if (typeof currentChange.position !== 'undefined') {
            updateItem.position = currentChange.position;
          }

          if (typeof currentChange.dragging !== 'undefined') {
            updateItem.dragging = currentChange.dragging;
          }

          res.push(updateItem);
          return res;
        }
        case 'remove': {
          return res;
        }
      }
    }

    res.push(item);
    return res;
  }, initElements);
}

export function applyNodeChanges(changes: NodeChange[], nodes: Node[]): Node[] {
  return applyChanges(changes, nodes) as Node[];
}

export function applyEdgeChanges(changes: EdgeChange[], edges: Edge[]): Edge[] {
  return applyChanges(changes, edges) as Edge[];
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
