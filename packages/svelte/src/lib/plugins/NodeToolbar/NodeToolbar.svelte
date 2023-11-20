<script lang="ts">
  import { getContext } from 'svelte';
  import { getNodesBounds, type Position, type Rect } from '@xyflow/system';
  import portal from '$lib/actions/portal';
  import type { Node } from '$lib/types';
  import { useStore } from '$lib/store';

  import { getTransform } from './utils';
  import type { Align } from './types';

  export let position: Position;
  export let align: Align;
  export let offset: number = 10;
  export let isVisible: boolean;

  const { domNode, viewport, nodeLookup, nodes, nodeOrigin } = useStore();
  const nodeIds = getContext<string | string[]>('svelteflow__node_id');
  let transform: string;

  let toolbarNodes: Node[] = [];

  $: {
    // $nodes only needed to trigger updates
    if ($nodes) {
      toolbarNodes = [];

      // nodeIds is either an array of ids or just a single id
      if (nodeIds instanceof Array) {
        nodeIds.forEach((nodeId) => {
          const node = $nodeLookup.get(nodeId);
          if (node) {
            toolbarNodes.push(node);
          }
        });
      } else {
        const node = $nodeLookup.get(nodeIds);
        if (node) {
          toolbarNodes.push(node);
        }
      }
    }
  }

  $: {
    let nodeRect: Rect | undefined = undefined;

    if (toolbarNodes.length === 1) {
      nodeRect = {
        ...toolbarNodes[0].position,
        width: toolbarNodes[0].width ? toolbarNodes[0].width : 0,
        height: toolbarNodes[0].height ? toolbarNodes[0].height : 0
      };
    } else if (toolbarNodes.length > 1) {
      nodeRect = getNodesBounds(toolbarNodes, $nodeOrigin);
    }

    if (nodeRect) {
      transform = getTransform(nodeRect, $viewport, position, offset, align);
    }
  }

  //FIXME: Possible performance bottleneck
  $: selectedNodesCount = $nodes.filter((node) => node.selected).length;

  // if isVisible is not set, we show the toolbar only if its node is selected and no other node is selected
  $: isActive =
    typeof isVisible === 'boolean'
      ? isVisible
      : toolbarNodes.length === 1 && toolbarNodes[0].selected && selectedNodesCount === 1;
</script>

{#if $domNode && isActive}
  <div
    class="svelte-flow__node-toolbar"
    style="position: absolute;"
    use:portal={{ domNode: $domNode }}
    style:transform
  >
    <slot />
  </div>
{/if}
