import { CSSProperties } from 'react';

import { useStore } from '../../hooks/useStore';
import type { ReactFlowState } from '../../types';
import type { a11yMessages } from '@xyflow/system';

const style: CSSProperties = { display: 'none' };
const ariaLiveStyle: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0px, 0px, 0px, 0px)',
  clipPath: 'inset(100%)',
};

export const ARIA_NODE_DESC_KEY = 'react-flow__node-desc';
export const ARIA_EDGE_DESC_KEY = 'react-flow__edge-desc';
export const ARIA_LIVE_MESSAGE = 'react-flow__aria-live';

const defaultA11yMessages: Required<a11yMessages> = {
  'a11yDescription.node.default':
    'Press enter or space to select a node. Press delete to remove it and escape to cancel.',
  'a11yDescription.node.keyboardDisabled':
    'Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.',
  'a11yDescription.edge.default':
    'Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.',
};

const selector = (s: ReactFlowState) => s.ariaLiveMessage;

function AriaLiveMessage({ rfId }: { rfId: string }) {
  const ariaLiveMessage = useStore(selector);

  return (
    <div id={`${ARIA_LIVE_MESSAGE}-${rfId}`} aria-live="assertive" aria-atomic="true" style={ariaLiveStyle}>
      {ariaLiveMessage}
    </div>
  );
}

export function A11yDescriptions({
  rfId,
  disableKeyboardA11y,
  a11yMessages = {},
}: {
  rfId: string;
  disableKeyboardA11y: boolean;
  a11yMessages?: a11yMessages;
}) {
  const nodeDesc = disableKeyboardA11y
    ? a11yMessages['a11yDescription.node.default'] || defaultA11yMessages['a11yDescription.node.default']
    : a11yMessages['a11yDescription.node.keyboardDisabled'] ||
      defaultA11yMessages['a11yDescription.node.keyboardDisabled'];
  const edgeDesc = a11yMessages['a11yDescription.edge.default'] || defaultA11yMessages['a11yDescription.edge.default'];

  return (
    <>
      <div id={`${ARIA_NODE_DESC_KEY}-${rfId}`} style={style}>
        {nodeDesc}
      </div>
      <div id={`${ARIA_EDGE_DESC_KEY}-${rfId}`} style={style}>
        {edgeDesc}
      </div>
      {!disableKeyboardA11y && <AriaLiveMessage rfId={rfId} />}
    </>
  );
}
