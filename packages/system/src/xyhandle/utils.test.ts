import { describe, expect, it } from 'vitest';

import { ConnectionMode, Position, type InternalNodeBase, type NodeBase, type NodeLookup } from '../types';
import { adoptUserNodes } from '../utils/store';
import { getHandle } from './utils';

type UserHandle = NonNullable<NodeBase['handles']>[number];

const targetTop: UserHandle = { type: 'target', position: Position.Top, x: 48, y: 0, width: 4, height: 4 };
const sourceBottom: UserHandle = { type: 'source', position: Position.Bottom, x: 48, y: 36, width: 4, height: 4 };

function createNodeLookup(handles: UserHandle[]): NodeLookup {
  const nodeLookup: NodeLookup = new Map<string, InternalNodeBase>();
  const node: NodeBase = { id: 'node', data: {}, position: { x: 0, y: 0 }, width: 100, height: 40, handles };

  adoptUserNodes([node], nodeLookup, new Map());

  return nodeLookup;
}

describe('getHandle', () => {
  describe('in loose connection mode', () => {
    it('returns the target handle when a source and a target handle both have no id', () => {
      // same handle layout as the built-in default node
      const nodeLookup = createNodeLookup([targetTop, sourceBottom]);
      const handle = getHandle('node', 'target', null, nodeLookup, ConnectionMode.Loose);

      expect(handle).toMatchObject({ type: 'target', position: Position.Top });
    });

    it('returns the target handle when a source and a target handle share the same id', () => {
      const nodeLookup = createNodeLookup([
        { ...targetTop, id: 'a' },
        { ...sourceBottom, id: 'a' },
      ]);
      const handle = getHandle('node', 'target', 'a', nodeLookup, ConnectionMode.Loose);

      expect(handle).toMatchObject({ type: 'target', position: Position.Top });
    });

    it('returns the source handle when a source and a target handle both have no id', () => {
      const nodeLookup = createNodeLookup([targetTop, sourceBottom]);
      const handle = getHandle('node', 'source', null, nodeLookup, ConnectionMode.Loose);

      expect(handle).toMatchObject({ type: 'source', position: Position.Bottom });
    });

    it('falls back to a handle of the other type when only that one matches the id', () => {
      const nodeLookup = createNodeLookup([
        { ...targetTop, id: 'in' },
        { ...sourceBottom, id: 'out' },
      ]);

      expect(getHandle('node', 'target', 'out', nodeLookup, ConnectionMode.Loose)).toMatchObject({ type: 'source' });
      expect(getHandle('node', 'source', 'in', nodeLookup, ConnectionMode.Loose)).toMatchObject({ type: 'target' });
    });

    it('falls back to a handle of the other type when the node has no handle of the requested type', () => {
      const nodeLookup = createNodeLookup([sourceBottom]);
      const handle = getHandle('node', 'target', null, nodeLookup, ConnectionMode.Loose);

      expect(handle).toMatchObject({ type: 'source', position: Position.Bottom });
    });
  });

  describe('in strict connection mode', () => {
    it('only returns handles of the requested type', () => {
      const nodeLookup = createNodeLookup([
        { ...targetTop, id: 'in' },
        { ...sourceBottom, id: 'out' },
      ]);

      expect(getHandle('node', 'target', 'in', nodeLookup, ConnectionMode.Strict)).toMatchObject({ type: 'target' });
      expect(getHandle('node', 'target', 'out', nodeLookup, ConnectionMode.Strict)).toBeNull();
    });
  });
});
