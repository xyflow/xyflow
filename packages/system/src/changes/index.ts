import type { EdgeBase, NodeBase } from '../types';
import type { EdgeChange, ElementChangeType, NodeChange } from './types';

import { applyEdgeChanges, applyNodeChanges } from './apply.js';

/** Helper to narrow down the type of a change based on it's name */
type ChangeOfType<ChangeType extends { type: string }, T extends ChangeType['type']> = Extract<ChangeType, { type: T }>;

/** Generic apply changes function that works for both nodes and changes */
type ApplyChangesFn<ElementType extends NodeBase | EdgeBase, ChangeType extends ElementChangeType<ElementType>> = (
  elements: ElementType[],
  changes: Changeset<ElementType, ChangeType>
) => ElementType[];

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
export class Changeset<ElementType extends NodeBase | EdgeBase, ChangeType extends ElementChangeType<ElementType>> {
  private changeTypes: Partial<Record<ChangeType['type'], boolean>> = {};
  private changeMap: Map<string, ChangeType[]> = new Map();
  /** add changes are tracked separately, there can only be one per element */
  private addChanges: Map<string, ChangeOfType<ChangeType, 'add'>> = new Map();

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
        this.addChanges.set(change.id, change as ChangeOfType<ChangeType, 'add'>);
        continue;
      }
      const changes = this.changeMap.get(change.id);
      if (changes) {
        changes.push(change);
      } else {
        this.changeMap.set(change.id, [change]);
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
    if (change.type === 'add') {
      if (this.addChanges.get(change.id) === change) {
        this.addChanges.delete(change.id);
      }
      return;
    }

    const changes = this.changeMap.get(change.id);
    if (!changes) {
      // TODO: change not found, warn?
      return;
    }

    const index = changes.indexOf(change);
    if (index < 0) {
      // TODO: change not found, warn?
      return;
    }

    if (changes.length === 1) {
      this.changeMap.delete(change.id);
      return;
    }

    changes.splice(index, 1);
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
    return this.changeMap.get(elementId) || [];
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
    this.changeMap.delete(elementId);
    this.addChanges.delete(elementId);
  }

  /**
   * Clears all queued changes.
   *
   * @example
   * ```ts
   * changes.clear();
   * ```
   */
  clear(): void {
    this.changeTypes = {};
    this.changeMap.clear();
    this.addChanges.clear();
  }

  /**
   * Returns true if there are no queued changes.
   *
   * @example
   * ```ts
   * if (changes.isEmpty()) return;
   * ```
   */
  isEmpty(): boolean {
    // entries are deleted as soon as their last change is removed,
    // so the map never holds empty arrays
    return this.changeMap.size === 0 && this.addChanges.size === 0;
  }

  /**
   * Iterates over all queued changes.
   *
   * @example
   * ```ts
   * for (const change of changes) {
   *   console.log(change.type, change.id);
   * }
   * ```
   */
  *[Symbol.iterator](): Iterator<ChangeType> {
    yield* this.addChanges.values();
    for (const changes of this.changeMap.values()) {
      yield* changes;
    }
  }

  /**
   * Returns all elements that are added by this changeset.
   *
   * @example
   * ```ts
   * const newElements = changes.getNewElements();
   * ```
   */
  getNewElements(): ElementType[] {
    const newElements: ElementType[] = [];
    for (const change of this.addChanges.values()) {
      newElements.push(change.item);
    }
    return newElements;
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
    for (const change of this.addChanges.values()) {
      array.push(change);
    }
    for (const changes of this.changeMap.values()) {
      for (const change of changes) {
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
      // Optimized path for add changes
      if (changeType === 'add') {
        return Array.from(this.addChanges.values()) as unknown as ChangeOfType<ChangeType, T>[];
      }

      const changesOfType: ChangeOfType<ChangeType, T>[] = [];
      for (const changes of this.changeMap.values()) {
        for (const change of changes) {
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
export class NodeChangeset<NodeType extends NodeBase = NodeBase> extends Changeset<NodeType, NodeChange<NodeType>> {
  constructor(changes?: NodeChange<NodeType>[]) {
    super(applyNodeChanges);

    if (changes) {
      this.add(changes);
    }
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

  /**
   * Returns all nodes that are added by this changeset.
   *
   * @example
   * ```ts
   * const newNodes = changes.getNewNodes();
   * ```
   */
  getNewNodes(): NodeType[] {
    return this.getNewElements();
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
export class EdgeChangeset<EdgeType extends EdgeBase = EdgeBase> extends Changeset<EdgeType, EdgeChange<EdgeType>> {
  constructor(changes?: EdgeChange<EdgeType>[]) {
    super(applyEdgeChanges);

    if (changes) {
      this.add(changes);
    }
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

  /**
   * Returns all edges that are added by this changeset.
   *
   * @example
   * ```ts
   * const newEdges = changes.getNewEdges();
   * ```
   */
  getNewEdges(): EdgeType[] {
    return this.getNewElements();
  }
}
