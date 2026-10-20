import { describe, it, expect } from 'vitest';

import { type NodeBase } from '../types/nodes';
import { NodeChangeset } from './index';
import { addChange, removeChange } from './create';

describe('changeset', () => {
  it('adds two nodes', () => {
    const changes = new NodeChangeset();

    const node1 = addChange({ id: 'node-1', data: { label: 'Node 1' }, position: { x: 0, y: 0 } });
    changes.add(node1);

    const node2 = addChange({ id: 'node-2', data: { label: 'Node 2' }, position: { x: 0, y: 0 } });
    changes.add(node2);

    const nodes: NodeBase[] = [];

    const nextNodes = changes.applyTo(nodes);

    expect(changes.toArray()).toHaveLength(2);
    expect(nextNodes).toHaveLength(2);
  });

  it('removes a node', () => {
    const changes = new NodeChangeset();

    const node2 = removeChange('node-1');
    changes.add(node2);

    const nodes: NodeBase[] = [
      { id: 'node-1', data: { label: 'Node 1' }, position: { x: 0, y: 0 } },
      { id: 'node-2', data: { label: 'Node 2' }, position: { x: 0, y: 0 } },
    ];

    const nextNodes = changes.applyTo(nodes);

    expect(changes.toArray()).toHaveLength(1);
    expect(nextNodes).toHaveLength(1);
  });

  it('clears all changes', () => {
    const changes = new NodeChangeset();

    changes.add(addChange({ id: 'node-1', data: { label: 'Node 1' }, position: { x: 0, y: 0 } }));
    changes.add(removeChange('node-2'));

    expect(changes.isEmpty()).toBe(false);

    changes.clear();

    expect(changes.isEmpty()).toBe(true);
    expect(changes.size).toBe(0);
    expect(changes.toArray()).toHaveLength(0);
    expect(changes.getByType('add')).toHaveLength(0);
    expect(changes.getByType('remove')).toHaveLength(0);
  });

  it('is empty after removing the last change', () => {
    const changes = new NodeChangeset();
    expect(changes.isEmpty()).toBe(true);

    const change1 = removeChange('node-1');
    const change2 = removeChange('node-1');
    changes.add([change1, change2]);

    changes.remove(change1);
    expect(changes.isEmpty()).toBe(false);

    changes.remove(change2);
    expect(changes.isEmpty()).toBe(true);
  });
});
