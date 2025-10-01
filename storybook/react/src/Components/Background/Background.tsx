import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface BackgroundExampleProps {
  variant?: BackgroundVariant | 'lines' | 'dots' | 'cross';
}

export default function BackgroundExample(props: BackgroundExampleProps) {
  return (
    <div style={{ width: 600, height: 400 }}>
      <ReactFlow defaultNodes={[]} defaultEdges={[]}>
        <Background variant={(props.variant as BackgroundVariant) ?? BackgroundVariant.Lines} />
      </ReactFlow>
    </div>
  );
}
