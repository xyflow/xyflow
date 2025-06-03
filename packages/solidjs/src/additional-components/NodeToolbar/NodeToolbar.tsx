// import { useCallback, CSSProperties } from 'react';
import cc from 'classcat';
import { Rect, Position, getNodeToolbarTransform, getNodesBounds, Align } from '@xyflow/system';

import { InternalNode, SolidFlowState } from '../../types';
import { useStore } from '../../hooks/useStore';
import { useNodeId } from '../../contexts/NodeIdContext';
import { NodeToolbarPortal } from './NodeToolbarPortal';
import type { NodeToolbarProps } from './types';
import { mergeProps, JSX, splitProps, Show } from 'solid-js';

const nodeEqualityFn = (a?: InternalNode, b?: InternalNode) =>
  a?.internals.positionAbsolute.x !== b?.internals.positionAbsolute.x ||
  a?.internals.positionAbsolute.y !== b?.internals.positionAbsolute.y ||
  a?.measured.width !== b?.measured.width ||
  a?.measured.height !== b?.measured.height ||
  a?.selected !== b?.selected ||
  a?.internals.z !== b?.internals.z;

const nodesEqualityFn = (a: InternalNode[], b: InternalNode[]) => {
  if (a.length !== b.length) {
    return false;
  }

  return !a.some((node, i) => nodeEqualityFn(node, b[i]));
};

const storeSelector = (state: SolidFlowState) => ({
  viewport: () => ({
    x: state.transform.get()[0],
    y: state.transform.get()[1],
    zoom: state.transform.get()[2],
  }),
  nodeOrigin: state.nodeOrigin.get(),
  selectedNodesCount: state.nodes.get().filter((node) => node.selected).length,
});

export function NodeToolbar(_p: NodeToolbarProps) {
  //   nodeId,
  //   children,
  //   className,
  //   style,
  //   isVisible,
  //   position = Position.Top,
  //   offset = 10,
  //   align = 'center',
  //   ...rest
  // }: NodeToolbarProps) {
  const p = mergeProps({ position: Position.Top, offset: 10, align: 'center' as Align }, _p);

  const [_, rest] = splitProps(p, ['nodeId', 'children', 'class', 'style', 'isVisible', 'position', 'offset', 'align']);

  const getContextNodeId = useNodeId();

  const nodesSelector =
    (state: SolidFlowState): (() => InternalNode[]) =>
    () => {
      const nodeIds = Array.isArray(p.nodeId) ? p.nodeId : [p.nodeId || getContextNodeId() || ''];

      return nodeIds.reduce<InternalNode[]>((acc, id) => {
        const node = state.nodeLookup.get(id);
        if (node) {
          acc.push(node);
        }
        return acc;
      }, []);
    };
  const nodes = useStore(nodesSelector);
  const storeData = useStore(storeSelector);

  // if isVisible is not set, we show the toolbar only if its node is selected and no other node is selected
  const isActive = () =>
    typeof p.isVisible === 'boolean'
      ? p.isVisible
      : nodes.length === 1 && nodes()[0].selected && storeData.selectedNodesCount === 1;

  // if (!isActive || !nodes.length) {
  //   return null;
  // }

  const nodeRect = (): Rect => getNodesBounds(nodes(), { nodeOrigin: storeData.nodeOrigin });
  const zIndex = (): number => Math.max(...nodes().map((node) => node.internals.z + 1));

  const wrapperStyle = (): JSX.CSSProperties => ({
    position: 'absolute',
    transform: getNodeToolbarTransform(nodeRect(), storeData.viewport(), p.position, p.offset, p.align),
    'z-index': zIndex(),
    ...(typeof p.style === 'object' ? p.style : {}),
  });

  return (
    <Show when={isActive() && nodes().length > 0}>
      <NodeToolbarPortal>
        <div
          style={wrapperStyle()}
          class={cc(['react-flow__node-toolbar', p.class])}
          {...rest}
          data-id={nodes()
            .reduce((acc, node) => `${acc}${node.id} `, '')
            .trim()}
        >
          {p.children}
        </div>
      </NodeToolbarPortal>
    </Show>
  );
}
