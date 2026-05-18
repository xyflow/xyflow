<script lang="ts" generics="NodeType extends Node = Node, EdgeType extends Edge = Edge">
  import { onDestroy } from 'svelte';
  import {
    elementSelectionKeys,
    errorMessages,
    isInputDOMNode,
    nodeHasDimensions,
    Position,
    getNodesInside
  } from '@xyflow/system';

  import drag from '$lib/actions/drag';
  import { setNodeConnectableContext, setNodeIdContext } from '$lib/store/context';
  import { arrowKeyDiffs, toPxString } from '$lib/utils';
  import { ARIA_NODE_DESC_KEY } from '../A11yDescriptions';

  import type { Node, Edge, NodeEvents } from '$lib/types';
  import type { ConnectableContext, NodeWrapperProps } from './types';

  import DefaultNode from '$lib/components/nodes/DefaultNode.svelte';

  let {
    store = $bindable(),
    node,
    resizeObserver,
    nodeClickDistance,
    onnodeclick,
    onnodedrag,
    onnodedragstart,
    onnodedragstop,
    onnodepointerenter,
    onnodepointerleave,
    onnodepointermove,
    onnodecontextmenu
  }: NodeWrapperProps<NodeType, EdgeType> & NodeEvents<NodeType> = $props();

  let {
    data = {},
    selected = false,
    draggable: _draggable,
    selectable: _selectable,
    deletable = true,
    connectable: _connectable,
    focusable: _focusable,
    hidden = false,
    dragging = false,
    style = '',
    class: className,
    type = 'default',
    parentId,
    sourcePosition,
    targetPosition,
    measured: { width: measuredWidth, height: measuredHeight } = { width: 0, height: 0 },
    initialWidth,
    initialHeight,
    width,
    height,
    dragHandle,
    internals: {
      z: zIndex = 0,
      positionAbsolute: { x: positionX, y: positionY },
      userNode
    }
  } = $derived(node);

  let { id } = node;

  let draggable = $derived(_draggable ?? store.nodesDraggable);
  let selectable = $derived(_selectable ?? store.elementsSelectable);
  let connectable = $derived(_connectable ?? store.nodesConnectable);
  let hasDimensions = $derived(nodeHasDimensions(node));
  let hasHandleBounds = $derived(!!node.internals.handleBounds);
  let isInitialized = $derived(hasDimensions && hasHandleBounds);
  let focusable = $derived(_focusable ?? store.nodesFocusable);

  function isInParentLookup(id: string) {
    return store.parentLookup.has(id);
  }

  let isParent = $derived(isInParentLookup(id));

  let nodeRef: HTMLDivElement | null = $state(null);
  let prevNodeRef: HTMLDivElement | null = null;

  // svelte-ignore state_referenced_locally
  let prevType: string | undefined = type;
  // svelte-ignore state_referenced_locally
  let prevSourcePosition: Position | undefined = sourcePosition;
  // svelte-ignore state_referenced_locally
  let prevTargetPosition: Position | undefined = targetPosition;

  let NodeComponent = $derived(store.nodeTypes[type] ?? DefaultNode);
  let ariaLabelConfig = $derived(store.ariaLabelConfig);

  let connectableContext: ConnectableContext = {
    get value() {
      return connectable;
    }
  };

  setNodeIdContext(id);
  setNodeConnectableContext(connectableContext);

  if (process.env.NODE_ENV === 'development') {
    $effect(() => {
      const valid = !!store.nodeTypes[type];
      if (!valid) {
        console.warn('003', errorMessages['error003'](type!));
      }
    });
  }

  let nodeStyle = $derived.by(() => {
    const w = measuredWidth === undefined ? (width ?? initialWidth) : width;
    const h = measuredHeight === undefined ? (height ?? initialHeight) : height;

    if (w === undefined && h === undefined && style === undefined) {
      return undefined;
    }

    return `${style};${w ? `width:${toPxString(w)};` : ''}${h ? `height:${toPxString(h)};` : ''}`;
  });

  $effect(() => {
    // if type, sourcePosition or targetPosition changes,
    // we need to re-calculate the handle positions
    const doUpdate =
      type !== prevType ||
      sourcePosition !== prevSourcePosition ||
      targetPosition !== prevTargetPosition;

    if (doUpdate && nodeRef !== null) {
      requestAnimationFrame(() => {
        if (nodeRef !== null) {
          store.updateNodeInternals(
            new Map([
              [
                id,
                {
                  id,
                  nodeElement: nodeRef,
                  force: true
                }
              ]
            ])
          );
        }
      });
    }

    prevType = type;
    prevSourcePosition = sourcePosition;
    prevTargetPosition = targetPosition;
  });

  $effect(() => {
    /* eslint-disable @typescript-eslint/no-unused-expressions */
    if (resizeObserver && (!isInitialized || nodeRef !== prevNodeRef)) {
      prevNodeRef && resizeObserver.unobserve(prevNodeRef);
      nodeRef && resizeObserver.observe(nodeRef);
      prevNodeRef = nodeRef;
    }
    /* eslint-enable @typescript-eslint/no-unused-expressions */
  });

  onDestroy(() => {
    if (prevNodeRef) {
      resizeObserver?.unobserve(prevNodeRef);
    }
  });

  function onSelectNodeHandler(event: MouseEvent | TouchEvent) {
    if (selectable && (!store.selectNodesOnDrag || !draggable || store.nodeDragThreshold > 0)) {
      // this handler gets called by XYDrag on drag start when selectNodesOnDrag=true
      // here we only need to call it when selectNodesOnDrag=false
      store.handleNodeSelection(id);
    }

    onnodeclick?.({ node: userNode, event });
  }

  function onKeyDown(event: KeyboardEvent) {
    if (isInputDOMNode(event) || store.disableKeyboardA11y) {
      return;
    }

    if (elementSelectionKeys.includes(event.key) && selectable) {
      const unselect = event.key === 'Escape';

      store.handleNodeSelection(id, unselect, nodeRef);
    } else if (
      draggable &&
      node.selected &&
      Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)
    ) {
      // prevent default scrolling behavior on arrow key press when node is moved
      event.preventDefault();
      store.ariaLiveMessage = ariaLabelConfig['node.a11yDescription.ariaLiveMessage']({
        direction: event.key.replace('Arrow', '').toLowerCase(),
        x: ~~node.internals.positionAbsolute.x,
        y: ~~node.internals.positionAbsolute.y
      });
      store.moveSelectedNodes(arrowKeyDiffs[event.key], event.shiftKey ? 4 : 1);
    }
  }

  const onFocus = () => {
    if (
      store.disableKeyboardA11y ||
      !store.autoPanOnNodeFocus ||
      !nodeRef?.matches(':focus-visible')
    ) {
      return;
    }

    const { width, height, viewport } = store;

    const withinViewport =
      getNodesInside(
        new Map([[id, node]]),
        { x: 0, y: 0, width, height },
        [viewport.x, viewport.y, viewport.zoom],
        true
      ).length > 0;

    if (!withinViewport) {
      store.setCenter(
        node.position.x + (node.measured.width ?? 0) / 2,
        node.position.y + (node.measured.height ?? 0) / 2,
        { zoom: viewport.zoom }
      );
    }
  };
</script>

{#if !hidden}
  <div
    use:drag={{
      nodeId: id,
      isSelectable: selectable,
      disabled: !draggable,
      handleSelector: dragHandle,
      noDragClass: store.noDragClass,
      nodeClickDistance,
      onNodeMouseDown: store.handleNodeSelection,
      onDrag: (event, _, targetNode, nodes) => {
        onnodedrag?.({ event, targetNode: targetNode as NodeType, nodes: nodes as NodeType[] });
      },
      onDragStart: (event, _, targetNode, nodes) => {
        onnodedragstart?.({
          event,
          targetNode: targetNode as NodeType,
          nodes: nodes as NodeType[]
        });
      },
      onDragStop: (event, _, targetNode, nodes) => {
        onnodedragstop?.({ event, targetNode: targetNode as NodeType, nodes: nodes as NodeType[] });
      },
      store
    }}
    bind:this={nodeRef}
    data-id={id}
    class={['svelte-flow__node', `svelte-flow__node-${type}`, className]}
    class:dragging
    class:selected
    class:draggable
    class:connectable
    class:selectable
    class:nopan={draggable}
    class:parent={isParent}
    style:z-index={zIndex}
    style:transform="translate({positionX}px, {positionY}px)"
    style:visibility={hasDimensions ? 'visible' : 'hidden'}
    style={nodeStyle}
    onclick={onSelectNodeHandler}
    onpointerenter={onnodepointerenter
      ? (event) => onnodepointerenter({ node: userNode, event })
      : undefined}
    onpointerleave={onnodepointerleave
      ? (event) => onnodepointerleave({ node: userNode, event })
      : undefined}
    onpointermove={onnodepointermove
      ? (event) => onnodepointermove({ node: userNode, event })
      : undefined}
    oncontextmenu={onnodecontextmenu
      ? (event) => onnodecontextmenu({ node: userNode, event })
      : undefined}
    onkeydown={focusable ? onKeyDown : undefined}
    onfocus={focusable ? onFocus : undefined}
    tabIndex={focusable ? 0 : undefined}
    role={node.ariaRole ?? (focusable ? 'group' : undefined)}
    aria-roledescription="node"
    aria-describedby={store.disableKeyboardA11y
      ? undefined
      : `${ARIA_NODE_DESC_KEY}-${store.flowId}`}
    {...node.domAttributes}
  >
    <NodeComponent
      {data}
      {id}
      {selected}
      {selectable}
      {deletable}
      {sourcePosition}
      {targetPosition}
      {zIndex}
      {dragging}
      {draggable}
      {dragHandle}
      {parentId}
      {type}
      isConnectable={connectable}
      positionAbsoluteX={positionX}
      positionAbsoluteY={positionY}
      {width}
      {height}
    />
  </div>
{/if}
