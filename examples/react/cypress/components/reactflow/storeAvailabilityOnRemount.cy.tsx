import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ReactFlow, ReactFlowProvider, useStoreApi, type Node, type Edge, type NodeTypes, type NodeProps } from '@xyflow/react';

import { edges as initialEdges } from '../../fixtures/simpleflow';

type CheckResult = { nodesLength: number; lookupSize: number };

// We use a global ref so the custom node can report without prop drilling.
// Each test resets this before mounting.
let checkSpy: ((result: CheckResult) => void) | null = null;

/**
 * Custom node rendered inside GraphView's subtree. Verifies that
 * the store (nodes, nodeLookup, etc.) is populated by the time
 * custom node effects fire after a <ReactFlow> key-based remount.
 */
function CheckerNode({ data }: NodeProps) {
  const store = useStoreApi();
  const useHook = data.useLayout ? useLayoutEffect : useEffect;

  useHook(() => {
    if (checkSpy) {
      const { nodes, nodeLookup } = store.getState();
      checkSpy({ nodesLength: nodes.length, lookupSize: nodeLookup.size });
    }
  });

  return <div>{data.label as string}</div>;
}

const nodeTypes: NodeTypes = { checker: CheckerNode };

const makeNodes = (useLayout = false): Node[] => [
  { id: '1', type: 'checker', data: { label: 'Node 1', useLayout }, position: { x: 0, y: 0 } },
  { id: '2', type: 'checker', data: { label: 'Node 2', useLayout }, position: { x: 200, y: 200 } },
];

describe('<ReactFlow /> remount: store availability', () => {
  it('node useEffect sees populated store after <ReactFlow> key remount', () => {
    const spy = cy.spy().as('spy');
    checkSpy = spy;

    const nodes = makeNodes(false);

    cy.mount(
      <ReactFlowProvider>
        <RemountableFlow nodes={nodes} edges={initialEdges} />
      </ReactFlowProvider>
    );

    cy.get('@spy').should('have.been.calledWithMatch', { lookupSize: 2 });
    cy.then(() => spy.resetHistory());
    cy.get('[data-testid="remount"]').click();
    cy.get('@spy').should('have.been.called');
    cy.get('@spy').should('always.have.been.calledWithMatch', { lookupSize: 2 });
  });

  it('node useLayoutEffect sees populated store after <ReactFlow> key remount', () => {
    const spy = cy.spy().as('spy');
    checkSpy = spy;

    const nodes = makeNodes(true);

    cy.mount(
      <ReactFlowProvider>
        <RemountableFlow nodes={nodes} edges={initialEdges} />
      </ReactFlowProvider>
    );

    cy.get('@spy').should('have.been.calledWithMatch', { lookupSize: 2 });
    cy.then(() => spy.resetHistory());
    cy.get('[data-testid="remount"]').click();
    cy.get('@spy').should('have.been.called');
    cy.get('@spy').should('always.have.been.calledWithMatch', { lookupSize: 2 });
  });

  it('node useEffect sees populated store after <ReactFlow> key remount with defaultNodes', () => {
    const spy = cy.spy().as('spy');
    checkSpy = spy;

    const nodes = makeNodes(false);

    const DefaultFlow = () => {
      const [remountKey, setRemountKey] = useState(0);

      return (
        <>
          <button data-testid="remount" onClick={() => setRemountKey((k) => k + 1)}>
            Remount
          </button>
          <ReactFlow key={remountKey} defaultNodes={nodes} defaultEdges={initialEdges} nodeTypes={nodeTypes}>
            <div />
          </ReactFlow>
        </>
      );
    };

    cy.mount(
      <ReactFlowProvider>
        <DefaultFlow />
      </ReactFlowProvider>
    );

    cy.get('@spy').should('have.been.calledWithMatch', { lookupSize: 2 });
    cy.then(() => spy.resetHistory());
    cy.get('[data-testid="remount"]').click();
    cy.get('@spy').should('have.been.called');
    cy.get('@spy').should('always.have.been.calledWithMatch', { lookupSize: 2 });
  });
});

const RemountableFlow = ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
  const [remountKey, setRemountKey] = useState(0);

  const handleRemount = useCallback(() => {
    setRemountKey((k) => k + 1);
  }, []);

  return (
    <>
      <button data-testid="remount" onClick={handleRemount}>
        Remount
      </button>
      <ReactFlow key={remountKey} nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
        <div />
      </ReactFlow>
    </>
  );
};
