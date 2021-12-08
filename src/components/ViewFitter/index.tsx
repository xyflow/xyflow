import React, { MutableRefObject, useEffect, useRef } from 'react';

import { Node } from '../../types';
import { getRectOfNodes, getTransformForBounds } from '../../utils/graph';
import { useStoreApi } from '../../store';
import useZoomPanHelper from '../../hooks/useZoomPanHelper';

type ViewFitterInnerProps = {
  nodes: Node[];
  viewFitted: MutableRefObject<boolean>;
};

function ViewFitterInner({ nodes, viewFitted }: ViewFitterInnerProps) {
  const store = useStoreApi();
  const { setTransform } = useZoomPanHelper();

  useEffect(() => {
    if (nodes.length > 0 && !viewFitted.current) {
      const nodesInitialized = nodes.every((n) => n.width && n.height);

      if (nodesInitialized) {
        const { width, height, minZoom, maxZoom } = store.getState();
        const bounds = getRectOfNodes(nodes);
        const [x, y, zoom] = getTransformForBounds(bounds, width, height, minZoom ?? 0.5, maxZoom ?? 2);

        viewFitted.current = true;
        setTransform({ x, y, zoom });
      }
    }
  }, [nodes]);

  return null;
}

export type ViewFitterProps = {
  nodes: Node[];
};

function ViewFitter({ nodes }: ViewFitterProps) {
  // we are storing the viewFitted in this wrapper to get rid of the useEffect of the inner component
  // that needs to check if the nodes changed after we fitted the view.
  const viewFitted = useRef<boolean>(false);

  if (viewFitted.current) {
    return null;
  }

  return <ViewFitterInner nodes={nodes} viewFitted={viewFitted} />;
}

export default ViewFitter;
