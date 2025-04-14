<script lang="ts">
  import { portal } from '$lib/actions/portal';
  import type { ViewportPortalProps } from './types';

  let { children, ...rest }: ViewportPortalProps = $props();
</script>

<div use:portal={'viewport'} {...rest}>
  {@render children?.()}
</div>
