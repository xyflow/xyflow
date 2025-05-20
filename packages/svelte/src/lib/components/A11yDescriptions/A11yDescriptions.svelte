<script lang="ts" generics="NodeType extends Node = Node, EdgeType extends Edge = Edge">
  import type { SvelteFlowStore } from '$lib/store/types';
  import type { descriptions as DescriptionsType } from '@xyflow/system'; // Rename the imported type
  import type { Node, Edge } from '$lib/types';
  import { ARIA_EDGE_DESC_KEY, ARIA_LIVE_MESSAGE, ARIA_NODE_DESC_KEY } from '.';

  const { store, descriptions = {} }: { 
    store: SvelteFlowStore<NodeType, EdgeType>; 
    descriptions?: Partial<DescriptionsType>; 
  } = $props();


const defaultDescriptions = {
  'a11yDescription.node.default':
    'Press enter or space to select a node. Press delete to remove it and escape to cancel.',
  'a11yDescription.node.keyboardDisabled':
    'Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.',
  'a11yDescription.edge.default':
    'Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.',
};
</script>

<div id={`${ARIA_NODE_DESC_KEY}-${store.flowId}`} style="display: none;">
  {store.disableKeyboardA11y
    ? descriptions['a11yDescription.node.default'] || defaultDescriptions['a11yDescription.node.default']
    : descriptions['a11yDescription.node.keyboardDisabled'] || defaultDescriptions['a11yDescription.node.keyboardDisabled']}
</div>
<div id={`${ARIA_EDGE_DESC_KEY}-${store.flowId}`} style="display: none;">
  {descriptions['a11yDescription.edge.default'] || defaultDescriptions['a11yDescription.edge.default']}
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
