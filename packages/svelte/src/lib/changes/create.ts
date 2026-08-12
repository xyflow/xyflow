import type { Dimensions, XYPosition } from '@xyflow/system';
import type {
  AddChange,
  DimensionChange,
  PositionChange,
  RemoveChange,
  ReplaceChange,
  SelectionChange
} from './types.js';

export function selectionChange(id: string, selected: boolean): SelectionChange {
  return {
    id,
    type: 'select',
    selected
  };
}

export function positionChange(id: string, position: XYPosition): PositionChange {
  return {
    id,
    type: 'position',
    position
  };
}

export function dimensionChange(id: string, dimensions: Dimensions): DimensionChange {
  return {
    id,
    type: 'dimensions',
    dimensions
  };
}

export function removeChange(id: string): RemoveChange {
  return {
    id,
    type: 'remove'
  };
}

export function addChange<T extends { id: string }>(item: T): AddChange<T> {
  return {
    id: item.id,
    item: item,
    type: 'add'
  };
}

export function replaceChange<T extends { id: string }>(item: T): ReplaceChange<T> {
  return {
    id: item.id,
    item: item,
    type: 'replace'
  };
}
