import React, { Suspense } from 'react';
import { render, screen } from '@testing-library/react';
import { ReactFlow, ReactFlowProvider } from '../src';

let resolvePromise: (value?: unknown) => void;
let promise: Promise<unknown> | null = null;
let resolved = false;

function SuspendingNode() {
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
  return <div data-testid="suspending-node">Suspended Node Content</div>;
}

const nodeTypes = { suspending: SuspendingNode };
const initialNodes = [
  { id: '1', type: 'suspending', position: { x: 0, y: 0 }, data: {} },
];

describe('ReactFlow Suspense', () => {
  it('should not cause infinite render loop and should recover from suspense when outside ReactFlowProvider', async () => {
    render(
      <Suspense fallback={<div data-testid="fallback">Loading...</div>}>
        <ReactFlowProvider>
          <ReactFlow nodes={initialNodes} nodeTypes={nodeTypes} />
        </ReactFlowProvider>
      </Suspense>
    );

    // Initial render should show the fallback
    expect(screen.getByTestId('fallback')).toBeDefined();

    // Resolve the promise to end the suspense
    resolvePromise();

    // Wait for the custom node to appear
    const nodeContent = await screen.findByTestId('suspending-node');
    expect(nodeContent).toBeDefined();
    
    // Test successfully completes if it didn't infinite loop and crashed React
  });
});
