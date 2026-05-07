import { ReactFlowProvider, ReactFlow, NodeProps, Node } from '@xyflow/react';
import React, { Suspense } from 'react';

let resolvePromise: (value?: unknown) => void;
let promise: Promise<unknown> | null = null;
let resolved = false;

function SuspendingNode(props: NodeProps<Node>) {
  if (!resolved) {
    if (!promise) {
      promise = new Promise((r) => {
        resolvePromise = r;
      }).then(() => {
        resolved = true;
      });
    }
    throw promise;
  }
  return <div className="suspending-node">Suspended Node Content</div>;
}

const nodeTypes = { suspending: SuspendingNode };
const initialNodes: Node[] = [
  { id: '1', type: 'suspending', position: { x: 0, y: 0 }, data: {} },
];

describe('<ReactFlow />: Suspense loop regression', () => {
  it('should not cause an infinite render loop when Suspense is outside ReactFlowProvider', () => {
    // Reset state for test
    resolved = false;
    promise = null;

    cy.mount(
      <Suspense fallback={<div className="fallback">Loading...</div>}>
        <ReactFlowProvider>
          <ReactFlow nodes={initialNodes} nodeTypes={nodeTypes} />
        </ReactFlowProvider>
      </Suspense>
    );

    // Initial render should show the fallback
    cy.get('.fallback').should('be.visible');

    // Resolve the promise to end the suspense
    cy.then(() => {
      resolvePromise();
    });

    // Wait for the custom node to appear and ensure fallback is gone
    cy.get('.suspending-node').should('be.visible').should('contain.text', 'Suspended Node Content');
    cy.get('.fallback').should('not.exist');
  });
});
