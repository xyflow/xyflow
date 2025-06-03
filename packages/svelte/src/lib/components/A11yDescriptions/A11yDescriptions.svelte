<script lang="ts" generics="NodeType extends Node = Node, EdgeType extends Edge = Edge">
  import type { SvelteFlowStore } from '$lib/store/types';
  import type { Node, Edge } from '$lib/types';
  import { ARIA_EDGE_DESC_KEY, ARIA_LIVE_MESSAGE, ARIA_NODE_DESC_KEY } from '.';

  let { store }: { store: SvelteFlowStore<NodeType, EdgeType> } = $props();
</script>

<div id={`${ARIA_NODE_DESC_KEY}-${store.flowId}`} class="a11y-hidden">
  {store.disableKeyboardA11y
    ? store.ariaLabelConfig['node.a11yDescription.default']
    : store.ariaLabelConfig['node.a11yDescription.keyboardDisabled']}
</div>
<div id={`${ARIA_EDGE_DESC_KEY}-${store.flowId}`} class="a11y-hidden">
  {store.ariaLabelConfig['edge.a11yDescription.default']}
</div>

{#if !store.disableKeyboardA11y}
  <div
    id={`${ARIA_LIVE_MESSAGE}-${store.flowId}`}
    aria-live="assertive"
    aria-atomic="true"
    class="a11y-live-msg"
  >
    {store.ariaLiveMessage}
  </div>
{/if}

<style>
  .a11y-hidden {
    display: none;
  }

  .a11y-live-msg {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    border: 0;
    padding: 0;
    overflow: hidden;
    clip: rect(0px, 0px, 0px, 0px);
    clip-path: inset(100%);
  }
</style>
