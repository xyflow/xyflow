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
  export let isVisible: boolean = true;

  const { domNode, viewport, nodeLookup, nodes, nodeOrigin } = useStore();
  const nodeIds = getContext<string | string[]>('svelteflow__node_id');
  let transform: string;

  $: {
    // $nodes only needed for triggering updates
    if ($nodes) {
      let toolbarNodes: Node[] = [];

      let nodeRect: Rect | undefined = undefined;

      // nodeIds is either an array of ids or just a single id
      if (nodeIds instanceof Array) {
        nodeIds.forEach((nodeId) => {
          const node = $nodeLookup.get(nodeId);
          if (node) {
            toolbarNodes.push(node);
          }
        });
        nodeRect = getNodesBounds(toolbarNodes, $nodeOrigin);
      } else {
        const node = $nodeLookup.get(nodeIds);
        if (node) {
          nodeRect = {
            ...node.position,
            width: node.width ? node.width : 0,
            height: node.height ? node.height : 0
          };
        }
      }

      if (nodeRect) {
        transform = getTransform(nodeRect, $viewport, position, offset, align);
      }
    }
  }

  //   $: isActive: typeof isVisible === 'boolean'
  //     ? isVisible
  //     : $nodes.length === 1 && $nodes[0].selected && selectedNodesCount === 1;
  //
</script>

{#if $domNode}
  <div
    class="svelte-flow__node-toolbar"
    style="position: absolute;"
    use:portal={{ domNode: $domNode }}
    style:transform
  >
    <slot />
  </div>
{/if}
