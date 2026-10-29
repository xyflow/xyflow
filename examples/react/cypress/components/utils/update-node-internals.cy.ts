import {
  updateNodeInternals,
  adoptUserNodes,
  type InternalNodeUpdate,
  type NodeLookup,
  type ParentLookup,
} from '@xyflow/system';
import type { Node } from '@xyflow/react';

function measureHandleBounds({
  ancestorTransform,
  ancestorZoom,
  viewportScale = 1,
  mockPaneRect,
  mockOffsetWidth,
}: {
  ancestorTransform?: string;
  ancestorZoom?: string;
  viewportScale?: number;
  mockPaneRect?: DOMRect;
  mockOffsetWidth?: number;
}) {
  const nodeLookup: NodeLookup = new Map();
  const parentLookup: ParentLookup = new Map();
  const node: Node = {
    id: 'n',
    data: { label: 'n' },
    position: { x: 0, y: 0 },
    measured: { width: 100, height: 50 },
  };
  adoptUserNodes([node], nodeLookup, parentLookup);

  const ancestor = document.createElement('div');
  if (ancestorTransform) {
    ancestor.style.transform = ancestorTransform;
    ancestor.style.transformOrigin = '0 0';
  }
  if (ancestorZoom) {
    ancestor.style.setProperty('zoom', ancestorZoom);
  }

  const domNode = document.createElement('div');
  domNode.style.width = '400px';
  domNode.style.height = '300px';

  const viewport = document.createElement('div');
  viewport.className = 'xyflow__viewport';
  viewport.style.transform = `translate(0px, 0px) scale(${viewportScale})`;

  const nodeElement = document.createElement('div');
  nodeElement.style.cssText = 'position:relative;width:100px;height:50px;';

  const handle = document.createElement('div');
  handle.className = 'source';
  handle.setAttribute('data-handleid', 's');
  handle.setAttribute('data-handlepos', 'right');
  handle.style.cssText = 'position:absolute;left:90px;top:20px;width:10px;height:10px;';

  nodeElement.appendChild(handle);
  viewport.appendChild(nodeElement);
  domNode.appendChild(viewport);
  ancestor.appendChild(domNode);
  document.body.appendChild(ancestor);

  if (mockPaneRect) {
    domNode.getBoundingClientRect = () => mockPaneRect;
  }
  if (mockOffsetWidth !== undefined) {
    Object.defineProperty(domNode, 'offsetWidth', { configurable: true, get: () => mockOffsetWidth });
  }

  updateNodeInternals(
    new Map<string, InternalNodeUpdate>([['n', { id: 'n', nodeElement, force: true }]]),
    nodeLookup,
    parentLookup,
    domNode,
    [0, 0]
  );

  const source = nodeLookup.get('n')?.internals.handleBounds?.source?.[0];
  ancestor.remove();

  return source;
}

// Regression test for https://github.com/xyflow/xyflow/issues/5835
// When a node references a `parentId` that is absent from `nodeLookup` (for
// example the parent was removed while the child's ResizeObserver still fires),
// `updateNodeInternals` used to call `clampPositionToParent(..., nodeLookup.get(parentId)!)`
// with an `undefined` parent and crash with
// `TypeError: Cannot read properties of undefined (reading 'measured')`.
describe('updateNodeInternals with a missing parent', () => {
  it('does not crash when a node parent is absent from nodeLookup', () => {
    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();

    // A child whose parent ("missing-parent") is never added to the lookup.
    const child: Node = {
      id: 'child',
      data: { label: 'child' },
      position: { x: 0, y: 0 },
      parentId: 'missing-parent',
      extent: 'parent',
      measured: { width: 50, height: 50 },
    };
    adoptUserNodes([child], nodeLookup, parentLookup);

    // Minimal flow DOM so `updateNodeInternals` does not bail out early on the
    // missing `.xyflow__viewport` and reads a real zoom from the transform.
    const domNode = document.createElement('div');
    const viewport = document.createElement('div');
    viewport.className = 'xyflow__viewport';
    viewport.style.transform = 'translate(0px, 0px) scale(1)';
    domNode.appendChild(viewport);
    document.body.appendChild(domNode);

    const nodeElement = document.createElement('div');
    nodeElement.style.width = '50px';
    nodeElement.style.height = '50px';
    document.body.appendChild(nodeElement);

    const updates = new Map<string, InternalNodeUpdate>([['child', { id: 'child', nodeElement, force: true }]]);

    expect(() => updateNodeInternals(updates, nodeLookup, parentLookup, domNode, [0, 0])).to.not.throw();

    domNode.remove();
    nodeElement.remove();
  });
});

// Regression test for https://github.com/xyflow/xyflow/issues/6023
// getBoundingClientRect() includes ancestor CSS transform/zoom, while
// node sizes use offsetWidth. Dividing handle offsets by viewport zoom
// alone leaves ancestorScale * offset, so edges miss their handles.
describe('updateNodeInternals handle bounds with ancestor scale', () => {
  it('keeps unscaled handle offsets when there is no ancestor transform', () => {
    const source = measureHandleBounds({});

    expect(source?.x).to.be.closeTo(90, 1);
    expect(source?.y).to.be.closeTo(20, 1);
  });

  it('does not inflate handle offsets when the flow sits in a CSS-scaled ancestor', () => {
    const source = measureHandleBounds({ ancestorTransform: 'scale(2)' });

    expect(source?.x).to.be.closeTo(90, 1);
    expect(source?.y).to.be.closeTo(20, 1);
  });

  it('composes viewport zoom with ancestor scale', () => {
    const source = measureHandleBounds({
      ancestorTransform: 'scale(2)',
      viewportScale: 0.5,
    });

    expect(source?.x).to.be.closeTo(90, 1);
    expect(source?.y).to.be.closeTo(20, 1);
  });

  it('does not inflate handle offsets under CSS zoom on an ancestor', () => {
    const source = measureHandleBounds({ ancestorZoom: '1.5' });

    expect(source?.x).to.be.closeTo(90, 1);
    expect(source?.y).to.be.closeTo(20, 1);
  });

  it('treats a zero-width bounding rect as ancestor scale 1', () => {
    const source = measureHandleBounds({
      mockPaneRect: new DOMRect(0, 0, 0, 0),
    });

    expect(source?.x).to.be.closeTo(90, 1);
    expect(source?.y).to.be.closeTo(20, 1);
    expect(Number.isFinite(source?.x)).to.equal(true);
    expect(Number.isFinite(source?.y)).to.equal(true);
  });

  it('treats a zero offsetWidth as ancestor scale 1', () => {
    const source = measureHandleBounds({ mockOffsetWidth: 0 });

    expect(source?.x).to.be.closeTo(90, 1);
    expect(source?.y).to.be.closeTo(20, 1);
    expect(Number.isFinite(source?.x)).to.equal(true);
    expect(Number.isFinite(source?.y)).to.equal(true);
  });

  it('divides mocked screen offsets by viewport zoom times ancestor scale', () => {
    // pane offsetWidth is 400; a 600px bounding width is ancestorScale 1.5
    const nodeLookup: NodeLookup = new Map();
    const parentLookup: ParentLookup = new Map();
    const node: Node = {
      id: 'n',
      data: { label: 'n' },
      position: { x: 0, y: 0 },
      measured: { width: 100, height: 50 },
    };
    adoptUserNodes([node], nodeLookup, parentLookup);

    const domNode = document.createElement('div');
    domNode.style.width = '400px';
    const viewport = document.createElement('div');
    viewport.className = 'xyflow__viewport';
    viewport.style.transform = 'translate(0px, 0px) scale(1)';
    const nodeElement = document.createElement('div');
    nodeElement.style.cssText = 'width:100px;height:50px;';
    const handle = document.createElement('div');
    handle.className = 'source';
    handle.setAttribute('data-handleid', 's');
    handle.setAttribute('data-handlepos', 'right');
    handle.style.cssText = 'width:10px;height:10px;';
    nodeElement.appendChild(handle);
    domNode.appendChild(viewport);
    document.body.appendChild(domNode);
    document.body.appendChild(nodeElement);

    // Screen-space handle offset is 1.5× the layout offset (90, 20).
    domNode.getBoundingClientRect = () => new DOMRect(0, 0, 600, 450);
    nodeElement.getBoundingClientRect = () => new DOMRect(0, 0, 150, 75);
    handle.getBoundingClientRect = () => new DOMRect(135, 30, 15, 15);

    updateNodeInternals(
      new Map<string, InternalNodeUpdate>([['n', { id: 'n', nodeElement, force: true }]]),
      nodeLookup,
      parentLookup,
      domNode,
      [0, 0]
    );

    const source = nodeLookup.get('n')?.internals.handleBounds?.source?.[0];
    expect(source?.x).to.equal(90);
    expect(source?.y).to.equal(20);

    domNode.remove();
    nodeElement.remove();
  });
});
