<script lang="ts">
  import type { PanelProps } from './types';

  let { position = 'top-right', style, class: className, children, ...rest }: PanelProps = $props();

  let positionClasses = $derived(`${position}`.split('-'));
</script>

<div class={['svelte-flow__panel', className, ...positionClasses]} {style} {...rest}>
  {@render children?.()}
</div>
