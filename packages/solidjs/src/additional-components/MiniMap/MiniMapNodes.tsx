/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { ComponentType, memo } from 'react';
import { NodeOrigin, getNodeDimensions, getNodePositionWithOrigin, nodeHasDimensions } from '@xyflow/system';
// import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';
import { MiniMapNode } from './MiniMapNode';
import type { SolidFlowState, Node, InternalNode } from '../../types';
import type { MiniMapNodes as MiniMapNodesProps, GetMiniMapNodeAttribute, MiniMapNodeProps } from './types';
import { Component, For, Show, mergeProps, JSX } from 'solid-js';
import { Dynamic } from 'solid-js/web';

declare const window: any;

const selector = (s: SolidFlowState) => s.nodeOrigin;
const selectorNodeIds = (s: SolidFlowState) => () => s.nodes.get().map((node) => node.id);
const getAttrFunction = <NodeType extends Node>(func: any): GetMiniMapNodeAttribute<NodeType> =>
  func instanceof Function ? func : () => func;

function MiniMapNodes<NodeType extends Node>(
  _p: MiniMapNodesProps<NodeType>) {
//   {
//   nodeStrokeColor,
//   nodeColor,
//   nodeClassName = '',
//   nodeBorderRadius = 5,
//   nodeStrokeWidth,
//   // We need to rename the prop to be `CapitalCase` so that JSX will render it as
//   // a component properly.
//   nodeComponent: NodeComponent = MiniMapNode,
//   onClick,
// }: MiniMapNodesProps<NodeType>) {
  const p = mergeProps({
    
    
    nodeClassName: '',
    nodeBorderRadius: 5,
    nodeComponent: MiniMapNode,
  }, _p);

  const nodeIds = useStore(selectorNodeIds);
  const nodeOrigin = useStore(selector);
  const nodeColorFunc = () => getAttrFunction<NodeType>(p.nodeColor);
  const nodeStrokeColorFunc = () => getAttrFunction<NodeType>(p.nodeStrokeColor);
  const nodeClassNameFunc = () => getAttrFunction<NodeType>(p.nodeClassName);

  const shapeRendering = () => typeof window === 'undefined' || !!window.chrome ? 'crispEdges' : 'geometricPrecision';

        // The split of responsibilities between MiniMapNodes and
        // NodeComponentWrapper may appear weird. However, it’s designed to
        // minimize the cost of updates when individual nodes change.
        //
        // For more details, see a similar commit in `NodeRenderer/index.tsx`.

  return (
    <For each={nodeIds()}>
      {(nodeId) => { 

        return <NodeComponentWrapper<NodeType>
          id={nodeId}
          nodeOrigin={nodeOrigin.get()}
          nodeColorFunc={nodeColorFunc()}
          nodeStrokeColorFunc={nodeStrokeColorFunc()}
          nodeClassNameFunc={nodeClassNameFunc()}
          nodeBorderRadius={p.nodeBorderRadius}
          nodeStrokeWidth={p.nodeStrokeWidth}
          NodeComponent={p.nodeComponent}
          onClick={p.onClick}
          shape-rendering={shapeRendering()}
        />
      }}
    </For>
  );
}

function NodeComponentWrapperInner<NodeType extends Node>(
  p: 
{
  id: string;
  nodeOrigin: NodeOrigin;
  nodeColorFunc: GetMiniMapNodeAttribute<NodeType>;
  nodeStrokeColorFunc: GetMiniMapNodeAttribute<NodeType>;
  nodeClassNameFunc: GetMiniMapNodeAttribute<NodeType>;
  nodeBorderRadius: number;
  nodeStrokeWidth?: JSX.CSSProperties['stroke-width'];
  NodeComponent: Component<MiniMapNodeProps>;
  onClick: MiniMapNodesProps['onClick'];
    "shape-rendering"?: "auto" | "optimizeSpeed" | "crispEdges" | "geometricPrecision" | "inherit";
}) {
//   {
//   id,
//   nodeOrigin,
//   nodeColorFunc,
//   nodeStrokeColorFunc,
//   nodeClassNameFunc,
//   nodeBorderRadius,
//   nodeStrokeWidth,
//   shapeRendering,
//   NodeComponent,
//   onClick,
// }: ) {

    const pos = (node: InternalNode<NodeType>) => getNodePositionWithOrigin(node, p.nodeOrigin).positionAbsolute;

  const { node  } = useStore((s) => {
    const node = () => s.nodeLookup.get(p.id) as InternalNode<NodeType> | undefined;

    return {
      node,
      // x: () => pos().x,
      // y: () => pos().y,
    };
  });

  // if (!node || node.hidden || !nodeHasDimensions(node)) {
  //   return null;
  // }

  // const { width, height } = getNodeDimensions(node);

  return (
    <Show when={node() && !node()?.hidden && nodeHasDimensions(node()!) && node()}>
    {(node) => {

      return <Dynamic
      component={p.NodeComponent}

      x={pos(node()).x}
      y={pos(node()).y}
      width={getNodeDimensions(node()).width}
      height={getNodeDimensions(node()).height}
      style={assertMinimapPropsCompatibleStyle(node().style)}
      selected={!!node().selected}
      className={p.nodeClassNameFunc(node())}
      color={p.nodeColorFunc(node())}
      borderRadius={p.nodeBorderRadius}
      strokeColor={p.nodeStrokeColorFunc(node())}
      strokeWidth={p.nodeStrokeWidth}
      shape-rendering={p["shape-rendering"]}
      onClick={p.onClick}
      id={node().id}
    />

    }}
    </Show>

  );
}

const NodeComponentWrapper = NodeComponentWrapperInner as typeof NodeComponentWrapperInner;

export default MiniMapNodes;


function assertMinimapPropsCompatibleStyle(style?: JSX.CSSProperties): Omit<JSX.CSSProperties, "height" | "width"> & { height?: number, width?: number } | undefined{
  if (!style) {
    return undefined
  }

  if (typeof style.height !== "undefined" || typeof style.height !== 'number') {
    throw new Error('if defined, height must be a number');
  }

  if (typeof style.width !== "undefined" || typeof style.width !== 'number') {
    throw new Error('if defined, width must be a number');
  }

  return style as Omit<JSX.CSSProperties, "height" | "width"> & { height?: number, width?: number };
}