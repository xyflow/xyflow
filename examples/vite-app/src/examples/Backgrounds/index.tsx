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

const Flow: FC<{ id: string; bgProps: BackgroundProps[] }> = ({ id, bgProps }) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);

  return (
    <ReactFlowProvider>
      <ReactFlow nodes={nodes} onNodesChange={onNodesChange} id={id}>
        {bgProps.map((props, idx) => (
          <Background key={idx} id={idx.toString()} {...props} />
        ))}
      </ReactFlow>
    </ReactFlowProvider>
  );
};

const Backgrounds: FC = () => (
  <div className={styles.wrapper}>
    <Flow id="flow-a" bgProps={[{ variant: BackgroundVariant.Dots }]} />
    <Flow id="flow-b" bgProps={[{ variant: BackgroundVariant.Lines, gap: [50, 50] }]} />
    <Flow id="flow-c" bgProps={[{ variant: BackgroundVariant.Cross, gap: [100, 50] }]} />
    <Flow
      id="flow-d"
      bgProps={[
        { variant: BackgroundVariant.Lines, gap: 10 },
        { variant: BackgroundVariant.Lines, gap: 100, offset: 2, color: '#ccc' },
      ]}
    />
  </div>
);

export default Backgrounds;
