<script lang="ts">
  import { portal } from '$lib/actions/portal';
  import type { ViewportPortalProps } from './types';

  let { target = 'front', children, ...rest }: ViewportPortalProps = $props();
</script>

<div use:portal={`viewport-${target}`} {...rest}>
  {@render children?.()}
</div>
