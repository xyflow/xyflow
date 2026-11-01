import { describe, expect, it, vi } from 'vitest';

import type { ConnectionLookup, EdgeBase, EdgeLookup } from '../types';
import { areConnectionMapsEqual, handleConnectionChange } from './connections';
import { updateConnectionLookup } from './store';

const edge = (id: string, target: string): EdgeBase => ({
  id,
  source: 'a',
  sourceHandle: 'out',
  target,
  targetHandle: 'in',
});

function createLookup(edges: EdgeBase[]) {
  const connections: ConnectionLookup = new Map();
  const edgesById: EdgeLookup = new Map();
  updateConnectionLookup(connections, edgesById, edges);
  return { connections, edgesById };
}

describe('connection lookup snapshots', () => {
  it('preserves previous node, type and handle snapshots when adding or removing a connection', () => {
    const first = edge('ab', 'b');
    const second = edge('ac', 'c');
    const { connections, edgesById } = createLookup([first]);
    const keys = ['a', 'a-source', 'a-source-out'];
    const previous = keys.map((key) => connections.get(key));
    const unchanged = connections.get('b');

    updateConnectionLookup(connections, edgesById, [first, second]);
    for (const [index, key] of keys.entries()) {
      expect(previous[index]?.size).toBe(1);
      expect(connections.get(key)?.size).toBe(2);
      expect(areConnectionMapsEqual(previous[index], connections.get(key))).toBe(false);
    }
    expect(connections.get('b')).toBe(unchanged);

    const beforeRemoval = connections.get('a');
    updateConnectionLookup(connections, edgesById, [second]);
    expect(beforeRemoval?.size).toBe(2);
    expect(connections.get('a')?.size).toBe(1);

    const last = connections.get('a');
    updateConnectionLookup(connections, edgesById, []);
    expect(last?.size).toBe(1);
    expect(connections.size).toBe(0);
  });

  it('reuses all connection maps for data, style and selection changes', () => {
    const first = edge('ab', 'b');
    const { connections, edgesById } = createLookup([first]);
    const previous = new Map(connections);
    const updated = { ...first, selected: true, data: { label: 'updated' } };

    expect(updateConnectionLookup(connections, edgesById, [updated]).updatedEdges).toEqual(new Set(['ab']));
    for (const [key, snapshot] of previous) {
      expect(connections.get(key)).toBe(snapshot);
    }
    expect(edgesById.get('ab')).toBe(updated);
  });

  it('keeps a replacement edge with the same endpoints and reports its new id', () => {
    const { connections, edgesById } = createLookup([edge('old', 'b')]);
    const previous = connections.get('a')!;
    updateConnectionLookup(connections, edgesById, [edge('new', 'b')]);
    const next = connections.get('a')!;

    expect([...next.values()].map((connection) => connection.edgeId)).toEqual(['new']);
    expect(areConnectionMapsEqual(previous, next)).toBe(false);
    const connected = vi.fn();
    const disconnected = vi.fn();
    handleConnectionChange(next, previous, connected);
    handleConnectionChange(previous, next, disconnected);
    expect(connected).toHaveBeenCalledWith([expect.objectContaining({ edgeId: 'new' })]);
    expect(disconnected).toHaveBeenCalledWith([expect.objectContaining({ edgeId: 'old' })]);
  });

  it("removes all old connections before reconnecting edges to each other's endpoints", () => {
    const { connections, edgesById } = createLookup([edge('first', 'b'), edge('second', 'c')]);
    updateConnectionLookup(connections, edgesById, [edge('first', 'c'), edge('second', 'b')]);

    expect([...connections.get('a')!.values()].map(({ edgeId, target }) => [edgeId, target])).toEqual([
      ['first', 'c'],
      ['second', 'b'],
    ]);
    expect([...connections.get('b')!.values()][0].edgeId).toBe('second');
    expect([...connections.get('c')!.values()][0].edgeId).toBe('first');
  });
});
