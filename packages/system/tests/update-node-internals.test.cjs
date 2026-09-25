'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');

class DOMMatrixReadOnly {
  constructor(transform) {
    const match = /scale\(([^)]+)\)/.exec(transform || '');
    this.m22 = match ? Number.parseFloat(match[1]) : 1;
  }
}

global.window = {
  getComputedStyle(element) {
    return { transform: element.style?.transform || 'none' };
  },
  DOMMatrixReadOnly,
};

const { updateNodeInternals, adoptUserNodes } = require('../dist/umd/index.js');

function measureHandleBounds({
  viewportScale = 1,
  paneOffsetWidth = 400,
  paneBoundingWidth = 400,
  nodeScreen = { left: 0, top: 0, width: 100, height: 50 },
  handleScreen = { left: 90, top: 20, width: 10, height: 10 },
} = {}) {
  const nodeLookup = new Map();
  const parentLookup = new Map();
  adoptUserNodes(
    [{ id: 'n', data: { label: 'n' }, position: { x: 0, y: 0 }, measured: { width: 100, height: 50 } }],
    nodeLookup,
    parentLookup
  );

  const handle = {
    offsetWidth: 10,
    offsetHeight: 10,
    getBoundingClientRect: () => handleScreen,
    getAttribute: (name) => (name === 'data-handleid' ? 's' : 'right'),
  };

  const nodeElement = {
    offsetWidth: 100,
    offsetHeight: 50,
    getBoundingClientRect: () => nodeScreen,
    querySelectorAll: (selector) => (String(selector).includes('source') ? [handle] : []),
  };

  const viewportNode = {
    style: { transform: `translate(0px, 0px) scale(${viewportScale})` },
  };

  const domNode = {
    offsetWidth: paneOffsetWidth,
    getBoundingClientRect: () => ({ width: paneBoundingWidth, height: 300 }),
    querySelector: (selector) => (selector === '.xyflow__viewport' ? viewportNode : null),
  };

  updateNodeInternals(
    new Map([['n', { id: 'n', nodeElement, force: true }]]),
    nodeLookup,
    parentLookup,
    domNode,
    [0, 0]
  );

  return nodeLookup.get('n')?.internals.handleBounds?.source?.[0];
}

test('keeps unscaled handle offsets when ancestor scale is 1', () => {
  const source = measureHandleBounds();

  assert.equal(source.x, 90);
  assert.equal(source.y, 20);
});

test('divides screen offsets by viewport zoom times ancestor scale', () => {
  // 600 / 400 = 1.5 ancestor scale; screen offset is 1.5× layout offset (90, 20)
  const source = measureHandleBounds({
    paneOffsetWidth: 400,
    paneBoundingWidth: 600,
    nodeScreen: { left: 0, top: 0, width: 150, height: 75 },
    handleScreen: { left: 135, top: 30, width: 15, height: 15 },
  });

  assert.equal(source.x, 90);
  assert.equal(source.y, 20);
});

test('composes viewport zoom with ancestor scale', () => {
  // viewport 0.5 × ancestor 2 = handleZoom 1; combined screen scale is 1
  const source = measureHandleBounds({
    viewportScale: 0.5,
    paneOffsetWidth: 400,
    paneBoundingWidth: 800,
    nodeScreen: { left: 0, top: 0, width: 100, height: 50 },
    handleScreen: { left: 90, top: 20, width: 10, height: 10 },
  });

  assert.equal(source.x, 90);
  assert.equal(source.y, 20);
});

test('treats a zero-width bounding rect as ancestor scale 1', () => {
  const source = measureHandleBounds({
    paneOffsetWidth: 400,
    paneBoundingWidth: 0,
  });

  assert.equal(source.x, 90);
  assert.equal(source.y, 20);
  assert.equal(Number.isFinite(source.x), true);
  assert.equal(Number.isFinite(source.y), true);
});

test('treats a zero offsetWidth as ancestor scale 1', () => {
  const source = measureHandleBounds({
    paneOffsetWidth: 0,
    paneBoundingWidth: 600,
  });

  assert.equal(source.x, 90);
  assert.equal(source.y, 20);
  assert.equal(Number.isFinite(source.x), true);
  assert.equal(Number.isFinite(source.y), true);
});
