const style = { display: 'none' };

export const ARIA_NODE_DESC_KEY = 'react-flow__node-desc';
export const ARIA_EDGE_DESC_KEY = 'react-flow__edge-desc';

function A11yDescriptions({ rfId, disableKeyboardA11y }: { rfId: string; disableKeyboardA11y: boolean }) {
  if (disableKeyboardA11y) {
    return null;
  }

  return (
    <>
      <div id={`${ARIA_NODE_DESC_KEY}-${rfId}`} style={style}>
        Press enter or space to select a node. You can then use the arrow keys to move the node around, press delete to
        remove it and press escape to cancel.
      </div>
      <div id={`${ARIA_EDGE_DESC_KEY}-${rfId}`} style={style}>
        Press enter or space to select an edge. You can then press delete to remove it or press escape to cancel.
      </div>
    </>
  );
}

export default A11yDescriptions;
