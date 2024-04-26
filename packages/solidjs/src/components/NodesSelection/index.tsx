/**
 * The nodes selection rectangle gets displayed when a user
 * made a selection with on or several nodes
 */
// import { useRef, useEffect, type MouseEvent, type KeyboardEvent } from 'react';
import cc from 'classcat';
// import { shallow } from 'zustand/shallow';
import { getInternalNodesBounds } from '@xyflow/system';

import { useStore, useStoreApi } from '../../hooks/useStore';
import { useDrag } from '../../hooks/useDrag';
import { useMoveSelectedNodes } from '../../hooks/useMoveSelectedNodes';
import { arrowKeyDiffs } from '../NodeWrapper/utils';
import type { Node, SolidEvent, SolidFlowState } from '../../types';
import { Show, createEffect, createMemo } from 'solid-js';
import { useRef } from '../../utils/hooks';

export type NodesSelectionProps<NodeType> = {
  onSelectionContextMenu?: (event: SolidEvent<HTMLDivElement, MouseEvent>, nodes: NodeType[]) => void;
  noPanClassName?: string;
  disableKeyboardA11y: boolean;
};

const selector = (s: SolidFlowState) => {

  return () => {

    const { width, height, x, y } = getInternalNodesBounds(s.nodeLookup, {
      nodeOrigin: s.nodeOrigin.get(),
      filter: (node) => !!node.selected,
    });

    return {
      width,
      height,
      userSelectionActive: s.userSelectionActive,
      transformString: `translate(${s.transform.get()[0]}px,${s.transform.get()[1]}px) scale(${s.transform.get()[2]}) translate(${x}px,${y}px)`,
    };
  };
};

export function NodesSelection<NodeType extends Node>(p: NodesSelectionProps<NodeType>) {
//   {
//   onSelectionContextMenu,
//   noPanClassName,
//   disableKeyboardA11y,
// }: NodesSelectionProps<NodeType>) {
  const store = useStoreApi<NodeType>();
  const slice = createMemo(useStore(selector));
  const width = () => slice().width;
  const height = () => slice().height;
  const transformString = () => slice().transformString;
  const userSelectionActive = () => slice().userSelectionActive;
  // const { width, height, transformString, userSelectionActive } = useStore(selector);
  const moveSelectedNodes = useMoveSelectedNodes();

  const nodeRef = useRef<HTMLDivElement | null>(null);

  createEffect(() => {
    if (!p.disableKeyboardA11y) {
      nodeRef.current?.focus({
        preventScroll: true,
      });
    }
  });

  useDrag({
    nodeRef: () => nodeRef.current ?? undefined,
  });

  const shouldShow = () => {

  if (userSelectionActive() || !width() || !height()) {
    return false;
  } else {
    return true;
  }
  }



  const onContextMenu = (e: SolidEvent<HTMLDivElement, MouseEvent>) => {
    if (p.onSelectionContextMenu) {
      const selectedNodes = store.nodes.get().filter((n) => n.selected);
      p.onSelectionContextMenu(e, selectedNodes);

    }

  }

    // onSelectionContextMenu
    // ? (event: MouseEvent) => {
    //     const selectedNodes = store.getState().nodes.filter((n) => n.selected);
    //     onSelectionContextMenu(event, selectedNodes);
    //   }
    // : undefined;

  const onKeyDown = (event: KeyboardEvent) => {
    if (Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
      moveSelectedNodes({
        direction: arrowKeyDiffs[event.key],
        factor: event.shiftKey ? 4 : 1,
      });
    }
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (p.disableKeyboardA11y) {
      // do nothing
    } else  {
      onKeyDown(e);
    }
  }

  return (
    <Show when={shouldShow() }>
    <div
      class={cc(['react-flow__nodesselection', 'react-flow__container', p.noPanClassName])}
      style={{
        transform: transformString(),
      }}
    >
      <div
        ref={(node) => nodeRef.current = node}
        class="react-flow__nodesselection-rect"
        onContextMenu={onContextMenu}
        tabIndex={p.disableKeyboardA11y ? undefined : -1}
        onKeyDown={handleKeydown}
        style={{
          width: `${width()}px`,
          height: `${height()}px`,
        }}
      />
    </div>
    </Show>
  );
}
