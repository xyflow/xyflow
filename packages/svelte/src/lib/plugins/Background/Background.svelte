<script lang="ts" module>
  const defaultSize = {
    [BackgroundVariant.Dots]: 1,
    [BackgroundVariant.Lines]: 1,
    [BackgroundVariant.Cross]: 6
  };
</script>

<script lang="ts">
  import cc from 'classcat';

  import { useStore } from '$lib/store';
  import { BackgroundVariant, type BackgroundProps } from './types';

  import DotPattern from './DotPattern.svelte';
  import LinePattern from './LinePattern.svelte';

  let {
    id,
    variant = BackgroundVariant.Dots,
    gap = 20,
    size = 1,
    lineWidth = 1,
    bgColor,
    patternColor,
    patternClass,
    class: className
  }: BackgroundProps = $props();

  const { viewport, flowId } = useStore();
  const patternSize = size ?? defaultSize[variant!];
  const isDots = variant === BackgroundVariant.Dots;
  const isCross = variant === BackgroundVariant.Cross;
  const gapXY: number[] = Array.isArray(gap!) ? gap! : [gap!, gap!];

  let patternId = $derived(`background-pattern-${$flowId}-${id ?? ''}`);
  let scaledGap = $derived([gapXY[0] * $viewport.zoom || 1, gapXY[1] * $viewport.zoom || 1]);
  let scaledSize = $derived(patternSize * $viewport.zoom);
  let patternDimensions = $derived(
    (isCross ? [scaledSize, scaledSize] : scaledGap) as [number, number]
  );
  let patternOffset = $derived(
    isDots ? [scaledSize / 2, scaledSize / 2] : [patternDimensions[0] / 2, patternDimensions[1] / 2]
  );
</script>

<svg
  class={cc(['svelte-flow__background', className])}
  data-testid="svelte-flow__background"
  style:--xy-background-color-props={bgColor}
  style:--xy-background-pattern-color-props={patternColor}
>
  <pattern
    id={patternId}
    x={$viewport.x % scaledGap[0]}
    y={$viewport.y % scaledGap[1]}
    width={scaledGap[0]}
    height={scaledGap[1]}
    patternUnits="userSpaceOnUse"
    patternTransform={`translate(-${patternOffset[0]},-${patternOffset[1]})`}
  >
    {#if isDots}
      <DotPattern radius={scaledSize / 2} class={patternClass} />
    {:else}
      <LinePattern dimensions={patternDimensions} {variant} {lineWidth} class={patternClass} />
    {/if}
  </pattern>
  <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} />
</svg>

<style>
  .svelte-flow__background {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
</style>
