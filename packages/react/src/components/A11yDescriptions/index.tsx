import { CSSProperties } from 'react';

import { useStore } from '../../hooks/useStore';
import type { ReactFlowState } from '../../types';

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

const ariaLiveSelector = (s: ReactFlowState) => s.ariaLiveMessage;
const labelConfigSelector = (s: ReactFlowState) => s.labelConfig;

function AriaLiveMessage({ rfId }: { rfId: string }) {
  const ariaLiveMessage = useStore(ariaLiveSelector);

  return (
    <div id={`${ARIA_LIVE_MESSAGE}-${rfId}`} aria-live="assertive" aria-atomic="true" style={ariaLiveStyle}>
      {ariaLiveMessage}
    </div>
  );
}

export function A11yDescriptions({ rfId, disableKeyboardA11y }: { rfId: string; disableKeyboardA11y: boolean }) {
  const labelConfig = useStore(labelConfigSelector);

  return (
    <>
      <div id={`${ARIA_NODE_DESC_KEY}-${rfId}`} style={style}>
        {disableKeyboardA11y
          ? labelConfig['a11yDescription.node.default']
          : labelConfig['a11yDescription.node.keyboardDisabled']}
      </div>
      <div id={`${ARIA_EDGE_DESC_KEY}-${rfId}`} style={style}>
        {labelConfig['a11yDescription.edge.default']}
      </div>
      {!disableKeyboardA11y && <AriaLiveMessage rfId={rfId} />}
    </>
  );
}
