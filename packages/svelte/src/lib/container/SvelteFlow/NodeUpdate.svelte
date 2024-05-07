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

  // We fill up the parentLookup
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
    // TODO: Why is this check neccessary to prevent infinite loop?
    if (
      internalNode.measured?.width !== userNode.measured?.width ||
      internalNode.measured?.height !== userNode.measured?.height
    ) {
      internalNode.measured = {
        width: userNode.measured?.width,
        height: userNode.measured?.height
      };
    }
  });

  // Reactively set positionAbsolute of child node
  $effect.pre(() => {
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
    internalNode.selected = userNode.selected;
  });

  $effect.pre(() => {
    internalNode.hidden = userNode.hidden;
  });

  $effect.pre(() => {
    internalNode.type = userNode.type;
  });

  $effect.pre(() => {
    internalNode.data = userNode.data;
  });

  $effect.pre(() => {
    internalNode.style = userNode.style;
  });

  $effect.pre(() => {
    internalNode.draggable = userNode.draggable;
  });

  $effect.pre(() => {
    internalNode.selectable = userNode.selectable;
  });

  $effect.pre(() => {
    internalNode.connectable = userNode.connectable;
  });

  $effect.pre(() => {
    internalNode.deletable = userNode.deletable;
  });

  $effect.pre(() => {
    internalNode.dragHandle = userNode.dragHandle;
  });

  $effect.pre(() => {
    internalNode.width = userNode.width;
  });

  $effect.pre(() => {
    internalNode.height = userNode.height;
  });

  $effect.pre(() => {
    internalNode.parentId = userNode.parentId;
  });

  $effect.pre(() => {
    internalNode.extent = userNode.extent;
  });

  $effect.pre(() => {
    internalNode.ariaLabel = userNode.ariaLabel;
  });

  $effect.pre(() => {
    internalNode.origin = userNode.origin;
  });
</script>
