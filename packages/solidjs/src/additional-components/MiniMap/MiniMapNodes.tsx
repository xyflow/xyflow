/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { ComponentType, memo } from 'react';
import { getNodeDimensions, nodeHasDimensions } from '@xyflow/system';
// import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';
import { MiniMapNode } from './MiniMapNode';
import type { SolidFlowState, Node } from '../../types';
import type { MiniMapNodes as MiniMapNodesProps, GetMiniMapNodeAttribute, MiniMapNodeProps } from './types';
import { Component, For, Show, mergeProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

declare const window: any;

const selectorNodeIds = (s: SolidFlowState) => () => s.nodes.get().map((node) => node.id);
const getAttrFunction = <NodeType extends Node>(func: any): GetMiniMapNodeAttribute<NodeType> =>
  func instanceof Function ? func : () => func;

function MiniMapNodes<NodeType extends Node>(_p: MiniMapNodesProps<NodeType>) {
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
  const p = mergeProps(
    {
      nodeClassName: '',
      nodeBorderRadius: 5,
      nodeComponent: MiniMapNode,
    } satisfies Partial<MiniMapNodesProps<NodeType>>,
    _p
  );

  const nodeIds = useStore(selectorNodeIds);
  const nodeColorFunc = getAttrFunction<NodeType>(p.nodeColor);
  const nodeStrokeColorFunc = getAttrFunction<NodeType>(p.nodeStrokeColor);
  const nodeClassNameFunc = getAttrFunction<NodeType>(p.nodeClassName);

  const shapeRendering = typeof window === 'undefined' || !!window.chrome ? 'crispEdges' : 'geometricPrecision';

  // The split of responsibilities between MiniMapNodes and
  // NodeComponentWrapper may appear weird. However, it's designed to
  // minimize the cost of updates when individual nodes change.
  //
  // For more details, see a similar commit in `NodeRenderer/index.tsx`.

  return (
    <For each={nodeIds()}>
      {(nodeId) => (
        <NodeComponentWrapper<NodeType>
          id={nodeId}
          nodeColorFunc={nodeColorFunc}
          nodeStrokeColorFunc={nodeStrokeColorFunc}
          nodeClassNameFunc={nodeClassNameFunc}
          nodeBorderRadius={p.nodeBorderRadius}
          nodeStrokeWidth={p.nodeStrokeWidth}
          NodeComponent={p.nodeComponent}
          onClick={p.onClick}
          shapeRendering={shapeRendering}
        />
      )}
    </For>
  );
}

function NodeComponentWrapperInner<NodeType extends Node>(p: {
  id: string;
  nodeColorFunc: GetMiniMapNodeAttribute<NodeType>;
  nodeStrokeColorFunc: GetMiniMapNodeAttribute<NodeType>;
  nodeClassNameFunc: GetMiniMapNodeAttribute<NodeType>;
  nodeBorderRadius: number;
  nodeStrokeWidth?: number;
  NodeComponent: Component<MiniMapNodeProps>;
  onClick: MiniMapNodesProps['onClick'];
  shapeRendering: string;
}) {
  const storeData = useStore((s) => {
    const internalNode = s.nodeLookup.get(p.id);
    if (!internalNode) {
      return {
        node: () => null as NodeType | null,
        x: () => 0 as number,
        y: () => 0 as number,
        width: () => 0 as number,
        height: () => 0 as number,
      };
    }

    const userNode = internalNode.internals.userNode as NodeType;
    const positionAbsolute = internalNode.internals.positionAbsolute;
    const dimensions = getNodeDimensions(userNode);

    return {
      node: () => userNode as NodeType,
      x: () => positionAbsolute.x as number,
      y: () => positionAbsolute.y as number,
      width: () => dimensions.width as number,
      height: () => dimensions.height as number,
    };
  });

  return (
    <Show
      when={
        storeData.node() && !storeData.node()!.hidden && nodeHasDimensions(storeData.node()!) ? storeData.node() : false
      }
    >
      {(validNode) => (
        <Dynamic
          component={p.NodeComponent}
          x={storeData.x()}
          y={storeData.y()}
          width={storeData.width()}
          height={storeData.height()}
          style={validNode().style}
          selected={!!validNode().selected}
          className={p.nodeClassNameFunc(validNode())}
          color={p.nodeColorFunc(validNode())}
          borderRadius={p.nodeBorderRadius}
          strokeColor={p.nodeStrokeColorFunc(validNode())}
          strokeWidth={p.nodeStrokeWidth}
          shapeRendering={p.shapeRendering}
          onClick={p.onClick}
          id={validNode().id}
        />
      )}
    </Show>
  );
}

const NodeComponentWrapper = NodeComponentWrapperInner as typeof NodeComponentWrapperInner;

export default MiniMapNodes;
