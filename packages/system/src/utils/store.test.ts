import { describe, expect, it } from 'vitest';

import { NodeChangeset } from '../changes';
import { positionChange } from '../changes/create';
import type { NodeBase, NodeLookup, NodeOrigin, ParentLookup, Rect } from '../types';
import { nodeToRect } from './general';
import { adoptUserNodes, handleExpandParent } from './store';

function setup(origin: NodeOrigin, expand = true) {
  const make = (id: string, x: number, y: number, width: number, height: number, parentId?: string): NodeBase => ({
    id,
    data: {},
    position: { x: x + width * origin[0], y: y + height * origin[1] },
    width,
    height,
    measured: { width, height },
    parentId,
    expandParent: id === 'child' || (id === 'parent' && expand),
  });
  let nodes = [
    make('outer', 100, 100, 300, 300),
    make('parent', 50, 50, 150, 150, 'outer'),
    make('child', 40, 40, 40, 40, 'parent'),
    make('outer-sibling', 15, 15, 20, 20, 'outer'),
    make('inner-sibling', 10, 10, 20, 20, 'parent'),
  ];
  const lookup: NodeLookup = new Map();
  const parents: ParentLookup = new Map();
  const adopt = () => adoptUserNodes(nodes, lookup, parents, { nodeOrigin: origin });
  adopt();
  const rect = (id: string) => nodeToRect(lookup.get(id)!);
  const move = (target: Rect) => {
    const parent = rect('parent');
    const changes = [
      positionChange('child', {
        x: target.x - parent.x + target.width * origin[0],
        y: target.y - parent.y + target.height * origin[1],
      }),
      ...handleExpandParent([{ id: 'child', parentId: 'parent', rect: target }], lookup, parents, origin),
    ];
    nodes = new NodeChangeset(changes).applyTo(nodes);
    adopt();
  };
  return { rect, move };
}

function encloses(parent: Rect, child: Rect) {
  expect(parent.x).toBeLessThanOrEqual(child.x);
  expect(parent.y).toBeLessThanOrEqual(child.y);
  expect(parent.x + parent.width).toBeGreaterThanOrEqual(child.x + child.width);
  expect(parent.y + parent.height).toBeGreaterThanOrEqual(child.y + child.height);
}

describe('handleExpandParent', () => {
  for (const origin of [
    [0, 0],
    [0.5, 0.5],
    [0.2, 0.8],
  ] as NodeOrigin[]) {
    for (const target of [
      { x: 450, y: 460, width: 40, height: 40 },
      { x: 70, y: 60, width: 40, height: 40 },
    ]) {
      it(`expands opted-in ancestors without moving siblings (origin ${origin.join(',')}, target ${target.x})`, () => {
        const { rect, move } = setup(origin);
        const innerSibling = rect('inner-sibling');
        const outerSibling = rect('outer-sibling');
        move(target);
        expect(rect('child')).toEqual(target);
        encloses(rect('parent'), target);
        encloses(rect('outer'), rect('parent'));
        expect(rect('inner-sibling')).toEqual(innerSibling);
        expect(rect('outer-sibling')).toEqual(outerSibling);
        const parent = rect('parent');
        const outer = rect('outer');
        // Returning inside the expanded bounds must not shrink the groups.
        move({ x: 190, y: 190, width: 40, height: 40 });
        expect(rect('parent')).toEqual(parent);
        expect(rect('outer')).toEqual(outer);
        expect(rect('inner-sibling')).toEqual(innerSibling);
        expect(rect('outer-sibling')).toEqual(outerSibling);
      });
    }
  }

  it('stops at an ancestor that did not opt in to expansion', () => {
    const { rect, move } = setup([0, 0], false);
    const outer = rect('outer');
    const target = { x: 450, y: 460, width: 40, height: 40 };
    move(target);
    encloses(rect('parent'), target);
    expect(rect('outer')).toEqual(outer);
  });
});
