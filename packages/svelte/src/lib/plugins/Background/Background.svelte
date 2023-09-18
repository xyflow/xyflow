<script labg="ts" context="module">
  const defaultSize = {
    [BackgroundVariant.Dots]: 1,
    [BackgroundVariant.Lines]: 1,
    [BackgroundVariant.Cross]: 6
  };
</script>

<script lang="ts">
  import cc from 'classcat';

  import DotPattern from './DotPattern.svelte';
  import LinePattern from './LinePattern.svelte';
  import { useStore } from '$lib/store';
  import { BackgroundVariant, type BackgroundProps } from './types';

  type $$Props = BackgroundProps;

  export let variant: $$Props['variant'] = BackgroundVariant.Dots;
  export let gap: $$Props['gap'] = 20;
  export let size: $$Props['size'] = 1;
  export let lineWidth: $$Props['lineWidth'] = 1;
  export let bgColor: $$Props['bgColor'] = undefined;
  export let patternColor: $$Props['patternColor'] = undefined;
  export let patternClass: $$Props['patternClass'] = undefined;
  let className: $$Props['class'] = '';
  export { className as class };

  const { transform, flowId } = useStore();
  const patternSize = size || defaultSize[variant!];
  const isDots = variant === BackgroundVariant.Dots;
  const isCross = variant === BackgroundVariant.Cross;
  const gapXY: number[] = Array.isArray(gap!) ? gap! : [gap!, gap!];

  $: patternId = `background-pattern-${$flowId}`;
  $: scaledGap = [gapXY[0] * $transform[2] || 1, gapXY[1] * $transform[2] || 1];
  $: scaledSize = patternSize * $transform[2];
  $: patternDimensions = (isCross ? [scaledSize, scaledSize] : scaledGap) as [number, number];
  $: patternOffset = isDots
    ? [scaledSize / 2, scaledSize / 2]
    : [patternDimensions[0] / 2, patternDimensions[1] / 2];
</script>

<svg
  class={cc(['svelte-flow__background', className])}
  data-testid="svelte-flow__background"
  style:--background-color-props={bgColor}
  style:--background-pattern-color-props={patternColor}
>
  <pattern
    id={patternId}
    x={$transform[0] % scaledGap[0]}
    y={$transform[1] % scaledGap[1]}
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
