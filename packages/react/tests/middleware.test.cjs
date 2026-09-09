const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../..');
const ts = require(root + '/node_modules/typescript');
require.extensions['.ts'] = (mod, filename) =>
  mod._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    filename
  );
const { createStore } = require(root + '/packages/react/src/store/index.ts');
const store = createStore({});
const selector = (s) => Array.from(s.nodeLookup.keys());
const [subscribe, read] = store.subscribeTracked(selector);
assert.deepEqual(read(), []);
let rendered = read();
subscribe(() => {
  rendered = read();
});
store.getState().setNodes([{ id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } }]);
assert.deepEqual(rendered, ['1'], 'visible node IDs must update after setNodes');
console.log('PASS: setNodes updates visible node IDs');

// Measurement updates also mutate a lookup entry before publishing set({}).
const nodeSelector = (s) => s.nodeLookup.get('1').measured?.width;
const [subscribeWidth, readWidth] = store.subscribeTracked(nodeSelector);
let width = readWidth();
subscribeWidth(() => {
  width = readWidth();
});
store.getState().nodeLookup.get('1').measured = { width: 100, height: 40 };
store.setState({});
assert.equal(width, 100, 'measurement updates must reach node selectors');
assert.equal(readWidth(), 100);
console.log('PASS: in-place lookup measurements update node snapshots');

// Only dependencies actually read by a selector should cause work.
const conditionalStore = createStore({});
let evaluations = 0;
const conditionalSelector = (s) => {
  evaluations++;
  return s.nodesDraggable ? s.width : s.height;
};
const [subscribeConditional, readConditional] = conditionalStore.subscribeTracked(conditionalSelector);
assert.equal(conditionalStore.subscribeTracked(conditionalSelector)[1], readConditional);
readConditional();
const unsubscribeConditional = subscribeConditional(() => readConditional());
conditionalStore.setState({ height: 10 });
assert.equal(evaluations, 1, 'unrelated updates must skip the selector');
conditionalStore.setState({ width: 20 });
assert.equal(readConditional(), 20);
assert.equal(evaluations, 2, 'a changed dependency must evaluate once');
conditionalStore.setState({ nodesDraggable: false, height: 30 });
assert.equal(readConditional(), 30);
assert.equal(evaluations, 3, 'multiple changed dependencies must evaluate only once');
const before = evaluations;
conditionalStore.setState({ width: 40 });
assert.equal(evaluations, before, 'old conditional dependencies must be detached');
unsubscribeConditional();
conditionalStore.setState({ height: 50 });
assert.equal(evaluations, before, 'unsubscribed selectors must not run');
assert.equal(readConditional(), 50, 'detached snapshots must catch up on read');
console.log('PASS: selective dispatch, conditional dependencies, and unsubscribe');

const [subscribeRace, readRace] = conditionalStore.subscribeTracked((s) => s.width);
assert.equal(readRace(), 40);
conditionalStore.setState({ width: 60 });
const unsubscribeRace = subscribeRace(() => {});
assert.equal(readRace(), 60, 'subscription must catch updates since render');
unsubscribeRace();
console.log('PASS: render-to-subscribe updates');

const node = (id, extra = {}) => ({ id, position: { x: 0, y: 0 }, data: {}, ...extra });
const observe = (store, selector, equality) => {
  let evaluations = 0;
  let notifications = 0;
  const [subscribe, read, readInitial] = store.subscribeTracked((s) => {
    evaluations++;
    return selector(s);
  }, equality);
  read();
  const unsubscribe = subscribe(() => {
    notifications++;
    read();
  });
  return {
    read,
    readInitial,
    unsubscribe,
    get evaluations() {
      return evaluations;
    },
    get notifications() {
      return notifications;
    },
  };
};

const a = node('a');
const b = node('b');
const edgeA = { id: 'a', source: 'a', target: 'b' };
const edgeB = { id: 'b', source: 'b', target: 'a' };
const fineStore = createStore({ nodes: [a, b], edges: [edgeA, edgeB] });
const nodeA = observe(fineStore, (s) => s.getInternalNodeById('a'));
const nodeB = observe(fineStore, (s) => s.getInternalNodeById('b'));
const observedEdgeA = observe(fineStore, (s) => s.getEdgeById('a'));
const observedEdgeB = observe(fineStore, (s) => s.getEdgeById('b'));
const missing = observe(fineStore, (s) => s.getInternalNodeById('missing'));
for (let i = 0; i < 100; i++) {
  fineStore.setState({ transform: [i, 0, 1] });
  nodeA.read();
}
assert.equal(nodeA.evaluations, 1, 'pan must not run per-node selectors, even on snapshot reads');
assert.equal(observedEdgeA.evaluations, 1, 'pan must not run per-edge selectors');
assert.equal(missing.evaluations, 1, 'missing IDs must not subscribe to all nodes');
fineStore.getState().setNodes([a, b]);
assert.equal(nodeA.evaluations, 1, 'unchanged node objects must not run selectors');
fineStore.getState().setNodes([{ ...a, position: { x: 20, y: 10 } }, b]);
assert.equal(nodeA.evaluations, 2);
assert.equal(nodeB.evaluations, 1, 'changing a must not run b');
assert.equal(observedEdgeA.evaluations, 1, 'node and edge IDs must be isolated');
assert.equal(nodeA.read().internals.positionAbsolute.x, 20);
fineStore.getState().setEdges([{ ...edgeA, selected: true }, edgeB]);
assert.equal(observedEdgeA.evaluations, 2);
assert.equal(observedEdgeB.evaluations, 1);
assert.equal(nodeA.evaluations, 2);
fineStore.getState().setNodes([b, node('missing')]);
assert.equal(nodeA.read(), undefined, 'removed node must notify even when node count is unchanged');
assert.equal(missing.read().id, 'missing', 'previously missing node must notify on insertion');
fineStore.getState().setEdges([edgeB]);
assert.equal(observedEdgeA.read(), undefined, 'removed edge must notify');
console.log('PASS: fine-grained node/edge dispatch, insertion, deletion, and unchanged updates');

const dynamic = observe(fineStore, (s) => s.getInternalNodeById(s.nodesDraggable ? 'b' : 'missing'));
fineStore.setState({ nodesDraggable: false });
const switched = dynamic.evaluations;
fineStore.getState().setNodes([{ ...b, selected: true }, fineStore.getState().nodes[1]]);
assert.equal(dynamic.evaluations, switched, 'switched-away node ID must detach');
dynamic.unsubscribe();
fineStore.getState().setNodes([b, node('missing', { selected: true })]);
assert.equal(dynamic.evaluations, switched);
assert.equal(dynamic.read().selected, true, 'detached node snapshot must catch up');
const combined = observe(fineStore, (s) => [s.nodes, s.getInternalNodeById('b'), s.getInternalNodeById('missing')]);
fineStore.getState().setNodes([node('b'), node('missing')]);
assert.equal(combined.evaluations, 2, 'property and multiple IDs must dispatch a selector only once');
const retainedNodes = observe(fineStore, (s) => s.nodes);
assert.equal(retainedNodes.read(), fineStore.getState().nodes, 'array identity must stay unchanged');
fineStore.getState().reset();
assert.equal(nodeB.read(), undefined, 'reset must notify subscribers to replaced lookups');
assert.equal(observedEdgeB.read(), undefined);
console.log('PASS: dynamic IDs, mixed dependencies, unsubscribe, array identity, and reset');

const parent = node('parent');
const child = node('child', { parentId: 'parent', position: { x: 10, y: 20 } });
const familyStore = createStore({ nodes: [parent, child, node('unrelated')] });
const childObserver = observe(familyStore, (s) => s.getInternalNodeById('child'));
const parentObserver = observe(familyStore, (s) => s.getInternalNodeById('parent'));
const unrelatedObserver = observe(familyStore, (s) => s.getInternalNodeById('unrelated'));
assert.equal(parentObserver.read().internals.isParent, true);
familyStore.getState().setNodes([{ ...parent, position: { x: 100, y: 50 } }, child, familyStore.getState().nodes[2]]);
assert.equal(childObserver.read().internals.positionAbsolute.x, 110, 'moving a parent must update child selectors');
assert.equal(childObserver.evaluations, 2);
assert.equal(unrelatedObserver.evaluations, 1);
familyStore.getState().setNodes([familyStore.getState().nodes[0], familyStore.getState().nodes[2]]);
assert.equal(parentObserver.read().internals.isParent, false, 'removing the last child must update the parent');
assert.equal(childObserver.read(), undefined);
familyStore.getState().setNodeExtent([
  [0, 0],
  [25, 25],
]);
assert.equal(parentObserver.read().internals.positionAbsolute.x, 25, 'extent updates must publish changed nodes');
console.log('PASS: parent/child changes and extent updates');

// Exercise the actual system measurement path, including changes which do not emit dimensions.
const previousWindow = global.window;
global.window = {
  getComputedStyle: () => ({ transform: 'matrix(1, 0, 0, 1, 0, 0)' }),
  DOMMatrixReadOnly: class {
    m22 = 1;
  },
};
try {
  const measuredStore = createStore({ nodes: [node('measured'), node('other')] });
  measuredStore.setState({ domNode: { querySelector: () => ({}) } });
  const measured = observe(measuredStore, (s) => s.getInternalNodeById('measured'));
  const other = observe(measuredStore, (s) => s.getInternalNodeById('other'));
  const nodeElement = {
    offsetWidth: 100,
    offsetHeight: 40,
    getBoundingClientRect: () => ({ x: 0, y: 0, width: 100, height: 40 }),
    querySelectorAll: () => [],
  };
  measuredStore.getState().updateNodeInternals(new Map([['measured', { id: 'measured', nodeElement, force: true }]]));
  assert.equal(measured.read().measured.width, 100);
  assert.equal(measured.evaluations, 2);
  assert.equal(other.evaluations, 1);
  const previous = measured.read();
  measuredStore.getState().updateNodeInternals(new Map([['measured', { id: 'measured', nodeElement, force: true }]]));
  assert.notEqual(measured.read(), previous, 'forced handle updates must notify without a dimension change');
  assert.equal(other.evaluations, 1);
} finally {
  global.window = previousWindow;
}
console.log('PASS: real measurement and forced handle updates remain fine-grained');

// A selector may read an edge and then depend on that edge's current endpoints.
const endpointStore = createStore({
  nodes: [node('source'), node('target'), node('next')],
  edges: [{ id: 'edge', source: 'source', target: 'target' }],
});
const endpoints = observe(endpointStore, (s) => {
  const edge = s.getEdgeById('edge');
  if (!edge) return undefined;
  return [s.getInternalNodeById(edge.source), s.getInternalNodeById(edge.target)];
});
endpointStore.getState().setEdges([{ id: 'edge', source: 'source', target: 'next' }]);
const afterReconnect = endpoints.evaluations;
endpointStore
  .getState()
  .setNodes(endpointStore.getState().nodes.map((n) => (n.id === 'target' ? { ...n, selected: true } : n)));
assert.equal(endpoints.evaluations, afterReconnect, 'reconnected edges must detach the old endpoint');
endpointStore
  .getState()
  .setNodes(endpointStore.getState().nodes.map((n) => (n.id === 'next' ? { ...n, selected: true } : n)));
assert.equal(endpoints.evaluations, afterReconnect + 1);
assert.equal(endpoints.read()[1].selected, true);
const [subscribeFineRace, readFineRace] = endpointStore.subscribeTracked((s) => s.getInternalNodeById('source'));
const renderedSource = readFineRace();
endpointStore
  .getState()
  .setNodes(endpointStore.getState().nodes.map((n) => (n.id === 'source' ? { ...n, selected: true } : n)));
const unsubscribeFineRace = subscribeFineRace(() => {});
assert.notEqual(readFineRace(), renderedSource, 'fine-grained subscriptions must catch render-to-subscribe changes');
unsubscribeFineRace();
console.log('PASS: edge endpoint switching and fine-grained render-to-subscribe updates');
