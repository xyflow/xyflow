/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from 'react';
import { shallow } from 'zustand/shallow';
import { useStore, getNodePositionWithOrigin, type ReactFlowState } from '@reactflow/core';

import MiniMapNode from './MiniMapNode';
import type { MiniMapNodes, GetMiniMapNodeAttribute } from './types';

declare const window: any;

const selector = (s: ReactFlowState) => s.nodeOrigin;
const selectorNodes = (s: ReactFlowState) => s.getNodes().filter((node) => !node.hidden && node.width && node.height);
const getAttrFunction = (func: any): GetMiniMapNodeAttribute => (func instanceof Function ? func : () => func);

function MiniMapNodes({
  nodeStrokeColor = 'transparent',
  nodeColor = '#e2e2e2',
  nodeClassName = '',
  nodeBorderRadius = 5,
  nodeStrokeWidth = 2,
  // We need to rename the prop to be `CapitalCase` so that JSX will render it as
  // a component properly.
  nodeComponent: NodeComponent = MiniMapNode,
  onClick,
}: MiniMapNodes) {
  const nodes = useStore(selectorNodes, shallow);
  const nodeOrigin = useStore(selector);
  const nodeColorFunc = getAttrFunction(nodeColor);
  const nodeStrokeColorFunc = getAttrFunction(nodeStrokeColor);
  const nodeClassNameFunc = getAttrFunction(nodeClassName);

  const shapeRendering = typeof window === 'undefined' || !!window.chrome ? 'crispEdges' : 'geometricPrecision';

  return (
    <>
      {nodes.map((node) => {
        const { x, y } = getNodePositionWithOrigin(node, nodeOrigin).positionAbsolute;

        return (
          <NodeComponent
            key={node.id}
            x={x}
            y={y}
            width={node.width!}
            height={node.height!}
            style={node.style}
            selected={node.selected}
            className={nodeClassNameFunc(node)}
            color={nodeColorFunc(node)}
            borderRadius={nodeBorderRadius}
            strokeColor={nodeStrokeColorFunc(node)}
            strokeWidth={nodeStrokeWidth}
            shapeRendering={shapeRendering}
            onClick={onClick}
            id={node.id}
          />
        );
      })}
    </>
  );
}

export default memo(MiniMapNodes);
