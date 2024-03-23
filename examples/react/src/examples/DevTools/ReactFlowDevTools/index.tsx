import { useState } from 'react';
import { Panel, PanelPosition } from '@xyflow/react';

import NodeInspector from './NodeInspector';
import ChangeLogger from './ChangeLogger';

type ReactFlowDevToolsProps = {
  position?: PanelPosition;
  color?: string;
};

export default function ReactFlowDevTools({ color = '#aaa', position = 'top-left' }: ReactFlowDevToolsProps) {
  const [isNodeInspectorActive, setIsNodeInspectorActive] = useState(false);
  const [isChangeLoggerActive, setIsChangeLoggerActive] = useState(false);

  return (
    <>
      <Panel position={position}>
        <button onClick={() => setIsNodeInspectorActive((a) => !a)}>node inspector</button>
        <button onClick={() => setIsChangeLoggerActive((a) => !a)}>change logger</button>
      </Panel>
      {isNodeInspectorActive && <NodeInspector color={color} />}
      {isChangeLoggerActive && <ChangeLogger color={color} />}
    </>
  );
}
