import { useState } from 'react';
import { Panel, PanelPosition } from '@xyflow/react';

import NodeInspector from './NodeInspector';

type ReactFlowDevToolsProps = {
  position?: PanelPosition;
  color?: string;
};

export default function ReactFlowDevTools({ color = '#aaa', position = 'top-left' }: ReactFlowDevToolsProps) {
  const [isNodeInspectorActive, setIsNodeInspectorActive] = useState(false);

  return (
    <>
      <Panel position={position}>
        <button onClick={() => setIsNodeInspectorActive((a) => !a)}>node inspector</button>
      </Panel>
      {isNodeInspectorActive && <NodeInspector color={color} />}
    </>
  );
}
