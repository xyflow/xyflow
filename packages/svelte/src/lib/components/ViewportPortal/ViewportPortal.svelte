<script lang="ts">
  import { hideDuringSSR, portal } from '$lib/actions/portal';
  import type { ViewportPortalProps } from './types';

  let { target = 'front', children, ...rest }: ViewportPortalProps = $props();
</script>

<div use:portal={`viewport-${target}`} style:display={hideDuringSSR().display} {...rest}>
  {@render children?.()}
</div>
