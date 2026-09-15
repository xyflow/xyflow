import { FC } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  type AriaLabelConfig,
  type Edge,
  type Node,
} from '@xyflow/react';

import { defaultA11yArgs, initialEdges, initialNodes, type SharedA11yArgs } from './config';

const flowStyle = { width: '100%', height: '100%' } as const;

export const A11yExample: FC<SharedA11yArgs> = ({
  autoPanOnNodeFocus = defaultA11yArgs.autoPanOnNodeFocus,
  ariaNodeDefault = defaultA11yArgs.ariaNodeDefault,
  ariaNodeKeyboardDisabled = defaultA11yArgs.ariaNodeKeyboardDisabled,
  ariaNodeLiveMessagePrefix = defaultA11yArgs.ariaNodeLiveMessagePrefix,
  ariaEdgeDefault = defaultA11yArgs.ariaEdgeDefault,
  ariaControlsLabel = defaultA11yArgs.ariaControlsLabel,
  ariaControlsZoomIn = defaultA11yArgs.ariaControlsZoomIn,
  ariaControlsZoomOut = defaultA11yArgs.ariaControlsZoomOut,
  ariaControlsFitView = defaultA11yArgs.ariaControlsFitView,
  ariaControlsInteractive = defaultA11yArgs.ariaControlsInteractive,
  ariaMinimap = defaultA11yArgs.ariaMinimap,
}) => {
  const ariaLabelConfig: Partial<AriaLabelConfig> = {
    'node.a11yDescription.default': ariaNodeDefault,
    'node.a11yDescription.keyboardDisabled': ariaNodeKeyboardDisabled,
    'node.a11yDescription.ariaLiveMessage': ({ direction, x, y }) =>
      `${ariaNodeLiveMessagePrefix} ${direction}. New position, x: ${x}, y: ${y}`,
    'edge.a11yDescription.default': ariaEdgeDefault,
    'controls.ariaLabel': ariaControlsLabel,
    'controls.zoomIn.ariaLabel': ariaControlsZoomIn,
    'controls.zoomOut.ariaLabel': ariaControlsZoomOut,
    'controls.fitView.ariaLabel': ariaControlsFitView,
    'controls.interactive.ariaLabel': ariaControlsInteractive,
    'minimap.ariaLabel': ariaMinimap,
  };

  return (
    <ReactFlowProvider>
      <div style={flowStyle}>
        <ReactFlow
          defaultNodes={initialNodes as Node[]}
          defaultEdges={initialEdges as Edge[]}
          autoPanOnNodeFocus={autoPanOnNodeFocus}
          selectNodesOnDrag={false}
          elevateEdgesOnSelect
          elevateNodesOnSelect={false}
          nodeDragThreshold={0}
          ariaLabelConfig={ariaLabelConfig}
          style={flowStyle}
        >
          <Background variant={BackgroundVariant.Dots} />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default A11yExample;
