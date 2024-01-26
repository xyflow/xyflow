<script lang="ts">
  import { getContext } from 'svelte';
  import {
    getNodesBounds,
    Position,
    type Rect,
    internalsSymbol,
    getNodeToolbarTransform
  } from '@xyflow/system';
  import portal from '$lib/actions/portal';
  import type { Node } from '$lib/types';
  import { useStore } from '$lib/store';

  import type { NodeToolbarProps } from './types';

  type $$Props = NodeToolbarProps;

  export let nodeId: $$Props['nodeId'] = undefined;
  export let position: $$Props['position'] = undefined;
  export let align: $$Props['align'] = undefined;
  export let offset: $$Props['offset'] = undefined;
  export let isVisible: $$Props['isVisible'] = undefined;

  const { domNode, viewport, nodeLookup, nodes, nodeOrigin } = useStore();
  const contextNodeId = getContext<string>('svelteflow__node_id');

  let transform: string;
  let toolbarNodes: Node[] = [];
  let _offset = offset !== undefined ? offset : 10;
  let _position = position !== undefined ? position : Position.Top;
  let _align = align !== undefined ? align : 'center';

  $: {
    // $nodes only needed to trigger updates, $nodeLookup is just a helper that does not trigger any updates
    if ($nodes) {
      const nodeIds = Array.isArray(nodeId) ? nodeId : [nodeId || contextNodeId];

      toolbarNodes = nodeIds.reduce<Node[]>((res, nodeId) => {
        const node = $nodeLookup.get(nodeId);

        if (node) {
          res.push(node);
        }

        return res;
      }, []);
    }
  }

  $: {
    let nodeRect: Rect | undefined = undefined;

    if (toolbarNodes.length === 1) {
      const toolbarNode = toolbarNodes[0];
      nodeRect = {
        ...toolbarNode.position,
        width: toolbarNode.computed?.width ?? toolbarNode.width ?? 0,
        height: toolbarNode.computed?.height ?? toolbarNode.height ?? 0
      };
    } else if (toolbarNodes.length > 1) {
      nodeRect = getNodesBounds(toolbarNodes, { nodeOrigin: $nodeOrigin });
    }

    if (nodeRect) {
      transform = getNodeToolbarTransform(nodeRect, $viewport, _position, _offset, _align);
    }
  }

  $: zIndex =
    toolbarNodes.length === 0
      ? 1
      : Math.max(...toolbarNodes.map((node) => (node[internalsSymbol]?.z || 5) + 1));

  //FIXME: Possible performance bottleneck
  $: selectedNodesCount = $nodes.filter((node) => node.selected).length;

  // if isVisible is not set, we show the toolbar only if its node is selected and no other node is selected
  $: isActive =
    typeof isVisible === 'boolean'
      ? isVisible
      : toolbarNodes.length === 1 && toolbarNodes[0].selected && selectedNodesCount === 1;
</script>

{#if $domNode && isActive && toolbarNodes}
  <div
    data-id={toolbarNodes.reduce((acc, node) => `${acc}${node.id} `, '').trim()}
    class="svelte-flow__node-toolbar"
    use:portal={{ domNode: $domNode }}
    style:position="absolute"
    style:transform
    style:z-index={zIndex}
  >
    <slot />
  </div>
{/if}
