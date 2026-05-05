import { Suspense } from 'react';

import Flow from '../components/Flow';
import { ReactFlowProvider } from '@xyflow/react';
import { initialNodes } from '@/components/nodes';

export default function App() {
  return (
    <ReactFlowProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Flow nodes={initialNodes} />
      </Suspense>
    </ReactFlowProvider>
  );
}
