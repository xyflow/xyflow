import { ReactFlow, Background, Controls, MiniMap, type ReactFlowProps } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

export interface CommonPropsStoryProps extends ReactFlowProps {}

export default function CommonPropsStory(props: CommonPropsStoryProps) {
  return (
    <ReactFlow {...props}>
      <Background />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
}
