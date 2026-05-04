<script lang="ts">
  import { Position, getNodeToolbarTransform } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import { getNodeIdContext } from '$lib/store/context';
  import { hideOnSSR, portal } from '$lib/actions/portal';
  import { useSvelteFlow } from '$lib/hooks/useSvelteFlow.svelte';

  import type { InternalNode } from '$lib/types';
  import type { NodeToolbarProps } from './types';

  let {
    nodeId,
    position = Position.Top,
    align = 'center',
    offset = 10,
    isVisible,
    children,
    ...rest
  }: NodeToolbarProps = $props();

  const store = useStore();

  const { getNodesBounds } = useSvelteFlow();
  const contextNodeId = getNodeIdContext();

  let toolbarNodes: InternalNode[] = $derived.by(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    store.nodes;
    const nodeIds = Array.isArray(nodeId) ? nodeId : [nodeId ?? contextNodeId];

    return nodeIds.reduce<InternalNode[]>((res, nodeId) => {
      if (!nodeId) {
        throw new Error('Either pass a nodeId or use within a Custom Node component');
      }
      const node = store.nodeLookup.get(nodeId);

      if (node) {
        res.push(node);
      }

      return res;
    }, []);
  });

  let transform: string = $derived.by(() => {
    const nodeRect = getNodesBounds(toolbarNodes);
    if (nodeRect) {
      return getNodeToolbarTransform(nodeRect, store.viewport, position, offset, align);
    }
    return '';
  });

  let zIndex = $derived(
    toolbarNodes.length === 0
      ? 1
      : Math.max(...toolbarNodes.map((node) => (node.internals.z || 5) + 1))
  );

  //FIXME: Possible performance bottleneck
  let selectedNodesCount = $derived(store.nodes.filter((node) => node.selected).length);

  // if isVisible is not set, we show the toolbar only if its node is selected and no other node is selected
  let isActive = $derived(
    typeof isVisible === 'boolean'
      ? isVisible
      : toolbarNodes.length === 1 && toolbarNodes[0].selected && selectedNodesCount === 1
  );
</script>

{#if store.domNode && isActive && toolbarNodes}
  <div
    use:portal={'root'}
    style:display={hideOnSSR().value ? 'none' : undefined}
    class="svelte-flow__node-toolbar"
    data-id={toolbarNodes.reduce((acc, node) => `${acc}${node.id} `, '').trim()}
    style:position="absolute"
    style:transform
    style:z-index={zIndex}
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}
