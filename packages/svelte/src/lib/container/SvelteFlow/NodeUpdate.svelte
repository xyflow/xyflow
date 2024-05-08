<script lang="ts">
  import { onDestroy } from 'svelte';
  import { useStore } from '$lib/store';
  import type { InternalNode, Node } from '$lib/types';
  import { isNumeric } from '@xyflow/system';

  let {
    id,
    userNode
  }: {
    id: string;
    userNode: Node;
  } = $props();

  const store = useStore();

  // track changes of the parentNode
  let parentNode = $derived.by(() => {
    if (userNode.parentId) {
      return store.nodeLookup.get(userNode.parentId);
    }
    return null;
  });

  // TODO: reimplement
  // const selectedNodeZ: number = options?.elevateNodesOnSelect ? 1000 : 0;
  const selectedNodeZ: number = 1000;

  // Create internalNode on mount and add it to nodeLookup
  // _internalNode is untracked
  const _internalNode: InternalNode = {
    // ...options.defaults,
    ...userNode,
    selected: userNode.selected || false,
    measured: {
      width: userNode.measured?.width,
      height: userNode.measured?.height
    },
    internals: {
      // TODO: nodeOrigin is not considered
      positionAbsolute: parentNode
        ? {
            x: userNode.position.x + parentNode.internals.positionAbsolute.x,
            y: userNode.position.y + parentNode.internals.positionAbsolute.y
          }
        : { ...userNode.position },
      z:
        (isNumeric(userNode.zIndex) ? userNode.zIndex : 0) +
        (userNode.selected ? selectedNodeZ : 0),
      userNode
    }
  };

  store.nodeLookup.set(id, _internalNode);
  let internalNode = $derived(store.nodeLookup.get(id)!);

  if (userNode.parentId) {
    // TODO: childNodes needs to become a map
    const childNodes = store.parentLookup.get(userNode.parentId);
    if (childNodes) {
      childNodes.push(internalNode);
    } else {
      store.parentLookup.set(userNode.parentId, [internalNode]);
    }
  }

  onDestroy(() => {
    // removes itself from nodeLookup
    store.nodeLookup.delete(id);

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

  $effect.pre(() => {
    internalNode.measured.width = userNode.measured?.width;
    internalNode.measured.height = userNode.measured?.height;
  });

  // Reactively set positionAbsolute of child node
  $effect.pre(() => {
    internalNode.position.x = userNode.position.x;
    internalNode.position.y = userNode.position.y;

    // TODO: use recursive function
    internalNode.internals.positionAbsolute.x =
      userNode.position.x + (parentNode ? parentNode.internals.positionAbsolute.x : 0);
    internalNode.internals.positionAbsolute.y =
      userNode.position.y + (parentNode ? parentNode.internals.positionAbsolute.y : 0);
  });

  $effect.pre(() => {
    const childZIndex =
      (isNumeric(userNode.zIndex) ? userNode.zIndex : 0) + (userNode.selected ? selectedNodeZ : 0);
    const parentZIndex = parentNode ? parentNode.internals.z : 0;
    internalNode.internals.z = Math.max(parentZIndex, childZIndex);
  });

  $effect.pre(() => {
    if (internalNode.selected !== userNode.selected) {
      internalNode.selected = userNode.selected;
    }
  });

  $effect.pre(() => {
    if (internalNode.hidden !== userNode.hidden) {
      internalNode.hidden = userNode.hidden;
    }
    if (internalNode.type !== userNode.type) {
      internalNode.type = userNode.type;
    }
    if (internalNode.data !== userNode.data) {
      internalNode.data = userNode.data;
    }
    if (internalNode.style !== userNode.style) {
      internalNode.style = userNode.style;
    }
    if (internalNode.draggable !== userNode.draggable) {
      internalNode.draggable = userNode.draggable;
    }
    if (internalNode.selectable !== userNode.selectable) {
      internalNode.selectable = userNode.selectable;
    }
    if (internalNode.connectable !== userNode.connectable) {
      internalNode.connectable = userNode.connectable;
    }
    if (internalNode.deletable !== userNode.deletable) {
      internalNode.deletable = userNode.deletable;
    }
    if (internalNode.dragHandle !== userNode.dragHandle) {
      internalNode.dragHandle = userNode.dragHandle;
    }
    if (internalNode.parentId !== userNode.parentId) {
      internalNode.parentId = userNode.parentId;
    }
    if (internalNode.extent !== userNode.extent) {
      internalNode.extent = userNode.extent;
    }
    if (internalNode.ariaLabel !== userNode.ariaLabel) {
      internalNode.ariaLabel = userNode.ariaLabel;
    }
    if (internalNode.origin !== userNode.origin) {
      internalNode.origin = userNode.origin;
    }
  });

  $effect.pre(() => {
    internalNode.width = userNode.width;
    internalNode.height = userNode.height;
  });
</script>
