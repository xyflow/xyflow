import { FC } from 'react';

import {
  ReactFlow,
  Node,
  ReactFlowProvider,
  useNodesState,
  Background,
  BackgroundProps,
  BackgroundVariant,
} from '@xyflow/react';

import styles from './style.module.css';

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Node 1' },
    position: { x: 50, y: 50 },
  },
];

export const BackgroundExample: FC<BackgroundProps> = ({ id = 'background', ...backgroundProps }) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);

  return (
    <ReactFlowProvider>
      <div className={styles.flow}>
        <ReactFlow nodes={nodes} onNodesChange={onNodesChange}>
          <Background id={id} {...backgroundProps} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

const Flow: FC<{ id: string; bgProps: BackgroundProps[] }> = ({ id, bgProps }) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);

  return (
    <ReactFlowProvider>
      <ReactFlow nodes={nodes} onNodesChange={onNodesChange} id={id}>
        {bgProps.map((props, idx) => (
          <Background key={props.id ?? idx} {...props} id={props.id ?? String(idx)} />
        ))}
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export const BackgroundShowcase: FC = () => (
  <div className={styles.wrapper}>
    <Flow id="flow-a" bgProps={[{ id: 'dots', variant: BackgroundVariant.Dots }]} />
    <Flow id="flow-b" bgProps={[{ id: 'lines', variant: BackgroundVariant.Lines, gap: [50, 50] }]} />
    <Flow id="flow-c" bgProps={[{ id: 'cross', variant: BackgroundVariant.Cross, gap: [100, 50] }]} />
    <Flow
      id="flow-d"
      bgProps={[
        { id: 'lines-fine', variant: BackgroundVariant.Lines, gap: 10 },
        { id: 'lines-coarse', variant: BackgroundVariant.Lines, gap: 100, offset: 2, color: '#ccc' },
      ]}
    />
  </div>
);

export default BackgroundExample;
