<script lang="ts">
  import type { PanelProps } from './types';
  import { useStore } from '$lib/store';

  let { position = 'top-right', style, class: className, children, ...rest }: PanelProps = $props();

  let store = $derived(useStore());

  let positionClasses = $derived(`${position}`.split('-'));
</script>

<div
  class={['svelte-flow__panel', className, ...positionClasses]}
  {style}
  style:pointer-events={store.selectionRectMode ? 'none' : ''}
  {...rest}
>
  {@render children?.()}
</div>
