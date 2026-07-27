import type { Edge, Node } from '../types';
import type { EdgeChange, ElementChangeType, NodeChange } from './types';

import { applyEdgeChanges, applyNodeChanges } from './apply';

/** Helper to narrow down the type of a change based on it's name */
type ChangeOfType<ChangeType extends { type: string }, T extends ChangeType['type']> = Extract<
  ChangeType,
  { type: T }
>;

/** Generic apply changes function that works for both nodes and changes */
type ApplyChangesFn<
  ElementType extends Node | Edge,
  ChangeType extends ElementChangeType<ElementType>
> = (elements: ElementType[], changes: ElementChanges<ElementType, ChangeType>) => ElementType[];

/**
 * Tracks element changes for easy access and modification.
 * Prevents mistakes: You can't add elements that exist and
 * can't remove or change elements that don't exist.
 * TODO: upsert?
 * TODO: automatically minify changes?
 * TODO: warn if something is invalid? (it was just ignored before when applying)
 * TODO: include a way to split ephemeral dimension changes to split
 *
 * @example
 * ```ts
 * const changes = new NodeChanges();
 * changes.add({ id: '1', type: 'position', position: { x: 10, y: 20 } });
 * const nextNodes = changes.applyTo(nodes);
 * ```
 */
export class ElementChanges<
  ElementType extends Node | Edge,
  ChangeType extends ElementChangeType<ElementType>
> {
  private changeTypes: Partial<Record<ChangeType['type'], boolean>> = {};
  private changes: Map<string, ChangeType[]> = new Map();
  private newElementIds: Set<string> = new Set();

  constructor(private applyChanges: ApplyChangesFn<ElementType, ChangeType>) {}

  /**
   * Queues a change for an element.
   *
   * @example
   * ```ts
   * // TODO: maybe use examples with helper function
   * changes.add({ id: '1', type: 'select', selected: true });
   * changes.add({ id: '1', type: 'position', position: { x: 0, y: 0 } });
   * ```
   */
  add(change: ChangeType | ChangeType[]): void {
    const newChanges = Array.isArray(change) ? change : [change];
    for (const change of newChanges) {
      this.changeTypes[change.type as ChangeType['type']] = true;
      if (change.type === 'add') {
        this.newElementIds.add(change.id);
      }
      const elementChanges = this.changes.get(change.id);
      if (elementChanges) {
        // 'remove' and 'add' (in that order) should always be in front
        if (
          change.type === 'remove' ||
          (change.type === 'add' && elementChanges[0]?.type !== 'remove')
        ) {
          // we want "add" changes to be in the front
          elementChanges.unshift(change);
        } else {
          elementChanges.push(change);
        }
      } else {
        this.changes.set(change.id, [change]);
      }
    }
  }

  /**
   * Removes a specific change by object reference
   *
   * @example
   * ```ts
   * const change = { id: '1', type: 'select', selected: true };
   * changes.add(change);
   * changes.remove(change);
   * ```
   */
  remove(change: ChangeType): void {
    const elementChanges = this.changes.get(change.id);
    if (!elementChanges) {
      // TODO: change not found, warn?
      return;
    }

    if (elementChanges.length === 1) {
      this.changes.delete(change.id);
      return;
    }

    const index = elementChanges.indexOf(change);
    if (index < 0) {
      // TODO: change not found, warn?
      return;
    }

    // swap the change with the last one & pop
    elementChanges[index] = elementChanges[elementChanges.length - 1];
    elementChanges.pop();
  }

  /**
   * Returns all queued changes for an element.
   *
   * @example
   * ```ts
   * const elementChanges = changes.getForElement('1');
   * ```
   */
  getForElement(elementId: string): ChangeType[] {
    return this.changes.get(elementId) || [];
  }

  /**
   * Clears every change for an element.
   *
   * @example
   * ```ts
   * changes.removeForElement('1');
   * ```
   */
  removeForElement(elementId: string): void {
    this.changes.delete(elementId);
  }

  /**
   * Iterates over all queued changes.
   *
   * @example
   * ```ts
   * for (const change of changes.all()) {
   *   console.log(change.type, change.id);
   * }
   * ```
   */
  *all() {
    for (const elementChanges of this.changes.values()) {
      yield* elementChanges;
    }
  }

  /**
   * Returns all queued changes as a flat array.
   *
   * @example
   * ```ts
   * const list = changes.toArray();
   * ```
   */
  toArray() {
    const array: ChangeType[] = [];
    for (const elementChanges of this.changes.values()) {
      for (const change of elementChanges) {
        array.push(change);
      }
    }
    return array;
  }

  /**
   * Returns all changes of a given type (e.g. `'position'`, `'select'`).
   *
   * @example
   * ```ts
   * const positionChanges = changes.getByType('position');
   * ```
   */
  // TODO: support filtering for multiple types at once?
  getByType<T extends ChangeType['type']>(changeType: T): ChangeOfType<ChangeType, T>[] {
    if (this.changeTypes[changeType]) {
      const changesOfType: ChangeOfType<ChangeType, T>[] = [];

      // Optimized path for add changes
      if (changeType === 'add') {
        for (const elementId of this.newElementIds) {
          const elementChanges = this.changes.get(elementId);
          // We made sure that first change is an add change
          // TODO: double check? Possible to add remove before add
          if (elementChanges?.[0])
            changesOfType.push(elementChanges[0] as ChangeOfType<ChangeType, T>);
        }
        return changesOfType;
      }

      for (const elementChanges of this.changes.values()) {
        for (const change of elementChanges) {
          if (change.type === changeType) {
            changesOfType.push(change as ChangeOfType<ChangeType, T>);
          }
        }
      }
      return changesOfType;
    }
    return [];
  }

  /**
   * Applies the queued changes to an elements array and returns the result.
   *
   * @example
   * ```ts
   * const nextElements = changes.applyTo(elements);
   * ```
   */
  applyTo(elements: ElementType[]): ElementType[] {
    return this.applyChanges(elements, this);
  }
}

/**
 * Tracks node changes for easy access and modification.
 *
 * @example
 * ```ts
 * const changes = new NodeChanges();
 * changes.add({ id: '1', type: 'position', position: { x: 10, y: 20 } });
 * const nextNodes = changes.applyTo(nodes);
 * ```
 */
export class NodeChanges<NodeType extends Node = Node> extends ElementChanges<
  NodeType,
  NodeChange<NodeType>
> {
  constructor() {
    super(applyNodeChanges);
  }

  /**
   * Returns all queued changes for a node.
   *
   * @example
   * ```ts
   * const nodeChanges = changes.getForNode('1');
   * ```
   */
  getForNode(nodeId: string): NodeChange<NodeType>[] {
    return this.getForElement(nodeId);
  }

  /**
   * Clears every change for a node.
   *
   * @example
   * ```ts
   * changes.removeForNode('1');
   * ```
   */
  removeForNode(nodeId: string): void {
    this.removeForElement(nodeId);
  }
}

/**
 * Tracks edge changes for easy access and modification.
 *
 * @example
 * ```ts
 * const changes = new EdgeChanges();
 * changes.add({ id: 'e1', type: 'select', selected: true });
 * const nextEdges = changes.applyTo(edges);
 * ```
 */
export class EdgeChanges<EdgeType extends Edge = Edge> extends ElementChanges<
  EdgeType,
  EdgeChange<EdgeType>
> {
  constructor() {
    super(applyEdgeChanges);
  }

  /**
   * Returns all queued changes for an edge.
   *
   * @example
   * ```ts
   * const edgeChanges = changes.getForEdge('e1');
   * ```
   */
  getForEdge(edgeId: string): EdgeChange<EdgeType>[] {
    return this.getForElement(edgeId);
  }

  /**
   * Clears every change for an edge.
   *
   * @example
   * ```ts
   * changes.removeForEdge('e1');
   * ```
   */
  removeForEdge(edgeId: string): void {
    this.removeForElement(edgeId);
  }
}
