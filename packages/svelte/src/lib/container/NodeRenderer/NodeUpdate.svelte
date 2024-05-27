<script lang="ts">
  import { onDestroy } from 'svelte';
  import { useStore } from '$lib/store';
  import type { InternalNode, Node } from '$lib/types';
  import {
    getPositionWithOrigin,
    isNumeric,
    getNodeDimensions,
    nodeHasDimensions,
    type NodeHandleBounds
  } from '@xyflow/system';
  import { useUpdateNodeInternals } from '$lib/hooks/useUpdateNodeInternals';
  import type { NodeEvents } from '$lib/types/events';
  import NodeWrapper from '$lib/components/NodeWrapper/NodeWrapper.svelte';

  let {
    id,
    userNode,
    resizeObserver,
    onnodeclick,
    onnodemouseenter,
    onnodemousemove,
    onnodemouseleave,
    onnodedrag,
    onnodedragstart,
    onnodedragstop,
    onnodecontextmenu
  }: {
    id: string;
    userNode: Node;
    resizeObserver?: ResizeObserver | null;
  } & NodeEvents = $props();

  const store = useStore();

  // track changes of the parentNode
  let parentNode = $derived.by(() => {
    if (userNode.parentId) {
      return store.nodeLookup.get(userNode.parentId);
    }
    return null;
  });

  let positionAbosluteX = $derived(
    userNode.position.x + (parentNode ? parentNode.internals.positionAbsolute.x : 0)
  );
  let positionAbosluteY = $derived(
    userNode.position.y + (parentNode ? parentNode.internals.positionAbsolute.y : 0)
  );

  let posOrigin = $derived(
    getPositionWithOrigin({
      x: positionAbosluteX,
      y: positionAbosluteY,
      ...getNodeDimensions(userNode),
      origin: userNode.origin
    })
  );

  const selectedNodeZ: number = 2000;
  let zIndex = $derived.by(() => {
    userNode.selected;
    const childZIndex =
      (isNumeric(userNode.zIndex) ? userNode.zIndex : 0) + (userNode.selected ? selectedNodeZ : 0);
    const parentZIndex = parentNode ? parentNode.internals.z : 0;
    if (parentNode) {
      console.log(id, parentNode, parentZIndex, childZIndex);
    }
    return Math.max(parentZIndex, childZIndex);
  });

  // TODO: update node internals if sourcePosition or targetPosition changes
  // const updateInternals = useUpdateNodeInternals();

  let handleBounds: NodeHandleBounds = $state({
    source: null,
    target: null
  });

  const internals = {
    positionAbsolute: {
      get x() {
        return positionAbosluteX;
      },
      get y() {
        return positionAbosluteY;
      }
    },
    get z() {
      return zIndex;
    },
    get userNode() {
      return userNode;
    },
    get handleBounds() {
      return handleBounds;
    }
  };

  const internalNode: InternalNode = {
    get id() {
      return userNode.id;
    },
    get position() {
      return userNode.position;
    },
    get dragging() {
      return userNode.dragging;
    },
    get hidden() {
      return userNode.hidden;
    },
    get type() {
      return userNode.type;
    },
    get style() {
      return userNode.style;
    },
    get draggable() {
      return userNode.draggable;
    },
    get data() {
      return userNode.data;
    },
    get selectable() {
      return userNode.selectable;
    },
    get connectable() {
      return userNode.connectable;
    },
    get deletable() {
      return userNode.deletable;
    },
    get dragHandle() {
      return userNode.dragHandle;
    },
    get parentId() {
      return userNode.parentId;
    },
    get extent() {
      return userNode.extent;
    },
    get ariaLabel() {
      return userNode.ariaLabel;
    },
    get origin() {
      return userNode.origin;
    },
    get class() {
      return userNode.class;
    },
    get sourcePosition() {
      return userNode.sourcePosition;
    },
    get targetPosition() {
      return userNode.targetPosition;
    },
    get initialWidth() {
      return userNode.initialWidth;
    },
    get initialHeight() {
      return userNode.initialHeight;
    },
    get selected() {
      return userNode.selected;
    },
    measured: {
      get width() {
        return userNode.measured?.width;
      },
      get height() {
        return userNode.measured?.height;
      }
    },
    get internals() {
      return internals;
    },
    set internals(internals) {
      handleBounds = internals.handleBounds;
    }
  };

  store.nodeLookup.set(id, internalNode);

  $effect.pre(() => {
    if (userNode.selected) {
      store.selectedNodes.set(id, internalNode);
    } else {
      store.selectedNodes.delete(id);
    }
  });

  $effect.pre(() => {
    if (userNode.parentId) {
      // TODO: childNodes needs to become a map
      const childNodes = store.parentLookup.get(userNode.parentId);
      if (childNodes) {
        childNodes.push(internalNode);
      } else {
        store.parentLookup.set(userNode.parentId, [internalNode]);
      }
    }
  });

  onDestroy(() => {
    // removes itself from nodeLookup
    store.nodeLookup.delete(id);
    store.selectedNodes.delete(id);

    //removes itself from parentLookup
    if (userNode.parentId) {
      const childNodes = store.parentLookup.get(userNode.parentId);
      if (childNodes) {
        const index = childNodes.findIndex((node) => node.id === id);
        if (index !== -1) {
          childNodes.splice(index, 1);
        }
      }
    }
  });
</script>

<NodeWrapper
  node={internalNode}
  {id}
  data={userNode.data}
  hidden={userNode.hidden}
  selected={userNode.selected}
  draggable={!!(
    userNode.draggable ||
    (store.nodesDraggable && typeof userNode.draggable === 'undefined')
  )}
  selectable={!!(
    userNode.selectable ||
    (store.elementsSelectable && typeof userNode.selectable === 'undefined')
  )}
  connectable={!!(
    userNode.connectable ||
    (store.nodesConnectable && typeof userNode.connectable === 'undefined')
  )}
  positionX={positionAbosluteX}
  positionY={positionAbosluteY}
  positionOriginX={posOrigin.x ?? 0}
  positionOriginY={posOrigin.y ?? 0}
  isParent={store.parentLookup.has(userNode.id)}
  style={userNode.style}
  class={userNode.class}
  type={userNode.type}
  sourcePosition={userNode.sourcePosition}
  targetPosition={userNode.targetPosition}
  dragging={userNode.dragging}
  {zIndex}
  dragHandle={userNode.dragHandle}
  initialized={nodeHasDimensions(userNode)}
  width={userNode.width}
  height={userNode.height}
  initialWidth={userNode.initialWidth}
  initialHeight={userNode.initialHeight}
  measuredWidth={userNode.measured?.width}
  measuredHeight={userNode.measured?.height}
  {resizeObserver}
  {onnodeclick}
  {onnodemouseenter}
  {onnodemousemove}
  {onnodemouseleave}
  {onnodedrag}
  {onnodedragstart}
  {onnodedragstop}
  {onnodecontextmenu}
/>
