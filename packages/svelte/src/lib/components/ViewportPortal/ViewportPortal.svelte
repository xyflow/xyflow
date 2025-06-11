<script lang="ts">
  import { hideOnSSR, portal } from '$lib/actions/portal';
  import type { ViewportPortalProps } from './types';

  let { target = 'front', children, ...rest }: ViewportPortalProps = $props();
</script>

<div
  use:portal={`viewport-${target}`}
  style:display={hideOnSSR().value ? 'none' : undefined}
  {...rest}
>
  {@render children?.()}
</div>
