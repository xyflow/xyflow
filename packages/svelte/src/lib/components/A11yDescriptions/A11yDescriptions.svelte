<script lang="ts" generics="NodeType extends Node = Node, EdgeType extends Edge = Edge">
  import type { SvelteFlowStore } from '$lib/store/types';
  import type { Node, Edge } from '$lib/types';
  import { ARIA_EDGE_DESC_KEY, ARIA_LIVE_MESSAGE, ARIA_NODE_DESC_KEY } from '.';

  let { store }: { store: SvelteFlowStore<NodeType, EdgeType> } = $props();
</script>

<div id={`${ARIA_NODE_DESC_KEY}-${store.flowId}`} style="display: none;">
  Press enter or space to select a node.
  {#if !store.disableKeyboardA11y}
    You can then use the arrow keys to move the node around.
  {/if}
  Press delete to remove it and escape to cancel.{' '}
</div>
<div id={`${ARIA_EDGE_DESC_KEY}-${store.flowId}`} style="display: none;">
  Press enter or space to select an edge. You can then press delete to remove it or escape to
  cancel.
</div>

{#if !store.disableKeyboardA11y}
  <div
    id={`${ARIA_LIVE_MESSAGE}-${store.flowId}`}
    aria-live="assertive"
    aria-atomic="true"
    style="position: absolute; width: 1px; height: 1px; margin: -1px; border: 0; padding: 0; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); clip-path: inset(100%);"
  >
    {store.ariaLiveMessage}
  </div>
{/if}
