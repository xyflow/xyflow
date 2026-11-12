import type { Dimensions, XYPosition } from '../types';
import type {
  AddChange,
  DataChange,
  DimensionChange,
  PositionChange,
  RemoveChange,
  ReplaceChange,
  SelectionChange,
  UpdateChange,
} from './types';

export function selectionChange(id: string, selected: boolean): SelectionChange {
  return {
    id,
    type: 'select',
    selected,
  };
}

export function positionChange(id: string, position: XYPosition): PositionChange {
  return {
    id,
    type: 'position',
    position,
  };
}

export function dimensionChange(id: string, dimensions: Dimensions): DimensionChange {
  return {
    id,
    type: 'dimensions',
    dimensions,
  };
}

export function removeChange(id: string): RemoveChange {
  return {
    id,
    type: 'remove',
  };
}

export function addChange<T extends { id: string }>(item: T): AddChange<T> {
  return {
    id: item.id,
    item: item,
    type: 'add',
  };
}

export function replaceChange<T extends { id: string }>(item: T): ReplaceChange<T> {
  return {
    id: item.id,
    item: item,
    type: 'replace',
  };
}

export function updateChange<T extends { id: string }>(id: string, item: Partial<T>): UpdateChange<T> {
  return {
    id,
    item,
    type: 'update',
  };
}

export function dataChange<Data = Record<string, unknown>>(id: string, data: Data, replace: true): DataChange<Data>;
export function dataChange<Data = Record<string, unknown>>(
  id: string,
  data: Partial<Data>,
  replace?: false
): DataChange<Data>;
export function dataChange<Data = Record<string, unknown>>(
  id: string,
  data: Partial<Data>,
  replace?: boolean
): DataChange<Data> {
  return (replace ? { id, type: 'data', data, replace } : { id, type: 'data', data }) as DataChange<Data>;
}
