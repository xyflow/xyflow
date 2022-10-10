import { CSSProperties } from 'react';
import { useStore } from '../../hooks/useStore';
import { ReactFlowState } from '../../types';

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

const selector = (s: ReactFlowState) => s.ariaLiveMessage;

function AriaLiveMessage({ rfId }: { rfId: string }) {
  const ariaLiveMessage = useStore(selector);

  return (
    <div id={`${ARIA_LIVE_MESSAGE}-${rfId}`} aria-live="assertive" aria-atomic="true" style={ariaLiveStyle}>
      {ariaLiveMessage}
    </div>
  );
}

function A11yDescriptions({ rfId, disableKeyboardA11y }: { rfId: string; disableKeyboardA11y: boolean }) {
  return (
    <>
      <div id={`${ARIA_NODE_DESC_KEY}-${rfId}`} style={style}>
        Press enter or space to select a node.
        {!disableKeyboardA11y && 'You can then use the arrow keys to move the node around.'} Press delete to remove it
        and escape to cancel.{' '}
      </div>
      <div id={`${ARIA_EDGE_DESC_KEY}-${rfId}`} style={style}>
        Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.
      </div>
      {!disableKeyboardA11y && <AriaLiveMessage rfId={rfId} />}
    </>
  );
}

export default A11yDescriptions;
