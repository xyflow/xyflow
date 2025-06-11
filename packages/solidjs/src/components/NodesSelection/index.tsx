/**
 * The nodes selection rectangle gets displayed when a user
 * made a selection with on or several nodes
 */
// import { useRef, useEffect, type MouseEvent, type KeyboardEvent } from 'react';
import cc from 'classcat';
// import { shallow } from 'zustand/shallow';
import { getInternalNodesBounds, isNumeric } from '@xyflow/system';

import { useStore, useStoreApi } from '../../hooks/useStore';
import { useDrag } from '../../hooks/useDrag';
import { useMoveSelectedNodes } from '../../hooks/useMoveSelectedNodes';
import { arrowKeyDiffs } from '../NodeWrapper/utils';
import type { Node, SolidEvent, SolidFlowState } from '../../types';
import { Show, createEffect } from 'solid-js';
import { useRef } from '../../utils/hooks';

export type NodesSelectionProps<NodeType> = {
  onSelectionContextMenu?: (event: SolidEvent<HTMLDivElement, MouseEvent>, nodes: NodeType[]) => void;
  noPanClassName?: string;
  disableKeyboardA11y: boolean;
};

const selector = (s: SolidFlowState) => {
  const { width, height, x, y } = getInternalNodesBounds(s.nodeLookup, {
    filter: (node) => !!node.selected,
  });

  return {
    width: () => (isNumeric(width) ? width : null),
    height: () => (isNumeric(height) ? height : null),
    userSelectionActive: () => s.userSelectionActive.get(),
    transformString: () =>
      `translate(${s.transform.get()[0]}px,${s.transform.get()[1]}px) scale(${
        s.transform.get()[2]
      }) translate(${x}px,${y}px)`,
  };
};

export function NodesSelection<NodeType extends Node>(p: NodesSelectionProps<NodeType>) {
  const store = useStoreApi<NodeType>();
  const storeData = useStore(selector);
  const moveSelectedNodes = useMoveSelectedNodes();
  let nodeRef: HTMLDivElement | null = null;

  const shouldShow = () => {
    return !(storeData.userSelectionActive() || !storeData.width() || !storeData.height());
  };

  const onContextMenu = (e: MouseEvent) => {
    if (p.onSelectionContextMenu) {
      const selectedNodes = store.nodes.get().filter((n) => n.selected);
      p.onSelectionContextMenu(e as any, selectedNodes);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
      event.preventDefault();

      moveSelectedNodes({
        direction: arrowKeyDiffs[event.key],
        factor: event.shiftKey ? 4 : 1,
      });
    }
  };

  return (
    <Show when={shouldShow()}>
      <div
        class={cc(['react-flow__nodesselection', 'react-flow__container', p.noPanClassName])}
        style={{
          transform: storeData.transformString(),
        }}
      >
        <div
          ref={(node) => (nodeRef = node)}
          class="react-flow__nodesselection-rect"
          onContextMenu={onContextMenu}
          tabIndex={p.disableKeyboardA11y ? undefined : -1}
          onKeyDown={p.disableKeyboardA11y ? undefined : onKeyDown}
          style={{
            width: `${storeData.width()}px`,
            height: `${storeData.height()}px`,
          }}
        />
      </div>
    </Show>
  );
}
