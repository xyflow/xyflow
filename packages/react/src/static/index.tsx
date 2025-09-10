import { CSSProperties, ForwardedRef, useMemo } from 'react';
import cc from 'classcat';
import { adoptUserNodes, infiniteExtent, NodeOrigin } from '@xyflow/system';

import { ReactFlowProps, Edge, Node } from '../types';
import { fixedForwardRef } from '../utils';
import { Viewport } from './Viewport';
import { NodeRenderer } from './NodeRenderer';
import { EdgeRenderer } from './EdgeRenderer';
import { FakeProvider } from './FakeProvider';
import { useViewport } from './useViewport';

export type ReactFlowStaticProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> = Pick<
  ReactFlowProps<NodeType, EdgeType>,
  | 'nodes'
  | 'edges'
  | 'className'
  | 'style'
  | 'id'
  | 'nodeTypes'
  | 'edgeTypes'
  | 'children'
  | 'width'
  | 'height'
  | 'fitViewOptions'
  | 'minZoom'
  | 'maxZoom'
>;

const wrapperStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 0,
};

const nodeOrigin: NodeOrigin = [0, 0];

function ReactFlowStaticComponent<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  {
    nodes = [],
    edges = [],
    nodeTypes,
    edgeTypes,
    className,
    style,
    id,
    width = 800,
    height = 600,
    fitViewOptions = { padding: 0.1 },
    minZoom = 0.1,
    maxZoom = 4,
    children,
  }: ReactFlowStaticProps<NodeType, EdgeType>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const nodeLookup = useMemo(() => {
    const nodesWithDimensions = nodes.filter((node) => {
      const hasDimensions = node.width !== undefined && node.height !== undefined;

      if (!hasDimensions) {
        console.warn(`Node with id "${node.id}" is missing width and/or height.`);
      }

      return hasDimensions;
    });

    const nodeLookup = new Map();

    adoptUserNodes(nodesWithDimensions, nodeLookup, new Map(), {
      nodeOrigin: nodeOrigin,
      nodeExtent: infiniteExtent,
    });

    return nodeLookup;
  }, [nodes]);

  const viewport = useViewport({ nodeLookup, width, height, fitViewOptions, minZoom, maxZoom });

  return (
    <FakeProvider viewport={viewport}>
      <div
        style={{ ...wrapperStyle, width, height, ...style }}
        ref={ref}
        className={cc(['react-flow', className])}
        id={id}
      >
        <Viewport viewport={viewport}>
          <NodeRenderer<NodeType> nodeLookup={nodeLookup} nodeTypes={nodeTypes} />
          <EdgeRenderer<NodeType, EdgeType> edges={edges} edgeTypes={edgeTypes} nodeLookup={nodeLookup} />
        </Viewport>
        {children}
      </div>
    </FakeProvider>
  );
}

export const ReactFlowStatic = fixedForwardRef(ReactFlowStaticComponent);
