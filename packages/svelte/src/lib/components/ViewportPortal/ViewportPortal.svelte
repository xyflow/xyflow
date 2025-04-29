<script lang="ts">
  import { portal } from '$lib/actions/portal';
  import type { ViewportPortalProps } from './types';

  let { moveTo = 'front', children, ...rest }: ViewportPortalProps = $props();
</script>

<div use:portal={`viewport-${moveTo}`} {...rest}>
  {@render children?.()}
</div>
