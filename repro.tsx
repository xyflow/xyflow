import React, { Suspense } from 'react';
import { render } from '@testing-library/react';
import { ReactFlow, ReactFlowProvider } from './packages/react/src';

let resolve;
const promise = new Promise(r => resolve = r);
let resolved = false;

function SuspendingNode() {
  if (!resolved) {
    throw promise;
  }
  return <div>Node</div>;
}

const nodeTypes = { custom: SuspendingNode };
const nodes = [{ id: '1', type: 'custom', position: { x: 0, y: 0 }, data: {} }];

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReactFlowProvider>
        <ReactFlow nodes={nodes} nodeTypes={nodeTypes} />
      </ReactFlowProvider>
    </Suspense>
  );
}

const root = render(<App />);
console.log("Rendered!");
