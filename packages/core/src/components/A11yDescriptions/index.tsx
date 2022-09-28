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
export const ARIA_LIVE_MESSAGE = 'react-flow__arai-live';

const selector = (s: ReactFlowState) => s.ariaLiveMessage;

function A11yDescriptions({ rfId }: { rfId: string }) {
  const ariaLiveMessage = useStore(selector);

  return (
    <>
      <div id={`${ARIA_NODE_DESC_KEY}-${rfId}`} style={style}>
        Press enter or space to select a node. You can then use the arrow keys to move the node around, press delete to
        remove it and press escape to cancel.
      </div>
      <div id={`${ARIA_EDGE_DESC_KEY}-${rfId}`} style={style}>
        Press enter or space to select an edge. You can then press delete to remove it or press escape to cancel.
      </div>
      <div id={`${ARIA_LIVE_MESSAGE}-${rfId}`} aria-live="assertive" aria-atomic="true" style={ariaLiveStyle}>
        {ariaLiveMessage}
      </div>
    </>
  );
}

export default A11yDescriptions;
