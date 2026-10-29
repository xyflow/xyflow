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
});
